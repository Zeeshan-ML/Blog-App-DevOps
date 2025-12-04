// File: blog-app/app/page.tsx
import Link from 'next/link';
import { getUserSession } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default async function Home() {
  const user = await getUserSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar user={user} />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center lg:pt-32">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Share Your Story,<br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Inspire the World
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed font-light">
            A vibrant community where writers share their thoughts, stories, and expertise. 
            Join thousands of creators and readers discovering amazing content every day....
          </p>
          {user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/blogs/create"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Writing
              </Link>
              <Link
                href="/blogs"
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Explore Blogs
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
              <Link
                href="/blogs"
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-xl text-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                Browse Content
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl mb-5 shadow-md">
              ✍️
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Easy Writing</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Create and publish blog posts with a simple, intuitive interface designed for writers.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-3xl mb-5 shadow-md">
              🌍
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Global Community</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Connect with readers and writers from around the world sharing diverse perspectives.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-3xl mb-5 shadow-md">
              🔒
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-900">Secure & Private</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              Your data is protected with enterprise-grade security and privacy controls.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Share Your Voice?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join our community today and start publishing your stories to the world..
            </p>
            {!user && (
              <Link
                href="/signup"
                className="inline-block bg-white hover:bg-gray-100 text-indigo-600 px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Your Account
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
