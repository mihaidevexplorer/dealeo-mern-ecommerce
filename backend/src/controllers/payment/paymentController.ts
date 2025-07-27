//src\controllers\payment\paymentController.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import sellerModel from '../../models/sellerModel';
import stripeModel from '../../models/stripeModel';
import sellerWallet from '../../models/sellerWallet';
import withdrowRequest from '../../models/withdrowRequest';
import { responseReturn } from '../../utils/response';


// Initialize Stripe
const stripe = new Stripe('sk_test_51Q8QW6RoWms6BcWGyvIGDtVtb0qzen1X0nX30FJLNKbC5KPCXpC1EdHL0WFJ8dUxwZfDLaQnu0V7c4KLlFDciDmE00jEcajw3O', {
  
});

// Extended Request interfaces
interface PaymentDetailsRequest extends Request {
  params: {
    sellerId: string;
  };
}

interface ActiveCodeRequest extends Request {
  params: {
    activeCode: string;
  };
}

// Document interfaces
interface SellerWalletDocument {
  _id: string;
  sellerId: string;
  amount: number;
  month: string | number;
  year: string | number;
  createdAt: Date;
}

interface WithdrawRequestDocument {
  _id: string;
  sellerId: string | Types.ObjectId;
  amount: number;
  status: 'pending' | 'success' | 'rejected';
  createdAt: Date;
}

// Request body interfaces
interface WithdrawRequestBody {
  amount: string | number;
  sellerId: string;
}

interface PaymentConfirmBody {
  paymentId: string;
}

// Response interfaces
interface PaymentDetailsResponse {
  totalAmount: number;
  pendingAmount: number;
  withdrowAmount: number;
  availableAmount: number;
  pendingWithdrows: any[];
  successWithdrows: any[];
}

interface StripeAccountResponse {
  url: string;
}

class PaymentController {
  create_stripe_connect_account = async (req: Request, res: Response): Promise<void> => {
    const { id } = req;
    
    if (!id) {
      responseReturn(res, 401, { message: 'Unauthorized: Seller ID not found' });
      return;
    }

    const uid = uuidv4();

    try {
      const stripeInfo = await stripeModel.findOne({ sellerId: id });

      // Common account creation logic
      const createAccountAndLink = async (): Promise<StripeAccountResponse> => {
        const account = await stripe.accounts.create({ type: 'express' });

        const accountLink = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: process.env.STRIPE_REFRESH_URL || 'http://localhost:3000/refresh',
          return_url: process.env.STRIPE_RETURN_URL || `http://localhost:3000/success?activeCode=${uid}`,
          type: 'account_onboarding'
        });

        await stripeModel.create({
          sellerId: id,
          stripeId: account.id,
          code: uid
        });

        return { url: accountLink.url };
      };

