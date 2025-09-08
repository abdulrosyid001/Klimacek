import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { posts } from '../../data/posts';
import Link from 'next/link';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <>
        <Header />
        <main className="bg-beige min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl text-primary-900">Article not found.</p>
          <Link href="/" className="mt-6 text-primary-700 underline">Back to Home</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title} - ATAMAGRI News</title>
      </Head>
      <Header />
      <main className="bg-beige min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
          <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-xl mb-6" />
          <h1 className="font-serif text-3xl font-bold text-primary-900 mb-2">{post.title}</h1>
          <p className="text-primary-700 mb-4">{post.excerpt}</p>
          <div className="text-primary-900 leading-relaxed mb-8 whitespace-pre-line">{post.content}</div>
          <Link href="/" className="inline-block bg-primary-700 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-primary-900 transition-colors">Back to News</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
