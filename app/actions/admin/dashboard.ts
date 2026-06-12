'use server';

import { db } from '@/app/db';
import { products, categories, orders, users, addresses } from '@/app/db/schema';
import { desc, eq, like, or, and, asc, sql } from 'drizzle-orm';

export async function getAdminProducts(search: string = '', filterBrand: string = '', filterCategory: string = '', filterStatus: string = '', sortField: string = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc', page: number = 1, limit: number = 10) {
  let query: any = db.select().from(products).leftJoin(categories, eq(products.categoryId, categories.id));
  const whereClauses: ReturnType<typeof and>[] = [];

  if (search) {
    const kw = `%${search}%`;
    whereClauses.push(sql`${products.name} ILIKE ${kw} OR ${products.sku} ILIKE ${kw}`);
  }
  if (filterBrand) whereClauses.push(eq(products.brand, filterBrand));
  if (filterCategory) whereClauses.push(eq(products.categoryId, parseInt(filterCategory)));
  if (filterStatus) whereClauses.push(eq(products.status, filterStatus as 'active' | 'inactive' | 'draft'));

  if (whereClauses.length > 0) (query as any) = (query as any).where(and(...whereClauses));

  const sortCol = sortField === 'price' ? products.price : sortField === 'name' ? products.name : products.createdAt;
  query = query.orderBy(sortOrder === 'asc' ? asc(sortCol) : desc(sortCol)).limit(limit).offset((page - 1) * limit);

  const result = await query;
  return result.map((r: any) => ({
    ...r.products,
    categoryName: r.categories?.name,
    price: parseFloat(r.products.price),
    cost: parseFloat(r.products.cost),
    originalPrice: parseFloat(r.products.originalPrice),
    specs: typeof r.products.specs === 'string' ? JSON.parse(r.products.specs) : r.products.specs,
  }));
}

export async function getAdminCategories() {
  return db.select().from(categories);
}

