import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { signToken, signRefreshToken, verifyToken } from '../utils/jwt';

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            passwordHash,
            role: role || 'user',
        });

        await user.save();

        const token = signToken({ userId: user._id, role: user.role });
        const refreshToken = signRefreshToken({ userId: user._id });

        res.status(201).json({ token, refreshToken, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !user.passwordHash) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = signToken({ userId: user._id, role: user.role });
        const refreshToken = signRefreshToken({ userId: user._id });

        res.json({ token, refreshToken, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }

    const newToken = signToken({ userId: user._id, role: user.role });
    res.json({ token: newToken });
};
