import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/auth';
import Shop from '../models/Shop';

export const createShop = async (req: AuthRequest, res: Response) => {
    try {
        const { name, address, location, hours, logoUrl, contactEmail } = req.body;

        const shop = new Shop({
            name,
            address,
            location,
            hours,
            logoUrl,
            contactEmail,
            active: true,
        });

        await shop.save();
        res.status(201).json({ shop });
    } catch (error) {
        res.status(500).json({ message: 'Error creating shop', error });
    }
};

export const getShops = async (req: AuthRequest, res: Response) => {
    try {
        const { lat, lng, maxDistance = 5000 } = req.query;

        let shops;
        if (lat && lng) {
            // Geospatial query
            shops = await Shop.find({
                active: true,
                location: {
                    $near: {
                        $geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
                        },
                        $maxDistance: parseInt(maxDistance as string),
                    },
                },
            });
        } else {
            shops = await Shop.find({ active: true });
        }

        res.json({ shops });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shops', error });
    }
};

export const getShopById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const shop = await Shop.findById(id);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        res.json({ shop });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shop', error });
    }
};
