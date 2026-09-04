'use client';

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Newspaper,
  Mail,
  PlusCircle,
  Trash2,
  Search,
  Download,
  Image as ImageIcon,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Loader2,
} from "lucide-react";

export default function AdminPanelPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "subscribers">("posts");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Form State
  const [postType, setPostType] = useState<"news" | "blog">("news");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Search State
  const [subscriberSearch, setSubscriberSearch] = useState("");

  // Convex Queries & Mutations
  const posts = useQuery(api.posts.getAllPosts) ?? [];
  const subscribers = useQuery(api.newsletter.getSubscribers) ?? [];
  const createPost = useMutation(api.posts.createPost);
  const deletePost = useMutation(api.posts.deletePost);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormFeedback(null);

    if (!title || !description || !imageUrl) {
      setFormFeedback({ type: "error", message: "Please fill in all required fields." });
      return;
    }

    setIsSubmitting(true);

    try {
      await createPost({
        id: `post_${Date.now()}`,
        title,
        description,
        category,
        imageUrl,
        type: postType,
        createdAt: Date.now(),
      });

      setFormFeedback({
        type: "success",
        message: `${postType === "news" ? "News" : "Blog post"} published successfully!`,
      });
      setTitle("");
      setDescription("");
      setImageUrl("");
      setCategory("General");
    } catch (error: any) {
      setFormFeedback({ type: "error", message: error.message || "Failed to publish post." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost({ id: postId });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(subscriberSearch.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ["Email,Subscribed Date,Status\n"];
    const rows = subscribers.map(
      (sub) => `${sub.email},"${new Date(sub.subscribedAt).toLocaleString()}",${sub.status || "active"}`
    );
    const blob = new Blob([headers.concat(rows.join("\n")).join("")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${Date.now()}.csv`;
    a.click();
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          Loading Admin Panel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-primary pb-12">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg text-primary tracking-tight">Admin Dashboard</span>
          </div>

          <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "posts" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-primary"
              }`}
            >
              <Newspaper className="w-4 h-4" /> Posts & News
            </button>
            <button
              onClick={() => setActiveTab("subscribers")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "subscribers" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-primary"
              }`}
            >
              <Mail className="w-4 h-4" /> Newsletter Subs
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 h-fit">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-primary tracking-tight">Create Post</h2>
                  <p className="text-xs text-slate-500">Publish blog articles or announcements.</p>
                </div>
              </div>

              {formFeedback && (
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold mb-6 ${
                    formFeedback.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-rose-50 border border-rose-200 text-rose-700"
                  }`}
                >
                  {formFeedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{formFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <Label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Post Type</Label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPostType("news")}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        postType === "news" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
                      }`}
                    >
                      News
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostType("blog")}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        postType === "blog" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
                      }`}
                    >
                      Blog
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="post-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Title
                  </Label>
                  <Input
                    id="post-title"
                    type="text"
                    placeholder="Enter headline..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="post-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Category
                    </Label>
                    <select
                      id="post-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="General">General</option>
                      <option value="Product Update">Product Update</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Announcements">Announcements</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="post-img" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Image URL
                    </Label>
                    <Input
                      id="post-img"
                      type="url"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="post-desc" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Description
                  </Label>
                  <textarea
                    id="post-desc"
                    rows={4}
                    placeholder="Write details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                  <span>Publish {postType === "news" ? "News" : "Blog"}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Newspaper className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-primary tracking-tight">Published Content</h2>
                    <p className="text-xs text-slate-500">Manage live news items and blog posts.</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                  Total: {posts.length}
                </span>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm font-medium">No posts or news published yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                  {posts.map((post) => (
                    <div
                      key={post._id}
                      className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row gap-4 justify-between items-start"
                    >
                      <div className="flex gap-3">
                        {post.imageUrl ? (
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                          </div>
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                post.type === "news"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              }`}
                            >
                              {post.type}
                            </span>
                            <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                              <Tag className="w-3 h-3" /> {post.category}
                            </span>
                          </div>
                          <h3 className="font-extrabold text-sm text-primary line-clamp-1">{post.title}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2">{post.description}</p>
                          <p className="text-[10px] font-mono text-slate-400 pt-1">ID: {post.id}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shrink-0 self-end sm:self-start"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "subscribers" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-primary tracking-tight">Newsletter Subscribers</h2>
                  <p className="text-xs text-slate-500">View registered email subscriptions.</p>
                </div>
              </div>

              <button
                onClick={handleExportCSV}
                disabled={subscribers.length === 0}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="mb-6 relative max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search subscriber email..."
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>

            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-sm font-medium">No subscribers found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                      <th className="py-3 px-4">Subscriber Email</th>
                      <th className="py-3 px-4">Subscription Date</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium">
                    {filteredSubscribers.map((sub) => (
                      <tr key={sub._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-primary text-xs">{sub.email}</td>
                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                          {new Date(sub.subscribedAt).toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}