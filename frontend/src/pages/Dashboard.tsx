import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QRCode from 'qrcode.react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface DashboardProps {
    token: string | null;
}

export default function Dashboard({ token }: DashboardProps) {
    const [qrData, setQrData] = useState<any>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const generateQR = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(
                `${API_URL}/api/consumption/generate-qr`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setQrData(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate QR');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark to-accent">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">My Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-all"
                    >
                        Logout
                    </button>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-dark mb-6 text-center">Daily Coffee QR</h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {!qrData ? (
                            <div className="text-center">
                                <p className="text-gray-600 mb-6">Generate your daily QR code to redeem your coffee</p>
                                <button
                                    onClick={generateQR}
                                    disabled={loading}
                                    className="bg-primary text-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-105 disabled:opacity-50"
                                >
                                    {loading ? 'Generating...' : 'Generate QR Code'}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="bg-gray-50 p-8 rounded-xl inline-block mb-4">
                                    <QRCode value={qrData.token} size={256} />
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    Expires: {new Date(qrData.expiresAt).toLocaleTimeString()}
                                </p>
                                <p className="text-xs text-gray-500">Show this QR code at any partner shop</p>
                                <button
                                    onClick={() => setQrData(null)}
                                    className="mt-6 text-primary hover:underline"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
                        <h3 className="text-xl font-semibold mb-4">Subscription Status</h3>
                        <p className="text-sm opacity-80">Active - Daily Plan</p>
                        <p className="text-xs opacity-60 mt-2">You can redeem one coffee per day</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
