'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useFinFlowStore } from '@/lib/store';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithDemo, isLoading } = useFinFlowStore();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMessage(null);
    const result = await login(data);
    if (result.success) {
      router.push('/');
    } else {
      setErrorMessage(result.message || 'Authentication failed. Please check credentials.');
    }
  };

  const handleDemoAccess = () => {
    loginWithDemo();
    router.push('/');
  };

  return (
    <div className="rounded-3xl border border-[#17274f] bg-[#0c1630]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/50">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
          Enter your credentials to access your financial dashboard
        </p>
      </div>

      {/* Error notification banner */}
      {errorMessage && (
        <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
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

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#17274f]" />
        </div>
        <span className="relative px-3 bg-[#0c1630] text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
          Or Quick Access
        </span>
      </div>

      {/* One-Click Demo Mode Button */}
      <button
        type="button"
        onClick={handleDemoAccess}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-[#070e20] hover:bg-[#111f42] border border-[#17274f] hover:border-amber-400/40 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>One-Click Demo Mode (Explore Live App)</span>
      </button>

      {/* Bottom Switch Link */}
      <p className="text-center text-xs text-slate-400 mt-6">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
