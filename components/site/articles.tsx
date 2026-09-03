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
      <div className="w-full px-16 py-16 text-center text-slate-500 font-medium">
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
    img: post.imageUrl, // Map Convex imageUrl to your component's img field
    type: post.type,
  })) as unknown as BlogsType[];

  // Hero post (newest / primary featured post)
  const heroPost = data[0];

  // Secondary articles (up to 3 posts following the hero)
  const secondaryPosts = data.slice(1, 4);

  // Remaining articles for the News component
  const newsPosts = data.slice(4);

  return (
    <div className="w-full px-16 py-16 max-lg:px-3">
      <div className="flex max-xl:flex-col items-center justify-center gap-10">
        
        {/* Featured Hero Article */}
        <div className="flex w-1/2 max-xl:w-2/3 max-md:w-full">
          {heroPost && (
            <Link 
              aria-label="Read More" 
              href={`/blog/${heroPost.id}`} 
              key={heroPost.id}
              className="w-full"
            >
              <div className="w-full flex flex-col items-center gap-5 hover:opacity-95 transition-opacity">
                <CustomImage 
                  img={heroPost.img} 
                  title={heroPost.title} 
                  nameclass="w-full rounded-2xl object-cover" 
                />
                <p className="text-[#7D5FFF] bg-[#E5DFF4] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  {heroPost.category}
                </p>
                <p className="text-2xl text-center font-bold max-lg:text-sm line-clamp-2">
                  {heroPost.title}
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* Secondary Articles Stack */}
        <div className="flex w-1/2 max-xl:w-2/3 max-md:w-full flex-col items-center justify-center gap-8">
          {secondaryPosts.map((item) => (
            <Link 
              aria-label="Read More" 
              href={`/blog/${item.id}`} 
              key={item.id} 
              className="w-full flex max-sm:flex-col justify-between items-center gap-5 group"
            >
              <CustomImage 
                nameclass="rounded-3xl max-lg:h-auto w-52 h-52 max-lg:w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                img={item.img} 
                title={item.title} 
              />
              <div className="flex flex-col items-center sm:items-start justify-between w-full gap-3">
                <p className="text-[#7D5FFF] bg-[#E5DFF4] px-3 py-1 rounded-full text-xs font-bold">
                  {item.category}
                </p>
                <p className="text-xl sm:text-2xl text-center sm:text-left font-bold max-lg:text-sm line-clamp-2">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* News Component with remaining items */}
      {newsPosts.length > 0 && <News data={newsPosts as unknown as BlogsType[]} />}
    </div>
  );
}