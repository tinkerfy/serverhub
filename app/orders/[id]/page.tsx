import { db } from '@/app/db';
import { orders, orderItems, products } from '@/app/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import OrderImageGallery from './OrderImageGallery';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const orderId = parseInt(id);

  const orderData = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (!orderData[0]) {
    notFound();
  }

  const order = orderData[0];

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const productIds = [...new Set(items.map(item => item.productId))];
  const productRows = productIds.length
    ? await db.select().from(products).where(inArray(products.id, productIds))
    : [];
  const productImagesMap = new Map<number, string[]>();
  for (const p of productRows) {
    productImagesMap.set(p.id, p.imageUrls || []);
  }

  const galleryImages = items.flatMap(item => {
    const urls = productImagesMap.get(item.productId) || [];
    return urls.map((url, i) => ({
      url,
      thumbUrl: url + '?w=400',
      span: '',
    }));
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-warning-background border-warning-background text-warning-foreground',
    processing: 'bg-info-background border-info-background text-info-foreground',
    shipped: 'bg-purple-background border-purple-background text-purple-foreground',
    delivered: 'bg-success-background border-success-background text-success-foreground',
    cancelled: 'bg-error-background border-error-background text-error-foreground',
  };

  const paymentColors: Record<string, string> = {
    pending: 'bg-warning-background border-warning-background text-warning-foreground',
    paid: 'bg-success-background border-success-background text-success-foreground',
    failed: 'bg-error-background border-error-background text-error-foreground',
    refunded: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/orders" className="hover:text-foreground">My Orders</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{order.orderNumber}</span>
        </nav>

        <div className="bg-card text-card-foreground shadow overflow-hidden border border-border">
          <div className="px-6 py-4 bg-muted border-b border-border flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{order.orderNumber}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Ordered on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs rounded-full capitalize font-medium border ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                {order.status}
              </span>
              <span className={`px-3 py-1 text-xs rounded-full capitalize font-medium border ${paymentColors[order.paymentStatus] || 'bg-muted text-muted-foreground'}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="px-6 py-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Items Ordered</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-foreground">₱{parseFloat(item.total).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <OrderImageGallery images={galleryImages} />

          <div className="px-6 py-6 bg-muted">
            <div className="space-y-2 text-right">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₱{parseFloat(order.subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (8.5%)</span>
                <span className="text-foreground">₱{parseFloat(order.tax).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">₱{parseFloat(order.shippingCost).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-foreground">₱{parseFloat(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="px-6 py-6 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-4">
          <Link href="/orders" className="text-primary hover:text-primary-dark font-medium">
            ← Back to Orders
          </Link>
          <Link href="/inventory" className="text-primary hover:text-primary-dark font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
