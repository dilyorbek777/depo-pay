import CustomImage from '@/components/site/customImage';
import { BlogsType } from '@/interfaces';
import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

type Props = {
  params: Promise<{
    blogid: string;
  }>;
};

// Generate Dynamic SEO Metadata
// export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
//   const { blogid } = await params;
//   const rawPosts = await fetchQuery(api.posts.getAllPosts);
//   const post = rawPosts?.find((p) => p.id === blogid || p._id === blogid);

//   if (!post) {
//     return {
//       title: 'Post Not Found',
//     };
//   }

//   // Safe fallback for images to prevent Next.js metadata mapping errors
//   const ogImages = post.imageUrl 
//     ? [post.imageUrl] 
//     : ['https://raw.githubusercontent.com/dilyorbek777/depo-pay/main/public/favicon.png'];

//   return {
//     title: {
//       absolute: `${post.category || 'Blog'}: ${post.title}`,
//     },
//     description: post.description || '',
//     authors: [{ name: 'Dilyorbek Asfandiyorov', url: 'https://depo-pay.vercel.app' }],
//     icons: { icon: 'https://raw.githubusercontent.com/dilyorbek777/depo-pay/main/public/favicon.png' },
//     keywords: `dilyorbekdev, depo, programming, payment, depo pay, depopay, ${post.category || ''}`,
//     openGraph: {
//       countryName: 'Uzbekistan',
//       siteName: 'Prime Pay | DEPOPAY',
//       emails: 'dilyorbekdev@gmail.com',
//       title: `Prime Pay | DEPOPAY | ${post.title}`,
//       description: post.description || '',
//       type: 'article',
//       url: `https://depo-pay.vercel.app/blog/${blogid}`,
//       locale: 'en_EN',
//       images: ogImages,
//     },
//     creator: 'Dilyorbek Asfandiyorov',
//     publisher: 'DEPO',
//   };
// };

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { blogid } = await params;

  const rawPosts = await fetchQuery(api.posts.getAllPosts);
  const post = rawPosts?.find((p) => p.id === blogid || p._id === blogid);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Ensure image URL is a absolute URL or valid path
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
      // DO NOT pass raw strings to emails or non-standard OG fields
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

  // Fetch all posts from Convex
  const rawPosts = await fetchQuery(api.posts.getAllPosts);

  if (!rawPosts || rawPosts.length === 0) {
    notFound();
  }

  // Find target post
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

  // Filter related articles in the same category (excluding active post)
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
    <div className="w-full min-h-screen bg-white">
      {/* Blog Detail Header & Content */}
      <div className="flex max-w-[1440px] items-center justify-center flex-col mx-auto px-7 gap-10 py-16">
        <span className="text-[#7D5FFF] bg-[#E5DFF4] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          {res.category}
        </span>

        <h1 className="max-lg:text-2xl text-center text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight max-w-4xl">
          {res.title}
        </h1>

        <div className="w-full max-w-4xl overflow-hidden rounded-3xl shadow-lg">
          <CustomImage
            img={res.img}
            title={res.title}
            nameclass="w-full max-h-[500px] object-cover"
          />
        </div>

        <div className="w-full max-w-4xl border-l-4 border-[#7D5FFF] pl-6 py-2 my-4">
          <p className="text-lg lg:text-xl font-medium text-slate-700 leading-relaxed whitespace-pre-line">
            {res.description}
          </p>
        </div>
      </div>

      {/* Related News Section */}
      {relatedPosts.length > 0 && (
        <div className="bg-slate-50/60 py-16 border-t border-slate-100">
          <h2 className="text-2xl font-bold text-center mb-10 px-7 lg:text-4xl text-slate-900">
            Related News
          </h2>

          <div className="max-w-5xl mx-auto px-7 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch justify-center">
            {relatedPosts.map((item) => (
              <Link
                aria-label="Read More"
                href={`/blog/${item.id}`}
                key={item.id}
                className="w-full flex flex-col justify-between items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group"
              >
                <CustomImage
                  nameclass="rounded-2xl w-full h-52 object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  img={item.img}
                  title={item.title}
                />
                <div className="flex flex-col items-center text-center justify-between w-full gap-3 pt-2">
                  <span className="text-[#7D5FFF] bg-[#E5DFF4] px-3 py-1 rounded-full text-xs font-bold">
                    {item.category}
                  </span>
                  <p className="text-lg font-bold text-slate-900 line-clamp-2">
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}