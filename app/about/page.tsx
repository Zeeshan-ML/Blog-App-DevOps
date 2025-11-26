import Link from 'next/link';
import { getUserSession } from '@/lib/auth';
import Navbar from '@/components/Navbar';

export default async function AboutPage() {
  const user = await getUserSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">BlogApp</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Empowering writers and readers to connect through meaningful stories and ideas.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-12 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            BlogApp is built on the belief that everyone has a story worth sharing. We're creating a platform 
            where writers of all backgrounds can express themselves freely, share their expertise, and connect 
            with readers who value authentic, meaningful content.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Whether you're a professional writer, a passionate hobbyist, or someone with a story to tell, 
            BlogApp provides the tools and community to help your voice be heard.
          </p>
        </div>

        {/* What We Offer */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-md">
                📝
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Community Blogs</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Write and publish your own blog posts. Share your thoughts, experiences, and expertise 
                with a global audience of engaged readers.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-md">
                🔍
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Discover Content</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Explore curated content from across the web. Stay updated with trending topics 
                and discover new perspectives from various sources.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-md">
                👤
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Personal Profile</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Manage your content, track your writing journey, and build your personal brand 
                as a content creator in our community.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-3xl mb-4 shadow-md">
                🔐
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Safe & Secure</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Your privacy matters. We use industry-standard security practices to keep 
                your data safe and your content protected.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-2xl font-bold mb-3">Authenticity</h3>
              <p className="text-indigo-100 text-lg leading-relaxed">
                We celebrate genuine voices and original perspectives.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Community</h3>
              <p className="text-indigo-100 text-lg leading-relaxed">
                Together we create a supportive space for all creators.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Growth</h3>
              <p className="text-indigo-100 text-lg leading-relaxed">
                We help writers develop their craft and reach their potential.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Start your writing journey today and become part of something special.
          </p>
          {user ? (
            <Link
              href="/blogs/create"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Writing
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