export async function getAdminOrders(filterStatus: string = '', filterPayment: string = '', search: string = '') {
  let query: any = db.select().from(orders).leftJoin(users, eq(orders.userId, users.id)).leftJoin(
    addresses,
    eq(orders.shippingAddressId, addresses.id)
  );
  const whereClauses = [];

  if (filterStatus) whereClauses.push(eq(orders.status, filterStatus as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'));
  if (filterPayment) whereClauses.push(eq(orders.paymentStatus, filterPayment as 'pending' | 'paid' | 'failed' | 'refunded'));
  if (search) {
    const kw = `%${search}%`;
    whereClauses.push(sql`${orders.orderNumber} ILIKE ${kw}`);
  }

  if (whereClauses.length > 0) query = query.where(and(...whereClauses));
  query = query.orderBy(desc(orders.createdAt)).limit(50);

  const result = await query;
  return result.map((r: any) => ({
    ...r.orders,
    userName: r.users?.name,
    userEmail: r.users?.email,
    subtotal: parseFloat(r.orders.subtotal),
    tax: parseFloat(r.orders.tax),
    shippingCost: parseFloat(r.orders.shipping_cost),
    total: parseFloat(r.orders.total),
  }));
}

export async function getAdminCustomers(search: string = '', filterRole: string = '') {
  let query: any = db.select().from(users);
  const whereClauses = [];

  if (search) {
    const kw = `%${search}%`;
    whereClauses.push(sql`${users.name} ILIKE ${kw} OR ${users.email} ILIKE ${kw}`);
  }
  if (filterRole) whereClauses.push(eq(users.role, filterRole as 'user' | 'admin'));

  if (whereClauses.length > 0) query = query.where(and(...whereClauses));
  query = query.orderBy(desc(users.createdAt)).limit(50);

  const result = await query;
  return result;
}

export async function getAdminAnalytics(days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const allOrders = await db.select().from(orders);
  const allProducts = await db.select().from(products);
  const allUsers = await db.select().from(users);

  const filteredOrders = allOrders.filter((o: any) => new Date(o.createdAt) >= startDate);
  const paidOrders = filteredOrders.filter((o: any) => o.paymentStatus === 'paid');

  const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + parseFloat(o.total), 0);
  const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  const customerMap = new Map<string, { total: number; orders: number }>();
  for (const order of paidOrders) {
    if (order.userId) {
      const user = allUsers.find((u: any) => u.id === order.userId);
      if (user) {
        const existing = customerMap.get(user.name) || { total: 0, orders: 0 };
        customerMap.set(user.name, { total: existing.total + parseFloat(order.total), orders: existing.orders + 1 });
      }
    }
  }
  const topCustomers = Array.from(customerMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const lowStock = allProducts
    .filter((p: any) => p.stock < 10)
    .map((p: any) => ({ name: p.name, stock: p.stock }))
    .sort((a, b) => a.stock - b.stock);

  const monthlyMap = new Map<string, number>();
  for (const order of paidOrders) {
    const month = new Date(order.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + parseFloat(order.total));
  }
  const monthlyRevenue = Array.from(monthlyMap.entries())
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  return {
    totalRevenue,
    totalOrders: filteredOrders.length,
    totalCustomers: allUsers.length,
    averageOrderValue,
    topCustomers,
    lowStockProducts: lowStock,
    monthlyRevenue,
  };
}

export async function getAdminDashboardStats() {
  const allOrders = await db.select().from(orders);
  const allProducts = await db.select().from(products);
  const allUsers = await db.select().from(users);

  const paidOrders = allOrders.filter((o: any) => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((sum: number, o: any) => sum + parseFloat(o.total), 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = allOrders.filter((o: any) => new Date(o.createdAt) >= today).length;

  const lowStock = allProducts.filter((p: any) => p.stock < 10).length;

  const recentOrders = allOrders
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentCustomers = allUsers
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    totalRevenue,
    totalOrders: allOrders.length,
    totalCustomers: allUsers.length,
    totalProducts: allProducts.length,
    lowStockItems: lowStock,
    todayOrders,
    recentOrders,
    recentCustomers,
  };
}

export async function createProduct(data: any) {
  const [product] = await db
    .insert(products)
    .values({
      name: data.name,
      brand: data.brand,
      model: data.model,
      categoryId: data.categoryId,
      description: data.description,
      condition: data.condition,
      status: data.status,
      sku: data.sku,
      price: data.price,
      cost: data.cost,
      originalPrice: data.originalPrice,
      stock: data.stock,
      specs: typeof data.specs === 'string' ? data.specs : JSON.stringify(data.specs || {}),
      imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : JSON.stringify(data.imageUrls),
    })
    .returning();

  return {
    ...product,
    price: parseFloat(product.price),
    cost: parseFloat(product.cost),
    originalPrice: parseFloat(product.originalPrice),
    specs: typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs,
    imageUrls: typeof product.imageUrls === 'string' ? JSON.parse(product.imageUrls) : product.imageUrls,
  };
}

export async function updateProduct(id: number, data: any) {
  const [product] = await db
    .update(products)
    .set({
      name: data.name,
      brand: data.brand,
      model: data.model,
      categoryId: data.categoryId,
      description: data.description,
      condition: data.condition,
      status: data.status,
      sku: data.sku,
      price: data.price,
      cost: data.cost,
      originalPrice: data.originalPrice,
      stock: data.stock,
      specs: typeof data.specs === 'string' ? data.specs : JSON.stringify(data.specs || {}),
      imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : JSON.stringify(data.imageUrls),
    })
    .where(eq(products.id, id))
    .returning();

  return {
    ...product,
    price: parseFloat(product.price),
    cost: parseFloat(product.cost),
    originalPrice: parseFloat(product.originalPrice),
    specs: typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs,
    imageUrls: typeof product.imageUrls === 'string' ? JSON.parse(product.imageUrls) : product.imageUrls,
  };
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
  return { success: true };
}

export async function updateOrderStatus(id: number, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') {
  const [order] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();
  return order;
}
