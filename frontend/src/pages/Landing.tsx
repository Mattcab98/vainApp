import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-dark via-accent to-primary">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center text-white">
                    <h1 className="text-6xl font-bold mb-6">VainApp</h1>
                    <p className="text-2xl mb-12">Your Daily Coffee Subscription</p>

                    <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
                        <h2 className="text-3xl font-semibold mb-4">How it works</h2>
                        <div className="space-y-4 text-left">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-dark rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">1</div>
                                <p className="text-lg">Subscribe to a daily coffee plan</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-dark rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">2</div>
                                <p className="text-lg">Generate your daily QR code</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary text-dark rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">3</div>
                                <p className="text-lg">Redeem at any partner coffee shop</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/signup"
                            className="bg-primary text-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all transform hover:scale-105"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition-all"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
