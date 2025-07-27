
// src/types/express/index.d.ts
import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    id?: string;
    role?: 'admin' | 'seller';
  }
}

// Alternativ, poți folosi și:
declare global {
  namespace Express {
    interface Request {
      id?: string;
      role?: 'admin' | 'seller';
    }
  }
}

export {};