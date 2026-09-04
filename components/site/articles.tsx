import Link from 'next/link';
import CustomImage from './customImage';
import News from './news';
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { BlogsType } from '@/interfaces';

export default async function Articles() {
  // Fetch posts from Convex on the server
  const rawPosts = await fetchQuery(api.posts.getAllPosts);

  if (!rawPosts || rawPosts.length === 0) {
    return (
      <div className="w-full max-w-[1440px] mx-auto px-6 py-24 text-center text-slate-500 font-medium bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 my-8">
        No articles published yet.
      </div>
    );
  }

  // Normalize post objects to match BlogsType interface
  const data: BlogsType[] = rawPosts.map((post) => ({
    id: post.id || (post._id as unknown as string),
    title: post.title,
    description: post.description,
    category: post.category,
    img: post.imageUrl,
    type: post.type,
  })) as unknown as BlogsType[];

  const heroPost = data[0];
  const secondaryPosts = data.slice(1, 4);
  const newsPosts = data.slice(4);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-12 sm:py-16">
      {/* Featured Articles Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Featured Article (Hero) */}
        {heroPost && (
          <div className="lg:col-span-7 w-full">
            <Link 
              aria-label="Read More" 
              href={`/blog/${heroPost.id}`} 
              className="group block w-full bg-slate-50/60 hover:bg-slate-100/60 border border-slate-200/80 rounded-3xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
            >
              <div className="flex flex-col gap-6">
                {/* Image Wrapper */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-200">
                  <CustomImage 
                    img={heroPost.img} 
                    title={heroPost.title} 
                    nameclass="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-purple-700 border border-white/50 shadow-sm">
                      {heroPost.category}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-3 px-2">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary group-hover:text-purple-600 transition-colors line-clamp-2 leading-tight tracking-tight">
                    {heroPost.title}
                  </h2>
                  {heroPost.description && (
                    <p className="text-slate-600 line-clamp-3 text-sm sm:text-base leading-relaxed">
                      {heroPost.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-2 text-sm font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
                    <span>Read Full Article</span>
                    <span>→</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Secondary Articles Stack */}
        <div className="lg:col-span-5 w-full flex flex-col gap-6">
          {secondaryPosts.map((item) => (
            <Link 
              aria-label="Read More" 
              href={`/blog/${item.id}`} 
              key={item.id} 
              className="group block w-full bg-white hover:bg-slate-50/80 border border-slate-200/70 p-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Thumbnail Image */}
                <div className="relative w-full sm:w-40 shrink-0 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <CustomImage 
                    nameclass="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                    img={item.img} 
                    title={item.title} 
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between h-full gap-2 py-1">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100 mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-primary group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                    Read story →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* News Component (Remaining Posts) */}
      {newsPosts.length > 0 && (
        <div className="mt-16 sm:mt-20 pt-12 border-t border-slate-100">
          <News data={newsPosts as unknown as BlogsType[]} />
        </div>
      )}
    </section>
  );
}