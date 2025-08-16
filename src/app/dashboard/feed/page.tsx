'use client';
import Feed from '@/components/feed/Feed';

export default function FeedPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Feed del Evento</h1>
      <Feed />
    </div>
  );
}
