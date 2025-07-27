// controllers/home/homeControllers.ts - VERSIUNEA CORECTATĂ
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import moment from 'moment';  // Import default pentru moment
import categoryModel, { ICategory } from '../../models/categoryModel';
import productModel, { IProduct } from '../../models/productModel';
import reviewModel, { IReview } from '../../models/reviewModel';
import { responseReturn } from '../../utils/response';
import queryProducts from '../../utils/queryProducts';


// Tipuri pentru documentele Mongoose convertite
type CategoryDoc = ICategory & { _id: Types.ObjectId };
type ProductDoc = IProduct & { _id: Types.ObjectId };
type ReviewDoc = IReview & { _id: Types.ObjectId };

// Interfaces pentru tipurile folosite în logică
interface Category {
  _id: string | Types.ObjectId;
  name: string;
  image: string;
  slug: string;
}

interface Product {
  _id: string | Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  description: string;
  stock: number;
  price: number;
  discount: number;
  rating: number;
  images: string[] | any[];
  brand: string;
  sellerId: Types.ObjectId;
  shopName: string;
  createdAt: Date;
}

interface Review {
  _id: string | Types.ObjectId;
  productId: string | Types.ObjectId;
  name: string;
  rating: number;
  review: string;
  date: string;
  createdAt: Date;
}

interface PriceRange {
  low: number;
  high: number;
}

interface SubmitReviewBody {
  productId: string;
  rating: number;
  review: string;
  name: string;
}

interface RatingReview {
  rating: number;
  sum: number;
}

interface RatingAggregation {
  _id: number;
  count: number;
}

interface QueryProductsRequest extends Request {
  query: {
    parPage?: string;
    category?: string;
    rating?: string;
    lowPrice?: string;  // Vine ca string din query params
    highPrice?: string; // Vine ca string din query params
    sortPrice?: string;
    searchValue?: string;
    pageNumber?: string;
    [key: string]: any;
  };
}

interface ProductDetailsParams {
  slug: string;
}

interface ReviewsParams {
  productId: string;
}

interface ReviewsQuery {
  pageNo?: string;
}

// Type for formatted products (arrays of 3 products each)
type FormattedProducts = Product[][];

class HomeControllers {
  formateProduct = (products: Product[]): FormattedProducts => {
    const productArray: FormattedProducts = [];
    let i = 0;
    
    while (i < products.length) {
      let temp: Product[] = [];
      let j = i;
      
      while (j < i + 3) {
        if (products[j]) {
          temp.push(products[j]);
        }
        j++;
      }
      
      productArray.push([...temp]);
      i = j;
    }
    
    return productArray;
  }

  get_categorys = async (req: Request, res: Response): Promise<void> => {
    try {
      const categorys = await categoryModel.find({}).lean() as Category[];
      
      responseReturn(res, 200, {
        categorys
      });
    } catch (error) {
      console.log((error as Error).message);
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }

  get_products = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await productModel.find({})
        .limit(12)
        .sort({ createdAt: -1 })
        .lean() as Product[];

      const allProduct1 = await productModel.find({})
        .limit(9)
        .sort({ createdAt: -1 })
        .lean() as Product[];
      const latest_product = this.formateProduct(allProduct1);

      const allProduct2 = await productModel.find({})
        .limit(9)
        .sort({ rating: -1 })
        .lean() as Product[];
      const topRated_product = this.formateProduct(allProduct2);

      const allProduct3 = await productModel.find({})
        .limit(9)
        .sort({ discount: -1 })
        .lean() as Product[];
      const discount_product = this.formateProduct(allProduct3);

      responseReturn(res, 200, {
        products,
        latest_product,
        topRated_product,
        discount_product
      });
    } catch (error) {
      console.log((error as Error).message);
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }

