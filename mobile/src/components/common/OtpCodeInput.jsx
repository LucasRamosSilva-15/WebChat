import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

export default function OtpCodeInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  onResend,
  disabled = false,
  error = false,
  resending = false
}) {
  const [digits, setDigits] = useState(() => {
    const arr = Array(length).fill('');
    if (value) {
      const clean = String(value).slice(0, length).split('');
      clean.forEach((char, i) => {
        arr[i] = char;
      });
    }
    return arr;
  });

  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (value !== undefined) {
      const arr = Array(length).fill('');
      const clean = String(value).slice(0, length).split('');
      clean.forEach((char, i) => {
        arr[i] = char;
      });
      setDigits(arr);
    }
  }, [value, length]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const updateDigits = (newDigits) => {
    setDigits(newDigits);
    const code = newDigits.join('');
    if (onChange) {
      onChange(code);
    }
    if (code.length === length && !newDigits.includes('') && onComplete) {
      onComplete(code);
    }
  };

  const handleChange = (index, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    updateDigits(newDigits);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        updateDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        updateDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    const newDigits = Array(length).fill('');
    pasted.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    updateDigits(newDigits);

    const nextIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleResendClick = async () => {
    if (countdown > 0 || disabled || resending) return;
    setCountdown(60);
    if (onResend) {
      await onResend();
    }
  };

  const slotSizeClasses = length > 6
    ? 'w-8 sm:w-10 h-12 sm:h-14 min-h-[44px] text-base sm:text-lg'
    : 'w-11 sm:w-12 h-13 sm:h-14 min-h-[44px] text-xl';

  const containerGapClasses = length > 6
    ? 'gap-1 sm:gap-1.5'
    : 'gap-2 sm:gap-2.5';

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className={`flex items-center justify-center ${containerGapClasses} w-full`} onPaste={handlePaste}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={disabled}
            className={`${slotSizeClasses} rounded-xl text-center font-black skeuo-input select-none transition-all outline-none ${
              error
                ? '!border-red-400 !bg-red-50/50 dark:!bg-red-950/30 text-red-600 dark:text-red-400 focus:!ring-red-400'
                : 'text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-sky-400/60 focus:border-sky-500'
            }`}
            aria-label={`Dígito ${index + 1}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 select-none">
        {countdown > 0 ? (
          <span className="flex items-center gap-1.5 font-medium">
            <span>Reenviar código em</span>
            <strong className="text-sky-600 dark:text-sky-400 font-bold tabular-nums">
              {countdown}s
            </strong>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResendClick}
            disabled={disabled || resending}
            className="inline-flex items-center gap-1.5 font-semibold text-sky-600 dark:text-sky-400 cursor-pointer active:scale-95 transition-all disabled:opacity-50 min-h-[44px] px-3 py-2"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>Reenviar código</span>
          </button>
        )}
      </div>
    </div>
  );
}
