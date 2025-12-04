import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth';
import User from '../models/User';
import Consumption from '../models/Consumption';
import { signToken } from '../utils/jwt';

export const generateQR = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(userId).populate('subscription');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has active subscription
        if (!user.subscription) {
            return res.status(403).json({ message: 'No active subscription' });
        }

        // Check if already consumed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (user.lastConsumptionDate) {
            const lastConsumption = new Date(user.lastConsumptionDate);
            lastConsumption.setHours(0, 0, 0, 0);

            if (lastConsumption.getTime() === today.getTime()) {
                return res.status(403).json({ message: 'Already consumed today' });
            }
        }

        // Generate ephemeral QR token (valid for 15 minutes)
        const qrId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const token = signToken({ userId, qrId, type: 'qr' }, '15m');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        res.json({ qrId, token, expiresAt });
    } catch (error) {
        res.status(500).json({ message: 'Error generating QR', error });
    }
};

export const validateQR = async (req: AuthRequest, res: Response) => {
    try {
        const { token } = req.body;
        const shopId = req.user?.userId;

        if (!shopId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify token (already done by middleware, but extract payload)
        const decoded = req.user;
        if (decoded.type !== 'qr') {
            return res.status(400).json({ message: 'Invalid token type' });
        }

        const userId = decoded.userId;
        const user = await User.findById(userId).populate('subscription');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check subscription status
        if (!user.subscription) {
            return res.status(403).json({ message: 'No active subscription' });
        }

        // Check if already consumed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (user.lastConsumptionDate) {
            const lastConsumption = new Date(user.lastConsumptionDate);
            lastConsumption.setHours(0, 0, 0, 0);

            if (lastConsumption.getTime() === today.getTime()) {
                return res.status(403).json({ message: 'Already consumed today' });
            }
        }

        // Create consumption record
        const consumption = new Consumption({
            userId,
            shopId,
            method: 'qr',
            qrId: decoded.qrId,
        });
        await consumption.save();

        // Update user's last consumption date
        user.lastConsumptionDate = new Date();
        await user.save();

        res.json({ message: 'QR validated successfully', consumption });
    } catch (error) {
        res.status(500).json({ message: 'Error validating QR', error });
    }
};

export const getConsumptionHistory = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const consumptions = await Consumption.find({ userId })
            .populate('shopId')
            .sort({ consumedAt: -1 })
            .limit(50);

        res.json({ consumptions });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history', error });
    }
};
