'use client';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h2 className="text-2xl font-bold mb-4">حدث خطأ ما!</h2>
      <p className="text-slate-500 mb-8 max-w-md">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800"
      >
        حاول التحديث
      </button>
    </div>
  );
}
