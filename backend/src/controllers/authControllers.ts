// src/controllers/authControllers.ts

import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import adminModel from '../models/adminModel';
import sellerModel from '../models/sellerModel';
import sellerCustomerModel from '../models/chat/sellerCustomerModel';
import { responseReturn } from '../utils/response';
import { createToken } from '../utils/tokenCreate';

// Interfaces
interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  email: string;
  name: string;
  password: string;
}

interface ProfileInfoBody {
  division: string;
  district: string;
  shopName: string;
  sub_district: string;
}

interface AdminDocument {
  id: string;
  _id: string;
  email: string;
  password: string;
  role: 'admin';
  name?: string;
  image?: string;
  createdAt: Date;
}

interface SellerDocument {
  id: string;
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'seller';
  method: 'manually' | 'google' | 'facebook';
  shopInfo: {
    shopName?: string;
    division?: string;
    district?: string;
    sub_district?: string;
  };
  image?: string;
  status?: 'pending' | 'active' | 'deactive';
  payment?: 'inactive' | 'active';
  createdAt: Date;
}

interface TokenPayload {
  id: string;
  role: string;
}

interface AuthResponse {
  token: string;
  message: string;
}

interface UserInfoResponse {
  userInfo: AdminDocument | SellerDocument;
}

// Cookie options interface
interface CookieOptions {
  expires: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

// Helper pentru opțiunile de cookie (login / register)
const getCookieOptions = (): CookieOptions => {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 zile
    httpOnly: true,
    secure: isProd,                           // pe Render → true
    sameSite: isProd ? 'none' : 'lax',        // în producție trebuie 'none' pentru cross-site
  };
};

class AuthControllers {
  admin_login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginBody;

