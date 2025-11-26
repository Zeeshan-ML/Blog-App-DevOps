// File: blog-app/app/profile/page.tsx
import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import db from '@/lib/db';

interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

async function getUserBlogs(userId: number): Promise<Blog[]> {
  try {
    const stmt = db.prepare(`
      SELECT id, title, content, created_at, updated_at
      FROM blogs 
      WHERE author_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(userId) as Blog[];
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return [];
  }
}

export default async function ProfilePage() {
  const user = await getUserSession();

  if (!user) {
    redirect('/login');
  }

  const userBlogs = await getUserBlogs(user.id);
  const totalBlogs = userBlogs.length;
  const totalWords = userBlogs.reduce((acc, blog) => acc + blog.content.split(/\s+/).length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl mb-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600 shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold mb-2">{user.name}</h1>
              <p className="text-xl text-indigo-100">{user.email}</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">{totalBlogs}</div>
              <div className="text-indigo-100 text-lg">Blog Posts</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">{totalWords.toLocaleString()}</div>
              <div className="text-indigo-100 text-lg">Words Written</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center col-span-2 md:col-span-1">
              <div className="text-4xl font-bold mb-2">
                {userBlogs.length > 0
                  ? new Date(userBlogs[0].created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'N/A'}
              </div>
              <div className="text-indigo-100 text-lg">Latest Post</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Blog Posts</h2>
          <Link
            href="/blogs/create"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
          >
            + New Post
          </Link>
        </div>

        {/* User's Blogs */}
        {userBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Blog Posts Yet</h3>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Start your writing journey by creating your first blog post.
            </p>
            <Link
              href="/blogs/create"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 flex flex-col"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4 line-clamp-2 leading-tight">
                  {blog.title}
                </h3>
                <p className="text-gray-700 mb-6 line-clamp-3 flex-grow leading-relaxed text-lg">
                  {blog.content}
                </p>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="font-medium">
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-gray-500">
                      {blog.content.split(/\s+/).length} words
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="flex-1 text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-lg font-semibold transition-colors text-base"
                    >
                      View
                    </Link>
                    <Link
                      href={`/blogs/${blog.id}/edit`}
                      className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-lg font-semibold transition-colors text-base"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
