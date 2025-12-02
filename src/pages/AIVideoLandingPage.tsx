import React, { useState } from 'react';
import { CreditCard, Banknote, Smartphone, Zap, Video, CheckCircle, Shield, Coins, BrainCircuit } from 'lucide-react';
import axios from 'axios';
import { PaymentService } from '../services/paymentService';

interface PaymentOption {
    id: 'paystack' | 'transfer';
    title: string;
    description: string;
    icon: React.ReactNode;
    active: boolean;
}

const AIVideoLandingPage: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<'paystack' | 'transfer'>('paystack');
    const [paymentInitiated, setPaymentInitiated] = useState(false);
    const [email, setEmail] = useState('');

    const paymentOptions: PaymentOption[] = [
        {
            id: 'paystack',
            title: 'Pay with Paystack',
            description: 'Instant payment with card, bank transfer, or mobile money',
            icon: <CreditCard className="w-6 h-6" />,
            active: true
        },
        {
            id: 'transfer',
            title: 'Bank Transfer',
            description: 'Direct bank transfer, then send proof via WhatsApp',
            icon: <Banknote className="w-6 h-6" />,
            active: true
        }
    ];

    const features = [
        { icon: <Zap className="w-5 h-5" />, text: 'Generate videos from text prompts' },
        { icon: <BrainCircuit className="w-5 h-5" />, text: 'Tools to generate safe videos' },
        { icon: <Video className="w-5 h-5" />, text: 'Video editing tips' },
        { icon: <Smartphone className="w-5 h-5" />, text: 'Mobile-optimized videos' },
        { icon: <Coins className="w-5 h-5" />, text: 'Monietization tips' }
    ];

    const bankDetails = {
        bankName: 'GT Bank',
        accountName: 'Akpa Solomon',
        accountNumber: '0119442345',
        phoneNumber: '+234802809730'
    };

    const handlePayment = async () => {
        if (selectedOption === 'paystack') {
            setPaymentInitiated(true);
            try {
                const res = await PaymentService.makePayment({ email: email });
                if (res && res.authorization_url) {
                    console.log(res);
                    window.location.href = res.authorization_url;
                }
            } catch (error) {
                console.error('Payment initiation failed:', error);
                alert('Failed to initiate payment. Please try again.');
                setPaymentInitiated(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            <div className="container mx-auto px-2 py-12 max-w-4xl">
                {/* Header */}
                <header className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Transform Ideas into Stunning Videos
                    </h1>
                    <p className="text-xl text-gray-300 mb-6">
                        AI-powered video generation that brings your imagination to life
                    </p>
                    {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-full border border-blue-700/50">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm">Limited Time Offer: 50% OFF for Early Users</span>
                    </div> */}
                </header>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left Column: Features and Info */}
                    <div>
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-8 border border-gray-700/50 mb-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Video className="w-6 h-6 text-blue-400" />
                                What You Get
                            </h2>
                            <ul className="space-y-4">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-900/30 rounded-lg">
                                            {feature.icon}
                                        </div>
                                        <span>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 p-2 lg:p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-700/30">
                                <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
                                <div className="flex items-end gap-2 mb-4">
                                    <span className="text-4xl font-bold">₦1,500</span>
                                    <span className="text-gray-400 line-through">₦50,000</span>
                                    <span className="px-2 py-1 bg-green-900/40 text-green-300 text-sm rounded">
                                        Save 97%
                                    </span>
                                </div>
                                <p className="text-gray-300">
                                    One-time payment • Lifetime access • Unlimited generations
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Options */}
                    <div>
                        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 lg:p-8 border border-gray-700/50">
                            <h2 className="text-2xl font-bold mb-6">Choose Payment Method</h2>

                            {/* Payment Options Selection */}
                            <div className="space-y-4 mb-8">
                                {paymentOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedOption(option.id)}
                                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-4 text-left ${selectedOption === option.id
                                            ? 'border-blue-500 bg-blue-900/20'
                                            : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-lg ${selectedOption === option.id ? 'bg-blue-900' : 'bg-gray-800'}`}>
                                            {option.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{option.title}</h3>
                                            <p className="text-gray-400 text-sm mt-1">{option.description}</p>
                                        </div>
                                        {selectedOption === option.id && (
                                            <CheckCircle className="w-6 h-6 text-blue-400 ml-auto" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Pay with Paystack Section */}
                            {selectedOption === 'paystack' && (
                                <form onSubmit={handlePayment} className="mb-8">
                                    <input type="email" placeholder="Enter your email" className="w-full p-4 rounded-xl border border-gray-700/50 bg-gray-800/30 mb-4" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    <button
                                        onClick={handlePayment}
                                        disabled={paymentInitiated}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {paymentInitiated ? (
                                            <>
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5" />
                                                Pay Now with Paystack
                                            </>
                                        )}
                                    </button>
                                    <p className="text-center text-gray-400 text-sm mt-4">
                                        Secure payment powered by Paystack
                                    </p>
                                </form>
                            )}

                            {/* Bank Transfer Details */}
                            {selectedOption === 'transfer' && (
                                <div className="space-y-6">
                                    <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                                        <h3 className="font-bold text-lg mb-4">Bank Transfer Details</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-gray-400 text-sm">Bank Name</p>
                                                <p className="font-semibold">{bankDetails.bankName}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Account Name</p>
                                                <p className="font-semibold">{bankDetails.accountName}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Account Number</p>
                                                <p className="font-semibold text-xl tracking-wider">{bankDetails.accountNumber}</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                                            <p className="text-sm text-yellow-200">
                                                After payment, send your proof to WhatsApp for activation:
                                            </p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <Smartphone className="w-4 h-4" />
                                                <a
                                                    href={`https://wa.me/2348102809730?text=I have made payment, please verify my payment and add me to group. Attached is my proof of payment.`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-green-400 hover:text-green-300 font-semibold"
                                                >
                                                    {bankDetails.phoneNumber}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-900/30 p-4 rounded-lg">
                                        <p className="text-sm text-gray-400">
                                            Your access will be activated within 1 hour after payment confirmation
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-700/50 mt-8">
                                <Shield className="w-5 h-5 text-green-400" />
                                <span className="text-sm text-gray-400">Secure Payment • 256-bit Encryption</span>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-400 text-sm">
                                Need help? Email us at{' '}
                                <a href="mailto:solomonakpas@gmail.com" className="text-blue-400 hover:text-blue-300">
                                    solomonakpas@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIVideoLandingPage;