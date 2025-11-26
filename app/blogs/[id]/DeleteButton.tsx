'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteButton({ blogId }: { blogId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/blogs');
        router.refresh();
      } else {
        alert('Failed to delete blog post');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
    >
      {loading ? 'Deleting...' : '🗑️ Delete Post'}
    </button>
  );
}