  price_range_product = async (req: Request, res: Response): Promise<void> => {
    try {
      const priceRange: PriceRange = {
        low: 0,
        high: 0,
      };

      const products = await productModel.find({})
        .limit(9)
        .sort({ createdAt: -1 })
        .lean() as Product[];
      const latest_product = this.formateProduct(products);

      const getForPrice = await productModel.find({})
        .sort({ price: 1 })
        .lean() as Product[];

      if (getForPrice.length > 0) {
        priceRange.high = getForPrice[getForPrice.length - 1].price;
        priceRange.low = getForPrice[0].price;
      }

      responseReturn(res, 200, {
        latest_product,
        priceRange
      });
    } catch (error) {
      console.log((error as Error).message);
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }

  query_products = async (req: QueryProductsRequest, res: Response): Promise<void> => {
    const parPage = 12;

    try {
      const products = await productModel.find({})
        .sort({ createdAt: -1 })
        .lean() as Product[];

      // Convertim și validăm parametrii query pentru queryProducts class
      const queryOptions = {
        parPage,
        category: req.query.category,
        rating: req.query.rating,
        lowPrice: req.query.lowPrice ? parseFloat(req.query.lowPrice) : undefined,
        highPrice: req.query.highPrice ? parseFloat(req.query.highPrice) : undefined,
        sortPrice: req.query.sortPrice,
        searchValue: req.query.searchValue,
        pageNumber: req.query.pageNumber
      };

      // Validăm că numerele sunt valide
      if (queryOptions.lowPrice && isNaN(queryOptions.lowPrice)) {
        queryOptions.lowPrice = undefined;
      }
      if (queryOptions.highPrice && isNaN(queryOptions.highPrice)) {
        queryOptions.highPrice = undefined;
      }

      const totalProduct = new queryProducts(products, queryOptions)
        .categoryQuery()
        .ratingQuery()
        .searchQuery()
        .priceQuery()
        .sortByPrice()
        .countProducts();

      const result = new queryProducts(products, queryOptions)
        .categoryQuery()
        .ratingQuery()
        .priceQuery()
        .searchQuery()
        .sortByPrice()
        .skip()
        .limit()
        .getProducts();

      responseReturn(res, 200, {
        products: result,
        totalProduct,
        parPage
      });
    } catch (error) {
      console.log((error as Error).message);
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }

  product_details = async (req: Request<ProductDetailsParams>, res: Response): Promise<void> => {
    const { slug } = req.params;
    
    try {
      const product = await productModel.findOne({ slug }).lean() as Product | null;

      if (!product) {
        responseReturn(res, 404, { error: 'Product not found' });
        return;
      }

      const relatedProducts = await productModel.find({
        $and: [
          {
            _id: {
              $ne: product._id
            }
          },
          {
            category: {
              $eq: product.category
            }
          }
        ]
      }).limit(12).lean() as Product[];

      const moreProducts = await productModel.find({
        $and: [
          {
            _id: {
              $ne: product._id
            }
          },
          {
            sellerId: {
              $eq: product.sellerId
            }
          }
        ]
      }).limit(3).lean() as Product[];

      responseReturn(res, 200, {
        product,
        relatedProducts,
        moreProducts
      });
    } catch (error) {
      console.log((error as Error).message);
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }

  submit_review = async (req: Request, res: Response): Promise<void> => {
    const { productId, rating, review, name } = req.body as SubmitReviewBody;

    try {
      // Input validation
      if (!productId || !rating || !review || !name) {
        responseReturn(res, 400, { error: 'All fields are required' });
        return;
      }

      if (rating < 1 || rating > 5) {
        responseReturn(res, 400, { error: 'Rating must be between 1 and 5' });
        return;
      }

      // Check if product exists
      const product = await productModel.findById(productId);
      if (!product) {
        responseReturn(res, 404, { error: 'Product not found' });
        return;
      }

      await reviewModel.create({
        productId,
        name: name.trim(),
        rating,
        review: review.trim(),
        date: moment(Date.now()).format('LL')
      });

      // Calculate new product rating
      let rat = 0;
      const reviews = await reviewModel.find({ productId }).lean() as Review[];
      
      for (let i = 0; i < reviews.length; i++) {
        rat = rat + reviews[i].rating;
      }

      let productRating: number | string = 0;
      if (reviews.length !== 0) {
        productRating = (rat / reviews.length).toFixed(1);
      }

      await productModel.findByIdAndUpdate(productId, {
        rating: parseFloat(productRating.toString())
      });

      responseReturn(res, 201, {
        message: "Review Added Successfully"
      });
    } catch (error) {
      console.log((error as Error).message);
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }

  get_reviews = async (req: Request<ReviewsParams, any, any, ReviewsQuery>, res: Response): Promise<void> => {
    const { productId } = req.params;
    let { pageNo } = req.query;
    
    const pageNumber = parseInt(pageNo || '1');
    const limit = 5;
    const skipPage = limit * (pageNumber - 1);

    try {
      // Validate productId
      if (!Types.ObjectId.isValid(productId)) {
        responseReturn(res, 400, { error: 'Invalid product ID' });
        return;
      }

      const getRating: RatingAggregation[] = await reviewModel.aggregate([
        {
          $match: {
            productId: {
              $eq: new Types.ObjectId(productId)
            },
            rating: {
              $not: {
                $size: 0
              }
            }
          }
        },
        {
          $unwind: "$rating"
        },
        {
          $group: {
            _id: "$rating",
            count: {
              $sum: 1
            }
          }
        }
      ]);

      const rating_review: RatingReview[] = [
        { rating: 5, sum: 0 },
        { rating: 4, sum: 0 },
        { rating: 3, sum: 0 },
        { rating: 2, sum: 0 },
        { rating: 1, sum: 0 }
      ];

      for (let i = 0; i < rating_review.length; i++) {
        for (let j = 0; j < getRating.length; j++) {
          if (rating_review[i].rating === getRating[j]._id) {
            rating_review[i].sum = getRating[j].count;
            break;
          }
        }
      }

      const getAll = await reviewModel.find({ productId }).lean() as Review[];
      const reviews = await reviewModel.find({ productId })
        .skip(skipPage)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean() as Review[];

      responseReturn(res, 200, {
        reviews,
        totalReview: getAll.length,
        rating_review
      });
    } catch (error) {
      console.log((error as Error).message);
      responseReturn(res, 500, { error: (error as Error).message });
    }
  }
}

export default new HomeControllers();