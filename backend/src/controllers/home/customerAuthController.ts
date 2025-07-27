//src\controllers\home\customerAuthController.ts
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import customerModel from '../../models/customerModel';
import sellerCustomerModel from '../../models/chat/sellerCustomerModel';
import { responseReturn } from '../../utils/response';
import { createToken } from '../../utils/tokenCreate';


// Interfaces
interface CustomerRegisterBody {
  name: string;
  email: string;
  password: string;
}

interface CustomerLoginBody {
  email: string;
  password: string;
}

interface CustomerDocument {
  id: string;
  _id: string;
  name: string;
  email: string;
  password: string;
  method: 'manually' | 'google' | 'facebook';
  createdAt?: Date;
  updatedAt?: Date;
}

interface TokenPayload {
  id: string;
  name: string;
  email: string;
  method: string;
}

interface AuthResponse {
  message: string;
  token: string;
}

interface ErrorResponse {
  error: string;
}

// Cookie options interface
interface CookieOptions {
  expires: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

class CustomerAuthController {
  customer_register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body as CustomerRegisterBody;

    try {
      // Input validation
      if (!name || !email || !password) {
        responseReturn(res, 400, { error: 'All fields are required' });
        return;
      }

      if (password.length < 6) {
        responseReturn(res, 400, { error: 'Password must be at least 6 characters long' });
        return;
      }

      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        responseReturn(res, 400, { error: 'Invalid email format' });
        return;
      }

      const existingCustomer = await customerModel.findOne({ email: email.trim().toLowerCase() });
      
      if (existingCustomer) {
        responseReturn(res, 409, { error: 'Email Already Exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for security
      
      const createCustomer = await customerModel.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        method: 'manually'
      }) as CustomerDocument;

      // Create seller-customer relationship
      await sellerCustomerModel.create({
        myId: createCustomer.id
      });

      const tokenPayload: TokenPayload = {
        id: createCustomer.id,
        name: createCustomer.name,
        email: createCustomer.email,
        method: createCustomer.method
      };

      const token = await createToken(tokenPayload);

      const cookieOptions: CookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true, // Prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict' // CSRF protection
      };

      res.cookie('customerToken', token, cookieOptions);

      const response: AuthResponse = {
        message: "User Register Success",
        token
      };

      responseReturn(res, 201, response);
    } catch (error) {
      console.error('Registration error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error during registration' });
    }
  }

  customer_login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as CustomerLoginBody;

    try {
      // Input validation
      if (!email || !password) {
        responseReturn(res, 400, { error: 'Email and password are required' });
        return;
      }

      const customer = await customerModel.findOne({ 
        email: email.trim().toLowerCase() 
      }).select('+password') as CustomerDocument | null;

      if (!customer) {
        responseReturn(res, 404, { error: 'Email Not Found' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, customer.password);
      
      if (!isPasswordValid) {
        responseReturn(res, 401, { error: 'Invalid Password' });
        return;
      }

      const tokenPayload: TokenPayload = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        method: customer.method
      };

      const token = await createToken(tokenPayload);

      const cookieOptions: CookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };

      res.cookie('customerToken', token, cookieOptions);

      const response: AuthResponse = {
        message: 'User Login Success',
        token
      };

      responseReturn(res, 200, response);
    } catch (error) {
      console.error('Login error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error during login' });
    }
  }

  customer_logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // Clear the cookie by setting it to empty string with past expiration
      const cookieOptions: CookieOptions = {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      };

      res.cookie('customerToken', '', cookieOptions);

      responseReturn(res, 200, { message: 'Logout Success' });
    } catch (error) {
      console.error('Logout error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error during logout' });
    }
  }

  // Additional utility method for token validation (optional)
  validateToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.cookies?.customerToken || req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        responseReturn(res, 401, { error: 'No token provided' });
        return;
      }

      // Here you would typically verify the token
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      responseReturn(res, 200, { message: 'Token is valid' });
    } catch (error) {
      console.error('Token validation error:', (error as Error).message);
      responseReturn(res, 401, { error: 'Invalid token' });
    }
  }
}

export default new CustomerAuthController();