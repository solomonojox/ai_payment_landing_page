/* eslint-disable react-hooks/exhaustive-deps */
/*eslint-disable @typescript-eslint/no-explicit-any*/
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { PaymentService } from '../services/paymentService';
import { useAuth } from '../context/auth/useAuth';
import { FaWhatsapp } from "react-icons/fa";

const VerifyPayment = () => {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const getQuery = () => new URLSearchParams(location.search);
  const reference = getQuery().get('reference');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await PaymentService.verifyPayment(reference!);
        setStatus('success');
        setMessage(response?.data?.message || "Payment verified successfully.");
      } catch (err: any) {
        console.log(err)
        setStatus('error');
        if (err.response?.status === 403) {
          setMessage(err.response?.data)
        } else {
          setMessage(err.response?.data?.message || 'Payment verification failed.');
        }
      }
    };

    if (reference) {
      verifyPayment();
    } else {
      setStatus('error');
      setMessage('Invalid or missing payment reference.');
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        {status === 'verifying' && (
          <div>
            <Loader2 className="animate-spin h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700">Verifying your payment...</h2>
            <p className="text-sm text-gray-500 mt-2">Please wait while we confirm your transaction.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700">Payment Verified!</h2>
            <button className="flex items-center rounded-lg py-2 px-6 border bg-white hover:bg-hover hover:text-white mt-10" onClick={() => window.open(`https://wa.me/2348102809730?text=I have made payment, please verify my payment and add me to group`, "_blank")}>
              <FaWhatsapp className="mr-2 h-6 w-6 text-green-600" />
              Verify on WhatsApp
            </button>
          </div>
        )}

        {status === 'error' && (
          <div>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700">Verification Failed</h2>
            <p className="text-sm text-gray-500 mt-2">{message}</p>
            <button className="rounded-lg py-2 px-6 bg-primary hover:bg-hover text-white mt-6" onClick={() => navigate('/')}>Go home</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPayment;
