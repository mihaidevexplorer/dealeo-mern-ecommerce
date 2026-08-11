// controllers/order/orderController.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import moment from 'moment';
import Stripe from 'stripe';
import authOrderModel from '../../models/authOrder';
import customerOrder from '../../models/customerOrder';
import myShopWallet from '../../models/myShopWallet';
import sellerWallet from '../../models/sellerWallet';
import cardModel from '../../models/cardModel';
import { responseReturn } from '../../utils/response';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

// Interfaces
interface ShippingInfo {
  name: string;
  address: string;
  phone: string;
  post?: string;
  province?: string;
  city: string;
  area?: string;
  postalCode?: string;
  country?: string;
}

interface ProductInfo {
  _id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  discount: number;
  sellerId: Types.ObjectId;
  shopName: string;
  images: string[];
  quantity?: number;
}

interface CartProduct {
  _id: string;
  quantity: number;
  productInfo: ProductInfo;
}

interface SellerProduct {
  sellerId: string;
  shopName: string;
  price: number;
  products: CartProduct[];
}

interface PlaceOrderBody {
  price: number;
  products: SellerProduct[];
  shipping_fee: number;
  shippingInfo: ShippingInfo;
  userId: {
    id: string;
  };
}

interface CustomerOrderDocument {
  _id: string;
  id: string;
  customerId: Types.ObjectId;
  shippingInfo: ShippingInfo;
  products: ProductInfo[];
  price: number;
  payment_status: 'paid' | 'unpaid';
  delivery_status: 'pending' | 'processing' | 'warehouse' | 'placed' | 'cancelled';
  date: string;
  createdAt: Date;
}

interface AuthOrderDocument {
  _id: string;
  orderId: Types.ObjectId;
  sellerId: string;
  products: ProductInfo[];
  price: number;
  payment_status: 'paid' | 'unpaid';
  shippingInfo: string;
  delivery_status: 'pending' | 'processing' | 'warehouse' | 'placed' | 'cancelled';
  date: string;
  createdAt: Date;
}

interface AuthOrderData {
  orderId: string;
  sellerId: string;
  products: ProductInfo[];
  price: number;
  payment_status: string;
  shippingInfo: string;
  delivery_status: string;
  date: string;
}

interface DashboardData {
  recentOrders: CustomerOrderDocument[];
  pendingOrder: number;
  totalOrder: number;
  cancelledOrder: number;
}

interface QueryParams {
  page?: string;
  searchValue?: string;
  parPage?: string;
}

interface OrderStatusUpdate {
  status: 'pending' | 'processing' | 'warehouse' | 'placed' | 'cancelled';
}

interface CreatePaymentBody {
  price: number;
}

interface OrderParams {
  orderId: string;
}

interface CustomerParams {
  customerId: string;
  status: string;
}

interface UserParams {
  userId: string;
}

interface SellerParams {
  sellerId: string;
}

class OrderController {
  // Validation helper methods
  private validateProductInfo(productInfo: any): productInfo is ProductInfo {
    return (
      productInfo &&
      typeof productInfo === 'object' &&
      typeof productInfo._id === 'string' &&
      typeof productInfo.name === 'string' &&
      typeof productInfo.price === 'number' &&
      typeof productInfo.stock === 'number' &&
      Array.isArray(productInfo.images)
    );
  }

  private validateCartProduct(product: any): product is CartProduct {
    return (
      product &&
      typeof product === 'object' &&
      typeof product._id === 'string' &&
      typeof product.quantity === 'number' &&
      product.quantity > 0 &&
      this.validateProductInfo(product.productInfo)
    );
  }

  private validateSellerProduct(sellerProduct: any): sellerProduct is SellerProduct {
    return (
      sellerProduct &&
      typeof sellerProduct === 'object' &&
      typeof sellerProduct.sellerId === 'string' &&
      typeof sellerProduct.shopName === 'string' &&
      typeof sellerProduct.price === 'number' &&
      Array.isArray(sellerProduct.products) &&
      sellerProduct.products.length > 0 &&
      sellerProduct.products.every((product: any) => this.validateCartProduct(product))
    );
  }

