import Link from 'next/link';
import { getUserSession } from '@/lib/auth';
import Navbar from '@/components/Navbar';

interface Blog {
  id: number;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

async function getBlogs(): Promise<Blog[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.blogs || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export default async function BlogsPage() {
  const user = await getUserSession();
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar user={user} />

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Community <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Blogs</span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Discover stories, thinking, and expertise from our community of writers
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-6">📚</div>
            <p className="text-gray-700 text-2xl mb-8 font-semibold">No blog posts yet.</p>
            {user && (
              <Link
                href="/blogs/create"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create the First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${blog.id}`}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 block border border-gray-100 transform hover:-translate-y-1"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
                  {blog.title}
                </h2>
                <p className="text-gray-700 mb-6 line-clamp-4 leading-relaxed text-lg">
                  {blog.content}
                </p>
                <div className="flex items-center justify-between text-base text-gray-600 pt-4 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">{blog.author_name}</span>
                  <span className="text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
