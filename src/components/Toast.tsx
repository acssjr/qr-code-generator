'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 
        bg-gray-800 border border-white/10 rounded-full text-white text-sm font-medium 
        shadow-xl z-50 transition-all duration-500 
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
            {type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-purple-400" />
            ) : (
                <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span>{message}</span>
        </div>
    );
}
