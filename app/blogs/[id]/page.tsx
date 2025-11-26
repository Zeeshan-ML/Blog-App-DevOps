import Link from 'next/link';
import { getUserSession } from '@/lib/auth';
import { notFound } from 'next/navigation';
import DeleteButton from './DeleteButton';

interface Blog {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_name: string;
  created_at: string;
  updated_at: string;
}

async function getBlog(id: string): Promise<Blog | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs/${id}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  const user = await getUserSession();
  const isAuthor = user?.id === blog.author_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BlogApp
            </Link>
            <Link
              href="/blogs"
              className="text-gray-700 hover:text-indigo-600 font-semibold transition-colors text-base"
            >
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-3xl shadow-2xl p-10 md:p-12 border border-gray-100">
          {/* Header */}
          <div className="mb-10 pb-8 border-b-2 border-gray-200">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center justify-between text-gray-600">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {blog.author_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-lg block">
                    {blog.author_name}
                  </span>
                  <span className="text-gray-600 text-base">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              {blog.created_at !== blog.updated_at && (
                <span className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                  Updated{' '}
                  {new Date(blog.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>

          {/* Author Actions */}
          {isAuthor && (
            <div className="mt-10 pt-8 border-t-2 border-gray-200 flex gap-4">
              <Link
                href={`/blogs/${blog.id}/edit`}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold text-center transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                ✏️ Edit Post
              </Link>
              <DeleteButton blogId={blog.id} />
            </div>
          )}
        </article>
      </main>
    </div>
  );
}
