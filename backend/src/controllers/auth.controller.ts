import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Validation schemas using Zod
const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const COOKIE_NAME = 'token';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});

const generateToken = (userId: string, email: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign({ userId, email }, secret, { expiresIn });
};

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { name, email, password } = parseResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'A user with this email address already exists.',
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken(newUser.id, newUser.email);

    // Set HTTP-only cookie
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      user: newUser,
      token, // Also return in payload for flexibility (e.g. mobile or SSR clients)
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating account.',
    });
  }
};

/**
 * Log in an existing user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = parseResult.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    // Set HTTP-only cookie
    res.cookie(COOKIE_NAME, token, getCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
    });
  }
};

/**
 * Log out user (clear auth cookie)
 * POST /api/auth/logout
 */
export const logout = (_req: Request, res: Response): void => {
  res.clearCookie(COOKIE_NAME, getCookieOptions());
  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const me = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('[Auth Me Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching user profile.',
    });
  }
};
