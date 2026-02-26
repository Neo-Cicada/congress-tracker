import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

// Initialize Google OAuth Client with placeholder for now
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE');

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Please provide email and password' });
            return;
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        // For Google Auth users, passwordHash might be undefined
        if (user && user.passwordHash && (await bcrypt.compare(password, user.passwordHash))) {
            res.json({
                _id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user || !req.user.id) {
            res.status(401).json({ message: 'User not found in Request' });
            return;
        }
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { googleToken } = req.body;

        if (!googleToken) {
            res.status(400).json({ message: 'Google token is missing' });
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE',
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            res.status(400).json({ message: 'Invalid Google token payload' });
            return;
        }

        const { email, sub: googleId, given_name: firstName, family_name: lastName } = payload;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // User doesn't exist, create a new one via Google info
            user = await User.create({
                email,
                googleId,
                firstName: firstName || '',
                lastName: lastName || '',
            });
        } else if (!user.googleId) {
            // User exists via traditional email/pw but is now logging in with Google
            // Optionally update their googleId so we know they are linked
            user.googleId = googleId;
            await user.save();
        }

        res.json({
            _id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            token: generateToken(user.id),
        });

    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(500).json({ message: 'Server error during Google login' });
    }
};
