import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-4">
      <h2 className="text-2xl font-black mb-4">404 - الصفحة غير موجودة</h2>
      <p className="mb-8 text-slate-500">عذراً، لم نتمكن من العثور على الصفحة المطلوبة.</p>
      <Link href="/" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-colors">
        العودة للرئيسية
      </Link>
    </div>
  )
}
