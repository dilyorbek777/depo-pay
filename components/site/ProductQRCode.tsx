'use client';

import { useState } from 'react';
import { QrCode, Download, Copy, CreditCard } from 'lucide-react';

interface ProductQRCodeProps {
  productId: string;
  productName: string;
  productUrl: string;
  mode?: 'view' | 'checkout';
}

export default function ProductQRCode({ productId, productName, productUrl, mode = 'view' }: ProductQRCodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(productUrl)}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${productName}-qr-code.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const title = mode === 'checkout' ? 'Quick Checkout QR Code' : 'Product QR Code';
  const subtitle = mode === 'checkout' ? 'Scan to buy this product instantly' : 'Scan to view product details';

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-background rounded-2xl border border-border">
      <div className="flex items-center gap-2 text-foreground">
        {mode === 'checkout' ? (
          <CreditCard className="w-4 h-4 text-primary" />
        ) : (
          <QrCode className="w-4 h-4 text-primary" />
        )}
        <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
      </div>
      
      <div className="relative p-2 bg-white rounded-xl border border-border">
        <img
          src={qrCodeUrl}
          alt={`QR Code for ${productName}`}
          className="w-40 h-40"
          loading="lazy"
        />
      </div>

      <div className="flex items-center gap-2 w-full">
        <button
          onClick={handleDownload}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-xl text-[10px] font-bold transition-all border border-border"
        >
          <Download className="w-3 h-3" />
          <span>Download</span>
        </button>
        
        <div className="relative">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-secondary hover:bg-accent text-secondary-foreground rounded-xl text-[10px] font-bold transition-all border border-border"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Link</span>
          </button>
          
          {showTooltip && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap">
              Copied!
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center font-medium">
        {subtitle}
      </p>
    </div>
  );
}
