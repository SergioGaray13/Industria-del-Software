'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      setPosts(data || []);
    };
    fetchPosts();
  }, []);

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="border p-4 rounded">
          <p className="text-sm text-gray-500">{post.type.toUpperCase()}</p>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
