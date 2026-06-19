import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
  boolean,
  numeric,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const addressTypeEnum = pgEnum('address_type', ['shipping', 'billing']);
export const productConditionEnum = pgEnum('product_condition', [
  'refurbished',
  'certified-pre-owned',
  'like-new',
  'good',
]);
export const productStatusEnum = pgEnum('product_status', ['active', 'inactive', 'draft']);
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'paid', 'failed', 'refunded']);
export const reviewStatusEnum = pgEnum('review_status', ['pending', 'approved', 'rejected']);
export const quoteStatusEnum = pgEnum('quote_status', ['pending', 'quoted', 'converted', 'expired']);

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('user').notNull(),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Addresses
export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  type: addressTypeEnum('type').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  street: varchar('street', { length: 500 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  zip: varchar('zip', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).default('US').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
});

// Categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  description: text('description'),
});

// Products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 100 }).notNull(),
  model: varchar('model', { length: 255 }).notNull(),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  description: text('description').notNull(),
  condition: productConditionEnum('condition').notNull(),
  status: productStatusEnum('status').default('active').notNull(),
  sku: varchar('sku', { length: 100 }).unique().notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  cost: numeric('cost', { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric('original_price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').default(0).notNull(),
  specs: jsonb('specs').notNull(),
  imageUrls: varchar('image_urls', { length: 2000 }).array().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Product Images
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  altText: varchar('alt_text', { length: 255 }),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Cart Items
export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  sessionId: varchar('session_id', { length: 255 }),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  orderNumber: varchar('order_number', { length: 50 }).unique().notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('pending').notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  tax: numeric('tax', { precision: 12, scale: 2 }).notNull(),
  shippingCost: numeric('shipping_cost', { precision: 12, scale: 2 }).notNull(),
  total: numeric('total', { precision: 12, scale: 2 }).notNull(),
  shippingAddressId: integer('shipping_address_id').references(() => addresses.id),
  billingAddressId: integer('billing_address_id').references(() => addresses.id),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Order Items
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  total: numeric('total', { precision: 12, scale: 2 }).notNull(),
});

// Reviews
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  status: reviewStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Quotes
export const quotes = pgTable('quotes', {
  id: serial('id').primaryKey(),
  quoteNumber: varchar('quote_number', { length: 50 }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  category: varchar('category', { length: 50 }).notNull(),
  specificInterest: text('specific_interest'),
  quantity: integer('quantity').default(1),
  budgetRange: varchar('budget_range', { length: 100 }),
  message: text('message'),
  finalPrice: numeric('final_price', { precision: 12, scale: 2 }),
  adminNotes: text('admin_notes'),
  status: quoteStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Store Settings
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  storeName: varchar('store_name', { length: 255 }).default('ServerHub').notNull(),
  storeEmail: varchar('store_email', { length: 255 }).default('admin@serverhub.com').notNull(),
  storePhone: varchar('store_phone', { length: 50 }).default('+1 (555) 123-4567').notNull(),
  storeAddress: varchar('store_address', { length: 500 }).default('123 Server Lane, San Jose, CA 95134').notNull(),
  standardShipping: numeric('standard_shipping', { precision: 10, scale: 2 }).default('150').notNull(),
  expressShipping: numeric('express_shipping', { precision: 10, scale: 2 }).default('250').notNull(),
  overnightShipping: numeric('overnight_shipping', { precision: 10, scale: 2 }).default('400').notNull(),
  freeShippingThreshold: numeric('free_shipping_threshold', { precision: 10, scale: 2 }).default('5000').notNull(),
  taxRate: numeric('tax_rate', { precision: 5, scale: 2 }).default('8.5').notNull(),
  taxInclusive: boolean('tax_inclusive').default(false).notNull(),
});
