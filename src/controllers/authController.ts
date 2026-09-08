import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ENV } from '../config/env.js';
import { AuthUserPayload } from '../types/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const AuthController = {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role, district, phone, institutionName, departmentName, designation } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
        return;
      }

      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        res.status(409).json({ success: false, message: 'An account with this email already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: role || 'citizen',
        district: district || 'Ranchi',
        phone,
        institutionName,
        departmentName,
        designation,
        isVerified: role === 'citizen', // citizens auto-verified, officials may need approval
      });

      const tokenPayload: AuthUserPayload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        district: user.district,
      };

      const token = jwt.sign(tokenPayload, ENV.JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            district: user.district,
            institutionName: user.institutionName,
            departmentName: user.departmentName,
            designation: user.designation,
            isVerified: user.isVerified,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Registration failed.' });
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required.' });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
        return;
      }

      const tokenPayload: AuthUserPayload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        district: user.district,
      };

      const token = jwt.sign(tokenPayload, ENV.JWT_SECRET, { expiresIn: '7d' });

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            district: user.district,
            institutionName: user.institutionName,
            departmentName: user.departmentName,
            designation: user.designation,
            isVerified: user.isVerified,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Login failed.' });
    }
  },

  async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated.' });
        return;
      }

      const user = await User.findById(req.user.id).select('-passwordHash');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
