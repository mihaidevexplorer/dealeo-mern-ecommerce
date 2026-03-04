// src\index.ts
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dbConnect } from './utils/db';
import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { UserInfo, Customer, Seller, Admin, Message } from './types';

// Import toate route-urile ca ES modules
import homeRoutes from './routes/home/homeRoutes';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/order/orderRoutes';
import cardRoutes from './routes/home/cardRoutes';
import categoryRoutes from './routes/dashboard/categoryRoutes';
import productRoutes from './routes/dashboard/productRoutes';
import sellerRoutes from './routes/dashboard/sellerRoutes';
import customerAuthRoutes from './routes/home/customerAuthRoutes';
import chatRoutes from './routes/chatRoutes';
import paymentRoutes from './routes/paymentRoutes';
import dashboardRoutes from './routes/dashboard/dashboardRoutes';


// Configurarea variabilelor de mediu
dotenv.config();

// Inițializare Express
const app: Express = express();
const server = http.createServer(app);
app.set('trust proxy', 1);

// Middleware
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [
        'https://dealeo-frontend.vercel.app',
        'https://dealeo-dashboard.vercel.app',
      ]
    : [
        'http://localhost:3000',
        'http://localhost:3001',
      ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check (pentru Render keep-alive)
app.get('/health', (req: Request, res: Response): void => {
    res.status(200).send('OK');
});


// Configurare Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,     // nu mai folosim '*'
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Variabile pentru management utilizatori
let allCustomer: Customer[] = [];
let allSeller: Seller[] = [];
let admin: Partial<Admin> = {};

// Funcții pentru gestionarea utilizatorilor
const addUser = (customerId: string, socketId: string, userInfo: UserInfo): void => {
    const checkUser = allCustomer.some(u => u.customerId === customerId);
    if (!checkUser) {
        allCustomer.push({
            customerId,
            socketId,
            userInfo
        });
    }
};

const addSeller = (sellerId: string, socketId: string, userInfo: UserInfo): void => {
    const checkSeller = allSeller.some(u => u.sellerId === sellerId);
    if (!checkSeller) {
        allSeller.push({
            sellerId,
            socketId,
            userInfo
        });
    }
};

const findCustomer = (customerId: string): Customer | undefined => {
    return allCustomer.find(c => c.customerId === customerId);
};

const findSeller = (sellerId: string): Seller | undefined => {
    return allSeller.find(c => c.sellerId === sellerId);
};

const remove = (socketId: string): void => {
    allCustomer = allCustomer.filter(c => c.socketId !== socketId);
    allSeller = allSeller.filter(c => c.socketId !== socketId);
};

// Configurare evenimente Socket.IO
io.on('connection', (soc: Socket) => {
    console.log('socket server running..');

    soc.on('add_user', (customerId: string, userInfo: UserInfo) => {
        addUser(customerId, soc.id, userInfo);
        io.emit('activeSeller', allSeller);
    });

    soc.on('add_seller', (sellerId: string, userInfo: UserInfo) => {
        addSeller(sellerId, soc.id, userInfo);
        io.emit('activeSeller', allSeller);
    });

    soc.on('send_seller_message', (msg: Message) => {
        const customer = findCustomer(msg.receverId);
        if (customer !== undefined) {
            soc.to(customer.socketId).emit('seller_message', msg);
        }
    });

    soc.on('send_customer_message', (msg: Message) => {
        const seller = findSeller(msg.receverId);
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('customer_message', msg);
        }
    });

    soc.on('send_message_admin_to_seller', (msg: Message) => {
        const seller = findSeller(msg.receverId);
        if (seller !== undefined) {
            soc.to(seller.socketId).emit('receved_admin_message', msg);
        }
    });

    soc.on('send_message_seller_to_admin', (msg: Message) => {
        if (admin.socketId) {
            soc.to(admin.socketId).emit('receved_seller_message', msg);
        }
    });

    soc.on('add_admin', (adminInfo: Admin & { email?: string, password?: string }) => {
        const { email, password, ...rest } = adminInfo;
        admin = rest;
        admin.socketId = soc.id;
        io.emit('activeSeller', allSeller);
    });

    soc.on('disconnect', () => {
        console.log('user disconnect');
        remove(soc.id);
        io.emit('activeSeller', allSeller);
    });
});

// Rutele API - toate cu ES modules
app.use('/api/home', homeRoutes);
app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', cardRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', sellerRoutes);
app.use('/api', customerAuthRoutes);
app.use('/api', chatRoutes);
app.use('/api', paymentRoutes);
app.use('/api', dashboardRoutes);

// Rută de bază
app.get('/', (req: Request, res: Response): void => {
    res.send('Hello Server');
});

// Pornire server cu async/await
const port = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
    try {
        await dbConnect();
        server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
