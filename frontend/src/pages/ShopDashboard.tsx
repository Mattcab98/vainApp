import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ShopDashboardProps {
    token: string | null;
}

export default function ShopDashboard({ token }: ShopDashboardProps) {
    const [qrToken, setQrToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleValidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.post(
                `${API_URL}/api/consumption/validate`,
                { token: qrToken },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage(response.data.message);
            setQrToken('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Validation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-accent to-dark">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">Shop Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-white/20 text-white px-6 py-2 rounded-lg hover:bg-white/30 transition-all"
                    >
                        Logout
                    </button>
                </div>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <h2 className="text-2xl font-bold text-dark mb-6 text-center">Validate Customer QR</h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleValidate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customer QR Token
                                </label>
                                <textarea
                                    value={qrToken}
                                    onChange={(e) => setQrToken(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent h-32"
                                    placeholder="Paste the QR token here or scan with a QR reader"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-accent text-white py-3 rounded-lg font-bold hover:bg-accent/90 transition-all transform hover:scale-105 disabled:opacity-50"
                            >
                                {loading ? 'Validating...' : 'Validate QR'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-dark mb-2">Instructions</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li>• Ask customer to show their QR code</li>
                                <li>• Scan or manually enter the token</li>
                                <li>• Click validate to redeem their daily coffee</li>
                                <li>• Each customer can only redeem once per day</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
