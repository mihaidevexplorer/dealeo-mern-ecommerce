// controllers/home/cardController.ts
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import cardModel from '../../models/cardModel';
import wishlistModel from '../../models/wishlistModel';
import productModel from '../../models/productModel';
import { responseReturn } from '../../utils/response';

// Interfaces
interface AddToCardBody {
  userId: string;
  productId: string;
  quantity: number;
}

interface AddToWishlistBody {
  userId: string;
  productId: string;
}

interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  discount: number;
  stock: number;
  sellerId: Types.ObjectId;
  shopName: string;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  slug: string;
}

interface CardProduct {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  products: ProductInfo[];
}

interface StockProduct {
  _id: string;
  userId: string;
  productId: string;
  quantity: number;
  products: ProductInfo[];
}

interface ProcessedProduct {
  sellerId: string;
  shopName: string;
  price: number;
  products: {
    _id: string;
    quantity: number;
    productInfo: ProductInfo;
  }[];
}

interface CardResponse {
  card_products: ProcessedProduct[];
  price: number;
  card_product_count: number;
  shipping_fee: number;
  outOfStockProduct: CardProduct[];
  buy_product_item: number;
}

interface WishlistDocument {
  _id: string;
  userId: string;
  productId: string | ProductInfo;
  slug: string;
  name: string;
  price: number;
  image: string;
  discount: number;
  rating: number;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class CardController {
  // Add product to cart
  add_to_card = async (req: Request, res: Response): Promise<void> => {
    const { userId, productId, quantity } = req.body as AddToCardBody;
    
    try {
      console.log("Add to cart request:", { userId, productId, quantity });
      
      // Validate inputs
      if (!userId || !productId || !quantity) {
        responseReturn(res, 400, { error: "Missing required fields" });
        return;
      }

      // Check if product exists
      const productExists = await productModel.findById(productId);
      if (!productExists) {
        responseReturn(res, 404, { error: "Product not found" });
        return;
      }

      // Check if product is in stock
      if (productExists.stock < quantity) {
        responseReturn(res, 400, { error: "Insufficient stock available" });
        return;
      }

      // Check if product already in cart
      const existingCartItem = await cardModel.findOne({ 
        userId: new Types.ObjectId(userId), 
        productId: new Types.ObjectId(productId) 
      });

      let product;
      if (existingCartItem) {
        // Update quantity if product already in cart
        product = await cardModel.findByIdAndUpdate(
          existingCartItem._id,
          { $inc: { quantity } },
          { new: true }
        );
        console.log("Cart quantity updated:", product);
      } else {
        // Create new cart item
        product = await cardModel.create({
          userId: new Types.ObjectId(userId),
          productId: new Types.ObjectId(productId),
          quantity
        });
        console.log("New cart item created:", product);
      }

      responseReturn(res, 201, { 
        message: "Product added to cart successfully", 
        product 
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      responseReturn(res, 500, { error: "Failed to add product to cart" });
    }
  }

  // Get all cart products for a user
  get_card_products = async (req: Request, res: Response): Promise<void> => {
    const co = 5; // Commission percentage
    const { userId } = req.params;
    
    try {
      console.log("Get cart products for userId:", userId);
      
      if (!userId) {
        responseReturn(res, 400, { error: "User ID is required" });
        return;
      }

      const card_products = await cardModel.aggregate([
        {
          $match: {
            userId: new Types.ObjectId(userId)
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: "_id",
            as: 'products'
          }
        }
      ]) as CardProduct[];

      let buy_product_item = 0;
      let calculatePrice = 0;
      let card_product_count = 0;

      // Separate out of stock products
      const outOfStockProduct = card_products.filter(p => {
        if (!p.products || p.products.length === 0) return true;
        return p.products[0].stock < p.quantity;
      });

      // Calculate count for out of stock products
      for (let i = 0; i < outOfStockProduct.length; i++) {
        card_product_count += outOfStockProduct[i].quantity;
      }

      // Filter in-stock products
      const stockProduct = card_products.filter(p => {
        if (!p.products || p.products.length === 0) return false;
        return p.products[0].stock >= p.quantity;
      }) as StockProduct[];

      // Calculate price and count for in-stock products
      for (let i = 0; i < stockProduct.length; i++) {
        const { quantity } = stockProduct[i];
        card_product_count += quantity;
        buy_product_item += quantity;

        const { price, discount } = stockProduct[i].products[0];
        const discountedPrice = discount !== 0 
          ? price - Math.floor((price * discount) / 100)
          : price;
        
        calculatePrice += quantity * discountedPrice;
      }

      // Group products by seller
      let p: ProcessedProduct[] = [];
      const uniqueSellers = [...new Set(stockProduct.map(p => p.products[0].sellerId.toString()))];
      
      for (let i = 0; i < uniqueSellers.length; i++) {
        let sellerTotalPrice = 0;
        const sellerProducts: ProcessedProduct['products'] = [];
        
        for (let j = 0; j < stockProduct.length; j++) {
          const tempProduct = stockProduct[j].products[0];
          
          if (uniqueSellers[i] === tempProduct.sellerId.toString()) {
            let productPrice = tempProduct.discount !== 0
              ? tempProduct.price - Math.floor((tempProduct.price * tempProduct.discount) / 100)
              : tempProduct.price;
            
            // Apply commission
            productPrice = productPrice - Math.floor((productPrice * co) / 100);
            sellerTotalPrice += productPrice * stockProduct[j].quantity;
            
            sellerProducts.push({
              _id: stockProduct[j]._id,
              quantity: stockProduct[j].quantity,
              productInfo: tempProduct
            });
          }
        }
        
        if (sellerProducts.length > 0) {
          p.push({
            sellerId: uniqueSellers[i],
            shopName: sellerProducts[0].productInfo.shopName,
            price: sellerTotalPrice,
            products: sellerProducts
          });
        }
      }

      const response: CardResponse = {
        card_products: p,
        price: calculatePrice,
        card_product_count,
        shipping_fee: 20 * p.length,
        outOfStockProduct,
        buy_product_item
      };

      responseReturn(res, 200, response);
    } catch (error) {
      console.error("Get cart products error:", error);
      responseReturn(res, 500, { error: "Failed to fetch cart products" });
    }
  }

  // Delete product from cart
  delete_card_products = async (req: Request, res: Response): Promise<void> => {
    const { card_id } = req.params;
    
    try {
      console.log("Delete cart product with ID:", card_id);
      
      if (!card_id) {
        responseReturn(res, 400, { error: "Cart ID is required" });
        return;
      }

      const deletedItem = await cardModel.findByIdAndDelete(card_id);
      
      if (!deletedItem) {
        responseReturn(res, 404, { error: "Cart item not found" });
        return;
      }

      responseReturn(res, 200, { 
        message: "Product removed from cart successfully" 
      });
    } catch (error) {
      console.error("Delete cart product error:", error);
      responseReturn(res, 500, { error: "Failed to remove product from cart" });
    }
  }

  // Increase quantity
  quantity_inc = async (req: Request, res: Response): Promise<void> => {
    const { card_id } = req.params;
    
    try {
      console.log("Increment quantity for cart ID:", card_id);
      
      if (!card_id) {
        responseReturn(res, 400, { error: "Cart ID is required" });
        return;
      }

      const cartItem = await cardModel.findById(card_id).populate('productId');
      if (!cartItem) {
        responseReturn(res, 404, { error: "Cart item not found" });
        return;
      }
      
      // Check stock availability
      const product = cartItem.productId as any;
      if (product && cartItem.quantity + 1 > product.stock) {
        responseReturn(res, 400, { error: "Insufficient stock available" });
        return;
      }

      await cardModel.findByIdAndUpdate(
        card_id, 
        { $inc: { quantity: 1 } }
      );
      
      responseReturn(res, 200, { message: "Quantity increased successfully" });
    } catch (error) {
      console.error("Quantity increment error:", error);
      responseReturn(res, 500, { error: "Failed to increase quantity" });
    }
  }

  // Decrease quantity
  quantity_dec = async (req: Request, res: Response): Promise<void> => {
    const { card_id } = req.params;
    
    try {
      console.log("Decrement quantity for cart ID:", card_id);
      
      if (!card_id) {
        responseReturn(res, 400, { error: "Cart ID is required" });
        return;
      }

      const cartItem = await cardModel.findById(card_id);
      if (!cartItem) {
        responseReturn(res, 404, { error: "Cart item not found" });
        return;
      }
      
      // Don't allow quantity to go below 1
      if (cartItem.quantity <= 1) {
        responseReturn(res, 400, { error: "Minimum quantity is 1" });
        return;
      }

      await cardModel.findByIdAndUpdate(
        card_id, 
        { $inc: { quantity: -1 } }
      );
      
      responseReturn(res, 200, { message: "Quantity decreased successfully" });
    } catch (error) {
      console.error("Quantity decrement error:", error);
      responseReturn(res, 500, { error: "Failed to decrease quantity" });
    }
  }

  // Add product to wishlist
  add_wishlist = async (req: Request, res: Response): Promise<void> => {
    const { userId, productId } = req.body as AddToWishlistBody;
    
    try {
      console.log("Add to wishlist request:", { userId, productId });
      
      // Validate inputs
      if (!userId || !productId) {
        responseReturn(res, 400, { error: "Missing required fields" });
        return;
      }

      // Check if product already in wishlist
      const existingWishlistItem = await wishlistModel.findOne({ 
        userId: new Types.ObjectId(userId), 
        productId: new Types.ObjectId(productId) 
      });
      
      if (existingWishlistItem) {
        console.log("Product already exists in wishlist");
        responseReturn(res, 400, {
          error: 'Product is already in wishlist'
        });
        return;
      }

      // Get product details
      const productDetails = await productModel.findById(productId);
      
      if (!productDetails) {
        responseReturn(res, 404, { error: 'Product not found' });
        return;
      }
      
      // Create wishlist item with product details
      const wishlistData = {
        userId: new Types.ObjectId(userId),
        productId: new Types.ObjectId(productId),
        slug: productDetails.slug,
        name: productDetails.name,
        price: productDetails.price,
        image: productDetails.images[0] || '',
        discount: productDetails.discount || 0,
        rating: productDetails.rating || 0,
        stock: productDetails.stock || 0
      };
      
      const newWishlistItem = await wishlistModel.create(wishlistData);
      console.log("Wishlist item created:", newWishlistItem);
      
      responseReturn(res, 201, {
        message: 'Product added to wishlist successfully',
        wishlistItem: newWishlistItem
      });
    } catch (error) {
      console.error("Add to wishlist error:", error);
      responseReturn(res, 500, { error: "Failed to add product to wishlist" });
    }
  }

  // Get user's wishlist
  get_wishlist = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    
    try {
      console.log("Get wishlist for userId:", userId);
      
      if (!userId) {
        responseReturn(res, 400, { error: "User ID is required" });
        return;
      }

      // Get wishlist items and populate product details
      const wishlists = await wishlistModel.find({
        userId: new Types.ObjectId(userId)
      }).populate('productId');
      
      console.log("Found wishlist items:", wishlists.length);
      
      responseReturn(res, 200, {
        wishlistCount: wishlists.length,
        wishlists
      });
    } catch (error) {
      console.error("Get wishlist error:", error);
      responseReturn(res, 500, { error: "Failed to fetch wishlist" });
    }
  }

  // Remove product from wishlist
  remove_wishlist = async (req: Request, res: Response): Promise<void> => {
    const { wishlistId } = req.params;
    
    try {
      console.log("Remove wishlist item with ID:", wishlistId);
      
      if (!wishlistId) {
        responseReturn(res, 400, { error: "Wishlist ID is required" });
        return;
      }

      const deletedItem = await wishlistModel.findByIdAndDelete(wishlistId);
      
      if (!deletedItem) {
        responseReturn(res, 404, { error: "Wishlist item not found" });
        return;
      }

      responseReturn(res, 200, {
        message: 'Product removed from wishlist successfully',
        wishlistId
      });
    } catch (error) {
      console.error("Remove wishlist error:", error);
      responseReturn(res, 500, { error: "Failed to remove product from wishlist" });
    }
  }
}

export default new CardController();