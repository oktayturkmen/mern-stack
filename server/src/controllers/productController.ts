import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { productService, CreateProductData, UpdateProductData } from '../services/productService';

const createProductSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  images: z.array(z.string().url()).optional().default([]),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be non-negative'),
  category: z.string().min(1, 'Category is required')
});

const updateProductSchema = createProductSchema.partial();

const querySchema = z.object({
  category: z.string().optional(),
  minPrice: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
  maxPrice: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['price', 'rating', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.string().transform(val => val ? parseInt(val) : 1).optional(),
  limit: z.string().transform(val => val ? parseInt(val) : 10).optional()
});

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = querySchema.parse(req.query);
    const result = await productService.getAllProducts(filters);
    
    res.status(200).json({
      products: result.products,
      pagination: {
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        totalProducts: result.totalProducts,
        hasNext: result.currentPage < result.totalPages,
        hasPrev: result.currentPage > 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const product = await productService.getProductBySlug(slug);
    
    if (!product) {
      const error = new Error('Product not found') as any;
      error.status = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }
    
    res.status(200).json({ product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await productService.createProduct(data);
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = updateProductSchema.parse(req.body);
    const product = await productService.updateProduct(id, data);
    
    if (!product) {
      const error = new Error('Product not found') as any;
      error.status = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }
    
    res.status(200).json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deleted = await productService.deleteProduct(id);
    
    if (!deleted) {
      const error = new Error('Product not found') as any;
      error.status = 404;
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }
    
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
