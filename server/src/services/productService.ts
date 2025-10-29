import { Product, IProduct } from '../models/Product';
import { z } from 'zod';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductService {
  getAllProducts(filters: ProductFilters): Promise<{
    products: IProduct[];
    totalPages: number;
    currentPage: number;
    totalProducts: number;
  }>;
  getProductBySlug(slug: string): Promise<IProduct | null>;
  createProduct(data: CreateProductData): Promise<IProduct>;
  updateProduct(id: string, data: UpdateProductData): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<boolean>;
}

export interface CreateProductData {
  title: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  category: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

class ProductServiceImpl implements ProductService {
  async getAllProducts(filters: ProductFilters) {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = filters;

    // Build query
    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort: any = {};
    if (sortBy === 'price' || sortBy === 'rating' || sortBy === 'createdAt') {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products: products as IProduct[],
      totalPages,
      currentPage: page,
      totalProducts
    };
  }

  async getProductBySlug(slug: string): Promise<IProduct | null> {
    return Product.findOne({ slug }).lean();
  }

  async createProduct(data: CreateProductData): Promise<IProduct> {
    const product = new Product(data);
    await product.save();
    return product.toObject() as IProduct;
  }

  async updateProduct(id: string, data: UpdateProductData): Promise<IProduct | null> {
    const product = await Product.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).lean();
    
    return product as IProduct | null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  }
}

export const productService = new ProductServiceImpl();
