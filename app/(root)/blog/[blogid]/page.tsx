import CustomImage from '@/components/site/customImage';
import { BlogsType } from '@/interfaces';
import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { ArrowLeft, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

type Props = {
  params: Promise<{
    blogid: string;
  }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { blogid } = await params;

  const rawPosts = await fetchQuery(api.posts.getAllPosts);
  const post = rawPosts?.find((p) => p.id === blogid || p._id === blogid);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const imageUrl = post.imageUrl || 'https://raw.githubusercontent.com/dilyorbek777/depo-pay/main/public/favicon.png';

  return {
    title: {
      absolute: `${post.category || 'Blog'}: ${post.title}`,
    },
    description: post.description || '',
    authors: [{ name: 'Dilyorbek Asfandiyorov' }],
    keywords: ['dilyorbekdev', 'depo', 'programming', 'payment', 'depo pay', 'depopay'],
    openGraph: {
      title: `Prime Pay | DEPOPAY | ${post.title}`,
      description: post.description || '',
      type: 'article',
      siteName: 'Prime Pay | DEPOPAY',
      url: `https://depo-pay.vercel.app/blog/${blogid}`,
      locale: 'en_US',
      images: [
        {
          url: imageUrl,
          alt: post.title || 'Blog Post Image',
        },
      ],
    },
    creator: 'Dilyorbek Asfandiyorov',
    publisher: 'DEPO',
  };
};

export default async function DetailBlog({ params }: Props) {
  const { blogid } = await params;

  const rawPosts = await fetchQuery(api.posts.getAllPosts);

  if (!rawPosts || rawPosts.length === 0) {
    notFound();
  }

  const currentPost = rawPosts.find((p) => p.id === blogid || p._id === blogid);

  if (!currentPost) {
    notFound();
  }

  const res: BlogsType = {
    id: currentPost.id || (currentPost._id as unknown as string),
    title: currentPost.title,
    description: currentPost.description,
    category: currentPost.category,
    img: currentPost.imageUrl || '/blogs/default.webp',
    type: currentPost.type,
  } as unknown as BlogsType;

  const relatedPosts = rawPosts
    .filter((p) => p.category === res.category && (p.id !== blogid && p._id !== blogid))
    .slice(0, 2)
    .map((item) => ({
      id: item.id || (item._id as unknown as string),
      title: item.title,
      description: item.description,
      category: item.category,
      img: item.imageUrl || '/blogs/default.webp',
      type: item.type,
    }));

  return (
    <article className="w-full min-h-screen bg-white">
      {/* Top Header & Content Container */}
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8 py-10 lg:py-16 flex flex-col items-center">
        
        {/* Back Navigation Button */}
        <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-purple-600 bg-slate-50 hover:bg-purple-50 px-4 py-2.5 rounded-full border border-slate-200/80 hover:border-purple-200 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blog</span>
          </Link>
          
         
        </div>

        {/* Header Metadata & Title */}
        <div className="flex flex-col items-center gap-5 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200/60 text-purple-700 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{res.category}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-[1.15]">
            {res.title}
          </h1>
        </div>

        {/* Featured Cover Image Container */}
        <div className="w-full max-w-4xl my-8 sm:my-12 relative rounded-3xl overflow-hidden bg-slate-100 shadow-xl border border-slate-200/80">
          <CustomImage
            img={res.img}
            title={res.title}
            nameclass="w-full max-h-[520px] object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="w-full max-w-3xl mx-auto">
          <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-50/70 border-l-4 border-purple-600 border-y border-r border-slate-200/60 shadow-sm backdrop-blur-sm">
            <p className="text-base sm:text-lg lg:text-xl font-medium text-slate-700 leading-relaxed sm:leading-loose whitespace-pre-line">
              {res.description}
            </p>
          </div>
        </div>
      </div>

      {/* Related News Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50/70 py-16 sm:py-20 border-t border-slate-100">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="text-center mb-12 flex flex-col items-center gap-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
                Related Articles
              </h2>
              <p className="text-sm sm:text-base text-slate-500">
                Explore more insights from the <span className="font-semibold text-slate-700">{res.category}</span> category
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {relatedPosts.map((item) => (
                <Link
                  aria-label="Read More"
                  href={`/blog/${item.id}`}
                  key={item.id}
                  className="group flex flex-col justify-between bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex flex-col gap-4">
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
                      <CustomImage
                        nameclass="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        img={item.img}
                        title={item.title}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-1">
                      <span className="self-start px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                        {item.category}
                      </span>
                      <h3 className="text-lg font-bold text-primary group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 pt-4 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}