  private validateShippingInfo(shippingInfo: any): shippingInfo is ShippingInfo {
    return (
      shippingInfo &&
      typeof shippingInfo === 'object' &&
      typeof shippingInfo.name === 'string' &&
      shippingInfo.name.trim().length > 0 &&
      typeof shippingInfo.address === 'string' &&
      shippingInfo.address.trim().length > 0 &&
      typeof shippingInfo.phone === 'string' &&
      shippingInfo.phone.trim().length > 0 &&
      typeof shippingInfo.city === 'string' &&
      shippingInfo.city.trim().length > 0
    );
  }

  paymentCheck = async (id: string): Promise<boolean> => {
    try {
      const order = await customerOrder.findById(id);
      
      if (!order) {
        console.log('Order not found for payment check');
        return false;
      }

      if (order.payment_status === 'unpaid') {
        await customerOrder.findByIdAndUpdate(id, {
          delivery_status: 'cancelled'
        });
        
        await authOrderModel.updateMany({
          orderId: new Types.ObjectId(id)
        }, {
          delivery_status: 'cancelled'
        });
      }
      
      return true;
    } catch (error) {
      console.log('Payment check error:', (error as Error).message);
      return false;
    }
  }

  place_order = async (req: Request, res: Response): Promise<void> => {
    console.log("=== PLACE ORDER CALLED ===");
    console.log("Request received");
    console.log("Body:", req.body);
    console.log("Request Body:", req.body);
    const { price, products, shipping_fee, shippingInfo, userId } = req.body as PlaceOrderBody;

    

    // Enhanced validation with detailed error messages
    if (!userId?.id || !Types.ObjectId.isValid(userId.id)) {
      responseReturn(res, 400, { message: "Invalid customer ID" });
      return;
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      responseReturn(res, 400, { message: "No products in order" });
      return;
    }

    if (!this.validateShippingInfo(shippingInfo)) {
      responseReturn(res, 400, { 
        message: "Invalid shipping information. Name, address, phone, and city are required" 
      });
      return;
    }

    if (typeof price !== 'number' || price <= 0) {
      responseReturn(res, 400, { message: "Invalid order price" });
      return;
    }

    if (typeof shipping_fee !== 'number' || shipping_fee < 0) {
      responseReturn(res, 400, { message: "Invalid shipping fee" });
      return;
    }

    // Validate each seller's products structure
    for (let i = 0; i < products.length; i++) {
      const sellerProduct = products[i];
      
      if (!this.validateSellerProduct(sellerProduct)) {
        responseReturn(res, 400, { 
          message: `Invalid product structure at seller index ${i}. Missing sellerId, shopName, price, or products array` 
        });
        return;
      }

      // Validate each product in the seller's products array
      for (let j = 0; j < sellerProduct.products.length; j++) {
        const product = sellerProduct.products[j];
        
        if (!this.validateCartProduct(product)) {
          responseReturn(res, 400, { 
            message: `Invalid product at seller index ${i}, product index ${j}. Missing _id, quantity, or productInfo` 
          });
          return;
        }

        // Additional productInfo validation
        if (!this.validateProductInfo(product.productInfo)) {
          responseReturn(res, 400, { 
            message: `Invalid productInfo at seller index ${i}, product index ${j}. Missing required fields like _id, name, price, stock, or images` 
          });
          return;
        }

        // Check stock availability
        if (product.quantity > product.productInfo.stock) {
          responseReturn(res, 400, { 
            message: `Insufficient stock for product "${product.productInfo.name}". Requested: ${product.quantity}, Available: ${product.productInfo.stock}` 
          });
          return;
        }
      }
    }

    console.log("User ID:", userId.id);

    let authorOrderData: AuthOrderData[] = [];
    let cardId: string[] = [];
    const tempDate = moment().format('LLL');
    let customerOrderProduct: ProductInfo[] = [];

    // Process products (now with guaranteed valid structure)
    try {
      for (let i = 0; i < products.length; i++) {
        const sellerProducts = products[i].products;
        
        for (let j = 0; j < sellerProducts.length; j++) {
          const cartProduct = sellerProducts[j];
          
          // Safe to access productInfo now due to validation above
          const tempCusPro = { ...cartProduct.productInfo };
          tempCusPro.quantity = cartProduct.quantity;
          customerOrderProduct.push(tempCusPro);
          
          if (cartProduct._id) {
            cardId.push(cartProduct._id);
          }
        }
      }

      console.log("Processed products:", customerOrderProduct);
      console.log("Card IDs to delete:", cardId);

      const order = await customerOrder.create({
        customerId: new Types.ObjectId(userId.id),
        shippingInfo,
        products: customerOrderProduct,
        price: price + shipping_fee,
        payment_status: 'unpaid',
        delivery_status: 'pending',
        date: tempDate
      });

      // Create auth orders for each seller
      for (let i = 0; i < products.length; i++) {
        const sellerProduct = products[i];
        const sellerProducts = sellerProduct.products;
        let storePor: ProductInfo[] = [];

        for (let j = 0; j < sellerProducts.length; j++) {
          const cartProduct = sellerProducts[j];
          const tempPro = { ...cartProduct.productInfo };
          tempPro.quantity = cartProduct.quantity;
          storePor.push(tempPro);
        }

        authorOrderData.push({
          orderId: (order._id as Types.ObjectId).toString(),
          sellerId: sellerProduct.sellerId,
          products: storePor,
          price: sellerProduct.price,
          payment_status: 'unpaid',
          shippingInfo: 'Dealeo Main Warehouse',
          delivery_status: 'pending',
          date: tempDate
        });
      }

      console.log("Author order data:", authorOrderData);

      await authOrderModel.insertMany(authorOrderData);
      
      // Remove items from cart
      await cardModel.deleteMany({ userId: userId.id });

      // Set payment check timeout
      setTimeout(() => {
        this.paymentCheck((order._id as Types.ObjectId).toString());
      }, 15000);

      responseReturn(res, 200, { 
        message: "Order Placed Success", 
        orderId: (order._id as Types.ObjectId).toString()
      });
    } catch (error) {
      console.log('Place order error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to place order' });
    }
  }

  get_customer_dashboard_data = async (req: Request<UserParams>, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      responseReturn(res, 400, { error: 'Invalid user ID' });
      return;
    }

    try {
      const recentOrders = await customerOrder.find({
        customerId: new Types.ObjectId(userId)
      }).limit(5);

      const pendingOrder = await customerOrder.find({
        customerId: new Types.ObjectId(userId),
        delivery_status: 'pending'
      }).countDocuments();

      const totalOrder = await customerOrder.find({
        customerId: new Types.ObjectId(userId)
      }).countDocuments();

      const cancelledOrder = await customerOrder.find({
        customerId: new Types.ObjectId(userId),
        delivery_status: 'cancelled'
      }).countDocuments();

      const dashboardData: DashboardData = {
        recentOrders: recentOrders as any,
        pendingOrder,
        totalOrder,
        cancelledOrder
      };

      responseReturn(res, 200, dashboardData);
    } catch (error) {
      console.log('Dashboard data error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to fetch dashboard data' });
    }
  }

  get_orders = async (req: Request<CustomerParams>, res: Response): Promise<void> => {
    const { customerId, status } = req.params;

    if (!Types.ObjectId.isValid(customerId)) {
      responseReturn(res, 400, { error: 'Invalid customer ID' });
      return;
    }

    try {
      let orders;
      
      if (status !== 'all') {
        orders = await customerOrder.find({
          customerId: new Types.ObjectId(customerId),
          delivery_status: status
        });
      } else {
        orders = await customerOrder.find({
          customerId: new Types.ObjectId(customerId)
        });
      }

      responseReturn(res, 200, { orders });
    } catch (error) {
      console.log('Get orders error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to fetch orders' });
    }
  }

  get_order_details = async (req: Request<OrderParams>, res: Response): Promise<void> => {
    const { orderId } = req.params;

    if (!Types.ObjectId.isValid(orderId)) {
      responseReturn(res, 400, { error: 'Invalid order ID' });
      return;
    }

    try {
      const order = await customerOrder.findById(orderId);
      
      if (!order) {
        responseReturn(res, 404, { error: 'Order not found' });
        return;
      }

      responseReturn(res, 200, { order });
    } catch (error) {
      console.log('Get order details error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to fetch order details' });
    }
  }

  get_admin_orders = async (req: Request<any, any, any, QueryParams>, res: Response): Promise<void> => {
    let { page, searchValue, parPage } = req.query;
    const pageNum = parseInt(page || '1');
    const parPageNum = parseInt(parPage || '10');
    const skipPage = parPageNum * (pageNum - 1);

    try {
      if (searchValue) {
        // TODO: Implement search functionality
        responseReturn(res, 200, { orders: [], totalOrder: 0 });
      } else {
        const orders = await customerOrder.aggregate([
          {
            $lookup: {
              from: 'authororders',
              localField: "_id",
              foreignField: 'orderId',
              as: 'suborder'
            }
          }
        ]).skip(skipPage).limit(parPageNum).sort({ createdAt: -1 });

        const totalOrder = await customerOrder.aggregate([
          {
            $lookup: {
              from: 'authororders',
              localField: "_id",
              foreignField: 'orderId',
              as: 'suborder'
            }
          }
        ]);

        responseReturn(res, 200, { orders, totalOrder: totalOrder.length });
      }
    } catch (error) {
      console.log('Get admin orders error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to fetch admin orders' });
    }
  }

  get_admin_order = async (req: Request<OrderParams>, res: Response): Promise<void> => {
    const { orderId } = req.params;

    if (!Types.ObjectId.isValid(orderId)) {
      responseReturn(res, 400, { error: 'Invalid order ID' });
      return;
    }

    try {
      const order = await customerOrder.aggregate([
        {
          $match: { _id: new Types.ObjectId(orderId) }
        },
        {
          $lookup: {
            from: 'authororders',
            localField: "_id",
            foreignField: 'orderId',
            as: 'suborder'
          }
        }
      ]);

      if (!order.length) {
        responseReturn(res, 404, { error: 'Order not found' });
        return;
      }

      responseReturn(res, 200, { order: order[0] });
    } catch (error) {
      console.log('Get admin order details error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to fetch order details' });
    }
  }

  admin_order_status_update = async (req: Request<OrderParams>, res: Response): Promise<void> => {
    const { orderId } = req.params;
    const { status } = req.body as OrderStatusUpdate;

    if (!Types.ObjectId.isValid(orderId)) {
      responseReturn(res, 400, { error: 'Invalid order ID' });
      return;
    }

    if (!status) {
      responseReturn(res, 400, { error: 'Status is required' });
      return;
    }

    try {
      await customerOrder.findByIdAndUpdate(orderId, {
        delivery_status: status
      });

      responseReturn(res, 200, { message: 'Order status updated successfully' });
    } catch (error) {
      console.log('Admin order status update error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to update order status' });
    }
  }

  get_seller_orders = async (req: Request<SellerParams, any, any, QueryParams>, res: Response): Promise<void> => {
    const { sellerId } = req.params;
    let { page, searchValue, parPage } = req.query;
    const pageNum = parseInt(page || '1');
    const parPageNum = parseInt(parPage || '10');
    const skipPage = parPageNum * (pageNum - 1);

    try {
      if (searchValue) {
        // TODO: Implement search functionality
        responseReturn(res, 200, { orders: [], totalOrder: 0 });
      } else {
        const orders = await authOrderModel.find({ sellerId })
          .skip(skipPage)
          .limit(parPageNum)
          .sort({ createdAt: -1 });

        const totalOrder = await authOrderModel.find({ sellerId }).countDocuments();

        responseReturn(res, 200, { orders, totalOrder });
      }
    } catch (error) {
      console.log('Get seller orders error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to fetch seller orders' });
    }
  }

  get_seller_order = async (req: Request<OrderParams>, res: Response): Promise<void> => {
    const { orderId } = req.params;

    if (!Types.ObjectId.isValid(orderId)) {
      responseReturn(res, 400, { error: 'Invalid order ID' });
      return;
    }

    try {
      const order = await authOrderModel.findById(orderId);
      
      if (!order) {
        responseReturn(res, 404, { error: 'Order not found' });
        return;
      }

      responseReturn(res, 200, { order });
    } catch (error) {
      console.log('Get seller order details error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to fetch order details' });
    }
  }

  seller_order_status_update = async (req: Request<OrderParams>, res: Response): Promise<void> => {
    const { orderId } = req.params;
    const { status } = req.body as OrderStatusUpdate;

    if (!Types.ObjectId.isValid(orderId)) {
      responseReturn(res, 400, { error: 'Invalid order ID' });
      return;
    }

    if (!status) {
      responseReturn(res, 400, { error: 'Status is required' });
      return;
    }

    try {
      await authOrderModel.findByIdAndUpdate(orderId, {
        delivery_status: status
      });

      responseReturn(res, 200, { message: 'Order status updated successfully' });
    } catch (error) {
      console.log('Seller order status update error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to update order status' });
    }
  }

  create_payment = async (req: Request, res: Response): Promise<void> => {
    const { price } = req.body as CreatePaymentBody;

    if (!price || price <= 0) {
      responseReturn(res, 400, { error: 'Invalid price amount' });
      return;
    }

    try {
      const payment = await stripe.paymentIntents.create({
        amount: Math.round(price * 100), // Convert to cents
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true
        }
      });

      responseReturn(res, 200, { clientSecret: payment.client_secret });
    } catch (error) {
      console.log('Create payment error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to create payment intent' });
    }
  }

  order_confirm = async (req: Request<OrderParams>, res: Response): Promise<void> => {
    const { orderId } = req.params;

    if (!Types.ObjectId.isValid(orderId)) {
      responseReturn(res, 400, { error: 'Invalid order ID' });
      return;
    }

    try {
      await customerOrder.findByIdAndUpdate(orderId, { payment_status: 'paid' });
      await authOrderModel.updateMany(
        { orderId: new Types.ObjectId(orderId) },
        { payment_status: 'paid', delivery_status: 'pending' }
      );

      const cuOrder = await customerOrder.findById(orderId);
      const auOrder = await authOrderModel.find({
        orderId: new Types.ObjectId(orderId)
      });

      if (!cuOrder) {
        responseReturn(res, 404, { error: 'Order not found' });
        return;
      }

      const time = moment().format('l');
      const splitTime = time.split('/');

      await myShopWallet.create({
        amount: cuOrder.price,
        month: parseInt(splitTime[0]),
        year: parseInt(splitTime[2])
      });

      for (let i = 0; i < auOrder.length; i++) {
        await sellerWallet.create({
          sellerId: auOrder[i].sellerId.toString(),
          amount: auOrder[i].price,
          month: parseInt(splitTime[0]),
          year: parseInt(splitTime[2])
        });
      }

      responseReturn(res, 200, { message: 'Payment confirmed successfully' });
    } catch (error) {
      console.log('Order confirm error:', (error as Error).message);
      responseReturn(res, 500, { error: 'Failed to confirm order payment' });
    }
  }
}

export default new OrderController();