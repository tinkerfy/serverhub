// DB-derived types (from Drizzle schema)
export type User = typeof import('../db/schema').users.$inferSelect;
export type NewUser = typeof import('../db/schema').users.$inferInsert;
export type Product = typeof import('../db/schema').products.$inferSelect;
export type NewProduct = typeof import('../db/schema').products.$inferInsert;
export type Order = typeof import('../db/schema').orders.$inferSelect;
export type NewOrder = typeof import('../db/schema').orders.$inferInsert;
export type OrderItem = typeof import('../db/schema').orderItems.$inferSelect;
export type NewOrderItem = typeof import('../db/schema').orderItems.$inferInsert;
export type CartItemDB = typeof import('../db/schema').cartItems.$inferSelect;
export type NewCartItem = typeof import('../db/schema').cartItems.$inferInsert;
export type Review = typeof import('../db/schema').reviews.$inferSelect;
export type NewReview = typeof import('../db/schema').reviews.$inferInsert;
export type Address = typeof import('../db/schema').addresses.$inferSelect;
export type NewAddress = typeof import('../db/schema').addresses.$inferInsert;
export type Category = typeof import('../db/schema').categories.$inferSelect;
export type Quote = typeof import('../db/schema').quotes.$inferSelect;
export type NewQuote = typeof import('../db/schema').quotes.$inferInsert;

// Frontend types (React state, UI)
export interface CartItemFrontend {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  condition: string;
}

export interface ProductFilters {
  brand?: string[];
  category?: string[];
  condition?: string[];
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
}

export interface ProductSort {
  field: 'price' | 'name' | 'createdAt' | 'stock';
  order: 'asc' | 'desc';
}

export interface AuthUser {
  id: number;
  email: string;
  role: string;
}
