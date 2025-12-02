import React, { useState, useEffect } from 'react';
import { LogOut, Heart, User, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/useAuth';

interface Heart {
  id: number;
  left: number;
  delay: number;
}

interface Props {
  onCancel: () => void;
  isOpen: boolean;
}

const LogoutModal: React.FC<Props> = ({
  onCancel,
  isOpen,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [hearts, setHearts] = useState<Heart[]>([]);

  const handleLogout = (): void => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);

      logout();
      navigate('/login');
      onCancel();
      sessionStorage.removeItem("administrationTabs");
      sessionStorage.removeItem("recordsTabs");
    }, 2000);
  };

  useEffect(() => {
    if (isOpen) {
      const heartInterval = setInterval(() => {
        const newHeart: Heart = {
          id: Math.random(),
          left: Math.random() * 100,
          delay: Math.random() * 2
        };
        setHearts(prev => [...prev.slice(-5), newHeart]);
      }, 1500);

      return () => clearInterval(heartInterval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#00000066] bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {/* Floating hearts background */}
      {/* {hearts.map((heart: Heart) => (
                <Heart
                    key={heart.id}
                    className="absolute text-red-300 opacity-20 animate-bounce"
                    style={{
                        left: `${heart.left}%`,
                        top: '80%',
                        animationDelay: `${heart.delay}s`,
                        animationDuration: '3s'
                    }}
                    size={24}
                />
            ))} */}

      {/* Modal */}
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300">
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
              {isAnimating ? (
                <div className="animate-spin">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <>
                  <LogOut className="text-white" size={32} />
                </>
              )}
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-primary rounded-full animate-ping opacity-50"></div>
          </div>
        </div>

        {/* Emotional Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
            <User className="text-primary" size={24} />
            We'll miss you!
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Are you sure you want to leave? Your journey with us has been amazing, and we'd love
            to have you back soon.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            disabled={isAnimating}
            className="flex-1 px-2 md:px-6 py-3 bg-primary hover:bg-hover text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shrink-0 text-sm"
            type="button"
          >
            Stay with us!
          </button>
          <button
            onClick={handleLogout}
            disabled={isAnimating}
            className="flex-1 px-2 md:px-6 py-3 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-0.5 shrink-0 text-sm"
            type="button"
          >
            {isAnimating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>Goodbye</>
            )}
          </button>
        </div>

        {/* Progress bar for logout animation */}
        {isAnimating && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full animate-pulse"
                style={{
                  width: "100%",
                  animation: "progress 2s linear forwards",
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <style>{`
                @keyframes progress {
                    from { width: 0%; }
                    to { width: 100%; }
                }
            `}</style>
    </div>
  );
};

export default LogoutModal;