import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  category: string;
  ratingAvg: number;
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, required: true },
  ratingAvg: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0, min: 0 }
}, {
  timestamps: true
});

// Indexes for search and filtering
productSchema.index({ title: 1 });
productSchema.index({ description: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratingAvg: -1 });
productSchema.index({ createdAt: -1 });

// Generate slug from title before saving
productSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export const Product = mongoose.model<IProduct>('Product', productSchema);
