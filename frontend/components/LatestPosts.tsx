import React from 'react';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  link: string;
}
interface LatestPostsProps {
  posts: Post[];
}

const LatestPosts: React.FC<LatestPostsProps> = ({ posts }) => (
  <section className="max-w-7xl mx-auto px-4 py-12">
    <h2 className="font-serif text-3xl font-bold text-primary-900 mb-8 text-center">Latest Posts & Articles</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <a key={post.id} href={post.link} className="rounded-2xl shadow-lg p-6 bg-white flex flex-col hover:shadow-2xl transition">
          <img src={post.image} alt={post.title} className="rounded-xl mb-4 h-40 object-cover" />
          <h3 className="font-bold text-lg mb-2">{post.title}</h3>
          <p className="text-primary-700 mb-4">{post.excerpt}</p>
          <span className="text-primary-700 font-semibold">Read More →</span>
        </a>
      ))}
    </div>
  </section>
);

export default LatestPosts;
