import { getUserSession } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

interface ExternalBlog {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
}

async function getExternalBlogs(): Promise<ExternalBlog[]> {
  // Simulating external blog sources
  // In production, you would fetch from actual RSS feeds or APIs
  const mockBlogs: ExternalBlog[] = [
    {
      id: '1',
      title: 'The Future of Web Development: Trends to Watch in 2025',
      description: 'Explore the emerging technologies and frameworks that are shaping the future of web development. From AI integration to edge computing, discover what\'s next for developers worldwide.',
      link: 'https://example.com/blog/future-web-dev',
      pubDate: new Date('2025-11-20').toISOString(),
      source: 'Tech Insights Daily',
    },
    {
      id: '2',
      title: 'Building Scalable Applications with Modern JavaScript',
      description: 'Learn best practices for building scalable applications using modern JavaScript frameworks. This comprehensive guide covers architecture patterns, performance optimization, and deployment strategies.',
      link: 'https://example.com/blog/scalable-js-apps',
      pubDate: new Date('2025-11-18').toISOString(),
      source: 'Developer Weekly',
    },
    {
      id: '3',
      title: 'Understanding TypeScript: A Comprehensive Guide',
      description: 'TypeScript has become essential for modern web development. This guide takes you from basic types to advanced patterns, helping you write safer and more maintainable code.',
      link: 'https://example.com/blog/typescript-guide',
      pubDate: new Date('2025-11-15').toISOString(),
      source: 'Code Mastery',
    },
    {
      id: '4',
      title: 'Design Systems: Creating Consistent User Experiences',
      description: 'Discover how to build and maintain design systems that scale across your organization. Learn about component libraries, design tokens, and effective collaboration between designers and developers.',
      link: 'https://example.com/blog/design-systems',
      pubDate: new Date('2025-11-12').toISOString(),
      source: 'UX Magazine',
    },
    {
      id: '5',
      title: 'API Design Best Practices for Modern Applications',
      description: 'Creating robust and developer-friendly APIs is crucial for modern applications. This article covers RESTful design principles, GraphQL considerations, and security best practices.',
      link: 'https://example.com/blog/api-design',
      pubDate: new Date('2025-11-10').toISOString(),
      source: 'API Architect',
    },
    {
      id: '6',
      title: 'The Art of Code Review: Building Better Teams',
      description: 'Code reviews are more than catching bugs—they\'re about knowledge sharing and team growth. Learn how to conduct effective code reviews that improve code quality and team dynamics.',
      link: 'https://example.com/blog/code-review',
      pubDate: new Date('2025-11-08').toISOString(),
      source: 'Engineering Leadership',
    },
    {
      id: '7',
      title: 'Performance Optimization: Making Your Web Apps Faster',
      description: 'Speed matters. Discover practical techniques for optimizing web application performance, from lazy loading and code splitting to caching strategies and image optimization.',
      link: 'https://example.com/blog/performance-optimization',
      pubDate: new Date('2025-11-05').toISOString(),
      source: 'Web Performance Today',
    },
    {
      id: '8',
      title: 'Getting Started with Cloud-Native Development',
      description: 'Cloud-native development is transforming how we build applications. Learn about containerization, microservices, and orchestration platforms like Kubernetes.',
      link: 'https://example.com/blog/cloud-native',
      pubDate: new Date('2025-11-03').toISOString(),
      source: 'Cloud Computing Weekly',
    },
    {
      id: '9',
      title: 'Accessibility in Web Development: A Practical Guide',
      description: 'Making the web accessible to everyone isn\'t just good practice—it\'s essential. Learn how to build inclusive web applications that work for all users.',
      link: 'https://example.com/blog/web-accessibility',
      pubDate: new Date('2025-11-01').toISOString(),
      source: 'Inclusive Design Hub',
    },
  ];

  return mockBlogs;
}

export default async function DiscoverPage() {
  const user = await getUserSession();
  const externalBlogs = await getExternalBlogs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Discover <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Trending Content</span>
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl">
            Explore curated articles and insights from top publications across the web. 
            Stay updated with the latest trends, tutorials, and thought leadership in technology and beyond.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-10 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-3xl">ℹ️</div>
            <div>
              <h3 className="text-xl font-bold mb-2">External Content</h3>
              <p className="text-purple-100 text-lg leading-relaxed">
                These articles are sourced from external publications and websites. 
                Click on any article to visit the original source and read the full content.
              </p>
            </div>
          </div>
        </div>

        {/* External Blogs Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {externalBlogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 border border-gray-100 flex flex-col"
            >
              <div className="mb-4">
                <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                  {blog.source}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight line-clamp-2">
                {blog.title}
              </h2>
              <p className="text-gray-700 mb-6 leading-relaxed flex-grow line-clamp-4 text-lg">
                {blog.description}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">
                  {new Date(blog.pubDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <a
                  href={blog.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors text-base"
                >
                  Read More
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to Share Your Own Content?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join our community and publish your own blog posts. Share your expertise and connect with readers worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blogs"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              View Community Blogs
            </Link>
            {!user && (
              <Link
                href="/signup"
                className="inline-block bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-md hover:shadow-lg"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
