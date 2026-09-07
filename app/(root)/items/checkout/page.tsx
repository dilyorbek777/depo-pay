'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useCart } from '@/context/CartContext';
import { useUserId } from '@/lib/useUserId';
import { Loader2, ShoppingBag, CheckCircle2 } from 'lucide-react';

export default function CheckoutRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId') as Id<'products'>;
  const { addToCart } = useCart();
  const userId = useUserId();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productAdded, setProductAdded] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);

  const product = useQuery(api.products.getProductById, { id: productId });

  useEffect(() => {
    const processCheckout = async () => {
      // Prevent multiple executions
      if (hasProcessed) return;

      if (!productId) {
        setError('No product specified');
        setIsProcessing(false);
        return;
      }

      // Wait for product to load
      if (!product) {
        // Product is still loading or doesn't exist
        if (product === undefined) {
          // Still loading, wait
          return;
        } else {
          // Product doesn't exist
          setError('Product not found');
          setIsProcessing(false);
          return;
        }
      }

      try {
        setHasProcessed(true);
        
        // Add product to cart
        addToCart({
          id: product._id,
          name: product.name,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
        });

        setProductAdded(true);
        setIsProcessing(false);
        
        // Redirect to cart page after a short delay
        setTimeout(() => {
          router.push('/items/cart');
        }, 1000);
      } catch (err) {
        console.error('Error adding to cart:', err);
        setError('Failed to add product to cart');
        setIsProcessing(false);
      }
    };

    processCheckout();
  }, [productId, product, addToCart, router, hasProcessed]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <ShoppingBag className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p className="text-muted-foreground text-xs mb-6 text-center">{error}</p>
        <button
          onClick={() => router.push('/items')}
          className="px-5 py-2.5 bg-primary text-primary-foreground rounded-2xl text-xs font-bold"
        >
          Return to Store
        </button>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="flex items-center gap-3 text-muted-foreground font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span>Preparing checkout...</span>
        </div>
      </div>
    );
  }

  if (productAdded) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <CheckCircle2 className="w-12 h-12 text-primary mb-4" />
        <h2 className="text-xl font-bold mb-2">Product Added</h2>
        <p className="text-muted-foreground text-xs mb-6">
          Redirecting to checkout...
        </p>
        <div className="flex items-center gap-3 text-muted-foreground font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return null;
}