    // Input validation
    if (!email || !password) {
      responseReturn(res, 400, { error: 'Email and password are required' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      responseReturn(res, 400, { error: 'Invalid email format' });
      return;
    }

    try {
      const admin = await adminModel
        .findOne({ email: email.toLowerCase().trim() })
        .select('+password') as AdminDocument | null;

      if (!admin) {
        responseReturn(res, 404, { error: 'Email not found' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, admin.password);

      if (!isPasswordValid) {
        responseReturn(res, 401, { error: 'Invalid password' });
        return;
      }

      const tokenPayload: TokenPayload = {
        id: admin.id,
        role: admin.role,
      };

      const token = await createToken(tokenPayload);

      const cookieOptions = getCookieOptions();
      res.cookie('accessToken', token, cookieOptions);

      const response: AuthResponse = {
        token,
        message: 'Login successful',
      };

      responseReturn(res, 200, response);
    } catch (error) {
      console.error('Admin login error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error during login' });
    }
  };

  seller_login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as LoginBody;

    // Input validation
    if (!email || !password) {
      responseReturn(res, 400, { error: 'Email and password are required' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      responseReturn(res, 400, { error: 'Invalid email format' });
      return;
    }

    try {
      const seller = await sellerModel
        .findOne({ email: email.toLowerCase().trim() })
        .select('+password') as SellerDocument | null;

      if (!seller) {
        responseReturn(res, 404, { error: 'Email not found' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, seller.password);

      if (!isPasswordValid) {
        responseReturn(res, 401, { error: 'Invalid password' });
        return;
      }

      const tokenPayload: TokenPayload = {
        id: seller.id,
        role: seller.role,
      };

      const token = await createToken(tokenPayload);

      const cookieOptions = getCookieOptions();
      res.cookie('accessToken', token, cookieOptions);

      const response: AuthResponse = {
        token,
        message: 'Login successful',
      };

      responseReturn(res, 200, response);
    } catch (error) {
      console.error('Seller login error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error during login' });
    }
  };

  seller_register = async (req: Request, res: Response): Promise<void> => {
    const { email, name, password } = req.body as RegisterBody;

    // Input validation
    if (!email || !name || !password) {
      responseReturn(res, 400, { error: 'All fields are required' });
      return;
    }

    if (password.length < 6) {
      responseReturn(res, 400, { error: 'Password must be at least 6 characters long' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      responseReturn(res, 400, { error: 'Invalid email format' });
      return;
    }

    // Name validation
    if (name.trim().length < 2) {
      responseReturn(res, 400, { error: 'Name must be at least 2 characters long' });
      return;
    }

    try {
      const existingSeller = await sellerModel.findOne({
        email: email.toLowerCase().trim(),
      }) as SellerDocument | null;

      if (existingSeller) {
        responseReturn(res, 409, { error: 'Email already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const seller = await sellerModel.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        method: 'manually',
        shopInfo: {},
      }) as SellerDocument;

      await sellerCustomerModel.create({
        myId: seller.id,
      });

      const tokenPayload: TokenPayload = {
        id: seller.id,
        role: seller.role,
      };

      const token = await createToken(tokenPayload);

      const cookieOptions = getCookieOptions();
      res.cookie('accessToken', token, cookieOptions);

      const response: AuthResponse = {
        token,
        message: 'Registration successful',
      };

      responseReturn(res, 201, response);
    } catch (error) {
      console.error('Seller registration error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error during registration' });
    }
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    const { id, role } = req as any; // presupunem că middleware-ul de auth atașează aceste câmpuri

    if (!id || !role) {
      responseReturn(res, 401, { error: 'Unauthorized: User information not found' });
      return;
    }

    try {
      let userInfo: AdminDocument | SellerDocument | null = null;

      if (role === 'admin') {
        userInfo = await adminModel.findById(id) as AdminDocument | null;
      } else if (role === 'seller') {
        userInfo = await sellerModel.findById(id) as SellerDocument | null;
      } else {
        responseReturn(res, 400, { error: 'Invalid user role' });
        return;
      }

      if (!userInfo) {
        responseReturn(res, 404, { error: 'User not found' });
        return;
      }

      const response: UserInfoResponse = {
        userInfo,
      };

      responseReturn(res, 200, response);
    } catch (error) {
      console.error('Get user error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error' });
    }
  };

  profile_image_upload = async (req: Request, res: Response): Promise<void> => {
    const { id } = req as any;

    if (!id) {
      responseReturn(res, 401, { error: 'Unauthorized: User ID not found' });
      return;
    }

    const form = new formidable.IncomingForm({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        console.error('Error parsing form data:', err);
        responseReturn(res, 400, { error: 'Error parsing form data' });
        return;
      }

      cloudinary.config({
        cloud_name: process.env.cloud_name as string,
        api_key: process.env.api_key as string,
        api_secret: process.env.api_secret as string,
        secure: true,
      });

      const { image } = files;

      if (!image) {
        responseReturn(res, 400, { error: 'No image file uploaded' });
        return;
      }

      const imageFile = Array.isArray(image) ? image[0] : image;
      const imagePath = imageFile.filepath;

      if (!imagePath) {
        responseReturn(res, 400, { error: 'Invalid image file path' });
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.mimetype || '')) {
        responseReturn(res, 400, {
          error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed',
        });
        return;
      }

      try {
        const result = await cloudinary.uploader.upload(imagePath, {
          folder: 'profile',
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' },
          ],
        });

        if (!result || !result.url) {
          responseReturn(res, 500, { error: 'Image upload failed' });
          return;
        }

        await sellerModel.findByIdAndUpdate(id, {
          image: result.url,
        });

        const userInfo = await sellerModel.findById(id) as SellerDocument | null;

        if (!userInfo) {
          responseReturn(res, 404, { error: 'User not found after update' });
          return;
        }

        responseReturn(res, 200, {
          message: 'Profile image uploaded successfully',
          userInfo,
        });
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', (error as Error).message);
        responseReturn(res, 500, { error: 'Failed to upload image' });
      }
    });
  };

  profile_info_add = async (req: Request, res: Response): Promise<void> => {
    const { division, district, shopName, sub_district } = req.body as ProfileInfoBody;
    const { id } = req as any;

    if (!id) {
      responseReturn(res, 401, { error: 'Unauthorized: User ID not found' });
      return;
    }

    // Input validation
    if (!division || !district || !shopName || !sub_district) {
      responseReturn(res, 400, { error: 'All fields are required' });
      return;
    }

    if (shopName.trim().length < 2) {
      responseReturn(res, 400, { error: 'Shop name must be at least 2 characters long' });
      return;
    }

    try {
      await sellerModel.findByIdAndUpdate(id, {
        shopInfo: {
          shopName: shopName.trim(),
          division: division.trim(),
          district: district.trim(),
          sub_district: sub_district.trim(),
        },
      });

      const userInfo = await sellerModel.findById(id) as SellerDocument | null;

      if (!userInfo) {
        responseReturn(res, 404, { error: 'User not found after update' });
        return;
      }

      responseReturn(res, 200, {
        message: 'Profile information added successfully',
        userInfo,
      });
    } catch (error) {
      console.error('Profile info add error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to update profile information' });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const cookieOptions: CookieOptions = {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      };

      res.cookie('accessToken', '', cookieOptions);

      responseReturn(res, 200, { message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Internal server error during logout' });
    }
  };
}

export default new AuthControllers();
