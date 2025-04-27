const User = require('../models/userModel');
const Otp = require('../models/otpModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send Signup OTP email
const sendSignupOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for AniChat Signup',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #333; text-align: center;">Welcome to AniChat!</h2>
                <p>Dear User,</p>
                <p>Thank you for signing up with AniChat. Please use the following OTP to verify your email and complete your registration:</p>
                <div style="background-color: #f7f7f7; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This OTP will expire in 5 minutes.</p>
                <p>If you did not request this signup, please ignore this email or contact our support team.</p>
                <p>Best regards,<br>AniChat Team</p>
            </div>`,
    };

    await transporter.sendMail(mailOptions);
};

// Send Forgot Password OTP email
const sendForgotPasswordEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for AniChat Password Reset',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                <p>Dear User,</p>
                <p>We received a request to reset your AniChat account password. Please use the following OTP to verify your identity and proceed with the password reset:</p>
                <div style="background-color: #f7f7f7; padding: 10px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This OTP will expire in 5 minutes.</p>
                <p>If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
                <p>Best regards,<br>AniChat Team</p>
            </div>`,
    };

    await transporter.sendMail(mailOptions);
};

// Generate 6-digit OTP
const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const sendResponseWithToken = (user, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const { password: pass, ...rest } = user._doc;

    res.cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
    }).status(200).json({
        success: true,
        message: 'User logged in successfully',
        user: rest,
    });
};

// Use multer middleware for signup to handle multipart/form-data
exports.signup = [
    upload.single('avatar'),
    async (req, res, next) => {
        try {
            const { fullName, email, password } = req.body;

            if (!fullName || !email || !password) {
                return next(new ErrorHandler('Please provide all required fields', 400));
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return next(new ErrorHandler('Invalid email format', 400));
            }
            if (password.length < 6) {
                return next(new ErrorHandler('Password must be at least 6 characters', 400));
            }
            if (fullName.length < 3) {
                return next(new ErrorHandler('Full name must be at least 3 characters', 400));
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return next(new ErrorHandler('User already exists', 400));
            }

            // Handle avatar upload to Cloudinary if present
            let avatarUrl = '';
            if (req.file) {
                const result = await cloudinary.uploader.upload_stream(
                    { folder: 'anichat/avatars', width: 200, height: 200, crop: 'fill' },
                    (error, result) => {
                        if (error) {
                            return next(new ErrorHandler('Failed to upload avatar', 500));
                        }
                        return result;
                    }
                );
                req.file.stream.pipe(result);
                avatarUrl = result.secure_url;
            }

            // Generate OTP
            const otp = generateOtp();
            const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

            // Hash password before storing
            const hashedPassword = await bcrypt.hash(password, 10);

            // Store OTP in MongoDB
            await Otp.findOneAndUpdate(
                { email },
                { email, otp, fullName, password: hashedPassword, avatar: avatarUrl, expires: otpExpires },
                { upsert: true, new: true }
            );

            // Send OTP to user's email
            await sendSignupOtpEmail(email, otp);

            res.status(200).json({
                success: true,
                message: 'OTP sent to your email. Please verify to complete signup.',
            });
        } catch (error) {
            console.error('Signup error:', error);
            return next(new ErrorHandler('Internal server error', 500));
        }
    }
];

exports.verifyOtp = async (req, res, next) => {
    const { email, otp } = req.body;
    try {
        // Retrieve OTP data
        const otpData = await Otp.findOne({ email });
        if (!otpData) {
            return next(new ErrorHandler('OTP not found or expired', 400));
        }

        // Verify OTP
        if (otpData.otp !== otp) {
            return next(new ErrorHandler('Invalid OTP', 400));
        }

        // OTP is valid, create user
        const newUser = await User.create({
            fullName: otpData.fullName,
            email: otpData.email,
            password: otpData.password, // Already hashed
            avatar: otpData.avatar,
        });

        // Clear OTP from database
        await Otp.deleteOne({ email });

        // Send response with token
        sendResponseWithToken(newUser, res);
    } catch (error) {
        console.error('Verify OTP error:', error);
        return next(new ErrorHandler('Internal server error', 500));
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return next(new ErrorHandler('Please provide email and password', 400));
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return next(new ErrorHandler('Invalid credentials', 400));
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return next(new ErrorHandler('Invalid credentials', 400));
        }
        sendResponseWithToken(existingUser, res);
    } catch (error) {
        console.error('Login error:', error);
        return next(new ErrorHandler('Internal server error', 500));
    }
};

exports.logout = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        }).status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    } catch (error) {
        console.error('Logout error:', error);
        return next(new ErrorHandler('Internal server error: Unable to logout', 500));
    }
};

exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        if (!email) {
            return next(new ErrorHandler('Please provide an email', 400));
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new ErrorHandler('Invalid email format', 400));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Generate OTP
        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

        // Store OTP in MongoDB
        await Otp.findOneAndUpdate(
            { email },
            { email, otp, expires: otpExpires },
            { upsert: true, new: true }
        );

        // Send OTP to user's email
        await sendForgotPasswordEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email. Please verify to reset password.',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return next(new ErrorHandler('Internal server error', 500));
    }
};

exports.resetPassword = async (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    try {
        // Validate inputs
        if (!email || !otp || !newPassword) {
            return next(new ErrorHandler('Please provide email, OTP, and new password', 400));
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return next(new ErrorHandler('Invalid email format', 400));
        }
        if (newPassword.length < 6) {
            return next(new ErrorHandler('New password must be at least 6 characters', 400));
        }

        // Retrieve OTP data
        const otpData = await Otp.findOne({ email });
        if (!otpData) {
            return next(new ErrorHandler('OTP not found or expired', 400));
        }

        // Verify OTP
        if (otpData.otp !== otp) {
            return next(new ErrorHandler('Invalid OTP', 400));
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Hash new password and update user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Clear OTP from database
        await Otp.deleteOne({ email });

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. Please log in with your new password.',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return next(new ErrorHandler('Internal server error', 500));
    }
};

exports.updateProfile = [
    upload.single('avatar'),
    async (req, res, next) => {
        try {
            const userId = req.user._id;
            let avatarUrl = req.user.avatar || '';

            // Only process if a new file is uploaded
            if (req.file) {
                const uploadPromise = new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: 'avatars', width: 150, height: 150, crop: 'fill' },
                        (error, result) => {
                            if (error) reject(new ErrorHandler('Failed to upload avatar', 500));
                            resolve(result);
                        }
                    ).end(req.file.buffer);
                });

                const result = await uploadPromise;
                avatarUrl = result.secure_url;
            }

            // Update user profile (only if avatar changed)
            const user = await User.findByIdAndUpdate(
                userId,
                { avatar: avatarUrl },
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                user: {
                    fullName: user.fullName,
                    email: user.email,
                    avatar: user.avatar,
                    createdAt: user.createdAt,
                },
            });
        } catch (error) {
            console.error('Update profile error:', error);
            next(new ErrorHandler(error.message || 'Internal server error', 500));
        }
    }
];

exports.checkAuth = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'User authenticated successfully',
            user: req.user,
        });
    } catch (error) {
        console.error('Check auth error:', error);
        return next(new ErrorHandler('Internal server error', 500));
    }
};