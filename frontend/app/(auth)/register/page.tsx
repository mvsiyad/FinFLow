'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User as UserIcon,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';

const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useFinFlowStore();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMessage(null);
    const result = await registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    if (result.success) {
      router.push('/');
    } else {
      setErrorMessage(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="rounded-3xl border border-[#17274f] bg-[#0c1630]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Create Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
          Join FinFlow and take full control of your financial destiny
        </p>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              {...register('name')}
              type="text"
              placeholder="Alex Rivera"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e20] border border-[#17274f] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>
          {errors.name && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              {...register('email')}
              type="email"
              placeholder="alex@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e20] border border-[#17274f] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-rose-400 mt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#070e20] border border-[#17274f] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-rose-400 mt-1 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              {...register('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Repeat password"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e20] border border-[#17274f] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-rose-400 mt-1 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Features Checklist */}
        <div className="pt-2 pb-1 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Real-time budget threshold warnings</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Interactive trend visualization & CSV export</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Bottom Switch Link */}
      <p className="text-center text-xs text-slate-400 mt-6">
        Already registered?{' '}
        <Link
          href="/login"
          className="font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