      if (stripeInfo) {
        // Delete existing stripe info and create new account
        await stripeModel.deleteOne({ sellerId: id });
        const result = await createAccountAndLink();
        responseReturn(res, 201, result);
      } else {
        // Create new account
        const result = await createAccountAndLink();
        responseReturn(res, 201, result);
      }
    } catch (error) {
      console.error('Stripe connect account error:', (error as Error).message);
      responseReturn(res, 500, { message: 'Failed to create Stripe account' });
    }
  }

  active_stripe_connect_account = async (req: ActiveCodeRequest & Request, res: Response): Promise<void> => {
    const { activeCode } = req.params;
    const { id } = req;

    if (!id) {
      responseReturn(res, 401, { message: 'Unauthorized: Seller ID not found' });
      return;
    }

    if (!activeCode) {
      responseReturn(res, 400, { message: 'Active code is required' });
      return;
    }

    try {
      const userStripeInfo = await stripeModel.findOne({ code: activeCode });

      if (userStripeInfo) {
        await sellerModel.findByIdAndUpdate(id, {
          payment: 'active'
        });
        responseReturn(res, 200, { message: 'Payment activated successfully' });
      } else {
        responseReturn(res, 404, { message: 'Invalid activation code' });
      }
    } catch (error) {
      console.error('Stripe activation error:', (error as Error).message);
      responseReturn(res, 500, { message: 'Internal Server Error' });
    }
  }

  private sumAmount = (data: any[]): number => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i].amount || 0;
    }
    return sum;
  }

  get_seller_payment_details = async (req: PaymentDetailsRequest, res: Response): Promise<void> => {
    const { sellerId } = req.params;

    if (!sellerId) {
      responseReturn(res, 400, { message: 'Seller ID is required' });
      return;
    }

    try {
      const payments = await sellerWallet.find({ sellerId });

      const pendingWithdrows = await withdrowRequest.find({
        $and: [
          { sellerId: { $eq: sellerId } },
          { status: { $eq: 'pending' } }
        ]
      });

      const successWithdrows = await withdrowRequest.find({
        $and: [
          { sellerId: { $eq: sellerId } },
          { status: { $eq: 'success' } }
        ]
      });

      const pendingAmount = this.sumAmount(pendingWithdrows);
      const withdrowAmount = this.sumAmount(successWithdrows);
      const totalAmount = this.sumAmount(payments);

      let availableAmount = 0;
      if (totalAmount > 0) {
        availableAmount = totalAmount - (pendingAmount + withdrowAmount);
      }

      const paymentDetails: PaymentDetailsResponse = {
        totalAmount,
        pendingAmount,
        withdrowAmount,
        availableAmount,
        pendingWithdrows,
        successWithdrows
      };

      responseReturn(res, 200, paymentDetails);
    } catch (error) {
      console.error('Get payment details error:', (error as Error).message);
      responseReturn(res, 500, { message: 'Failed to fetch payment details' });
    }
  }

  withdrowal_request = async (req: Request, res: Response): Promise<void> => {
    const { amount, sellerId } = req.body as WithdrawRequestBody;

    // Input validation
    if (!amount || !sellerId) {
      responseReturn(res, 400, { message: 'Amount and seller ID are required' });
      return;
    }

    const numericAmount = typeof amount === 'string' ? parseInt(amount) : amount;

    if (isNaN(numericAmount) || numericAmount <= 0) {
      responseReturn(res, 400, { message: 'Invalid amount. Amount must be a positive number' });
      return;
    }

    if (!Types.ObjectId.isValid(sellerId)) {
      responseReturn(res, 400, { message: 'Invalid seller ID' });
      return;
    }

    try {
      // Check if seller exists
      const seller = await sellerModel.findById(sellerId);
      if (!seller) {
        responseReturn(res, 404, { message: 'Seller not found' });
        return;
      }

      // Check available balance
      const payments = await sellerWallet.find({ sellerId });
      const pendingWithdrows = await withdrowRequest.find({
        sellerId,
        status: 'pending'
      });
      const successWithdrows = await withdrowRequest.find({
        sellerId,
        status: 'success'
      });

      const totalAmount = this.sumAmount(payments);
      const pendingAmount = this.sumAmount(pendingWithdrows);
      const withdrowAmount = this.sumAmount(successWithdrows);
      const availableAmount = totalAmount - (pendingAmount + withdrowAmount);

      if (numericAmount > availableAmount) {
        responseReturn(res, 400, { 
          message: `Insufficient balance. Available: ${availableAmount}, Requested: ${numericAmount}` 
        });
        return;
      }

      const withdrawal = await withdrowRequest.create({
        sellerId,
        amount: numericAmount
      });

      responseReturn(res, 200, { 
        withdrowal: withdrawal, 
        message: 'Withdrawal request sent successfully' 
      });
    } catch (error) {
      console.error('Withdrawal request error:', (error as Error).message);
      responseReturn(res, 500, { message: 'Failed to process withdrawal request' });
    }
  }

  get_payment_request = async (req: Request, res: Response): Promise<void> => {
    try {
      const withdrowalRequests = await withdrowRequest.find({ 
        status: 'pending' 
      }).sort({ createdAt: -1 });

      responseReturn(res, 200, { withdrowalRequest: withdrowalRequests });
    } catch (error) {
      console.error('Get payment requests error:', (error as Error).message);
      responseReturn(res, 500, { message: 'Failed to fetch withdrawal requests' });
    }
  }

  payment_request_confirm = async (req: Request, res: Response): Promise<void> => {
    const { paymentId } = req.body as PaymentConfirmBody;

    if (!paymentId) {
      responseReturn(res, 400, { message: 'Payment ID is required' });
      return;
    }

    if (!Types.ObjectId.isValid(paymentId)) {
      responseReturn(res, 400, { message: 'Invalid payment ID' });
      return;
    }

    try {
      console.log('payment_request_confirm - Start');
      console.log('paymentId:', paymentId);

      const payment = await withdrowRequest.findById(paymentId);
      console.log('Payment fetched from withdrowRequest:', payment);

      if (!payment) {
        console.log('Payment not found');
        responseReturn(res, 404, { message: 'Payment request not found' });
        return;
      }

      if (payment.status !== 'pending') {
        responseReturn(res, 400, { message: 'Payment request is not pending' });
        return;
      }

      // Convert sellerId to ObjectId if it's a string
      const sellerObjectId = typeof payment.sellerId === 'string' 
        ? new Types.ObjectId(payment.sellerId)
        : payment.sellerId;

      const stripeInfo = await stripeModel.findOne({
        sellerId: sellerObjectId
      });

      console.log('Stripe info fetched:', stripeInfo);

      if (!stripeInfo || !stripeInfo.stripeId) {
        console.log('Stripe ID not found for seller');
        responseReturn(res, 404, { message: 'Stripe account not found for seller' });
        return;
      }

      // Create Stripe transfer
      const transfer = await stripe.transfers.create({
        amount: payment.amount * 100, // Convert to cents
        currency: 'usd',
        destination: stripeInfo.stripeId
      });

      console.log('Stripe transfer created:', transfer);

      // Update payment status
      const updatedPayment = await withdrowRequest.findByIdAndUpdate(
        paymentId, 
        { status: 'success' }, 
        { new: true }
      );

      console.log('Payment updated to success:', updatedPayment);

      responseReturn(res, 200, { 
        payment: updatedPayment, 
        message: 'Payment confirmed successfully',
        transferId: transfer.id
      });
    } catch (error) {
      console.error('Error in payment_request_confirm:', (error as Error).message);
      
      // Handle specific Stripe errors
      if (error instanceof Stripe.errors.StripeError) {
        responseReturn(res, 400, { 
          message: `Stripe error: ${error.message}` 
        });
      } else {
        responseReturn(res, 500, { 
          message: 'Failed to process payment confirmation' 
        });
      }
    }
  }
}

export default new PaymentController();