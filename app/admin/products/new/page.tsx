'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { PackagePlus, Loader2 } from "lucide-react";

export default function AdminNewProductPage() {
  const router = useRouter();
  const createProduct = useMutation(api.products.createProduct);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    quantity: "10",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl,
        quantity: parseInt(formData.quantity, 10),
        id: `prod_${Date.now()}`,
        createdAt: Date.now(),
      });

      router.push("/items");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-card border border-border p-6 rounded-3xl space-y-4">
        <h2 className="text-xl font-black flex items-center gap-2">
          <PackagePlus className="text-primary" /> Create New Product
        </h2>

        <div>
          <label className="text-xs font-bold text-muted-foreground">Product Title</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Next.js Starter Kit"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground">Price ($)</label>
            <Input
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground">Initial Stock Quantity</label>
            <Input
              type="number"
              min="0"
              required
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground">Category</label>
          <Input
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground">Image URL</label>
          <Input
            required
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground">Description</label>
          <textarea
            required
            rows={3}
            className="w-full bg-background border border-border rounded-xl p-3 text-xs"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Product"}
        </button>
      </form>
    </div>
  );
}