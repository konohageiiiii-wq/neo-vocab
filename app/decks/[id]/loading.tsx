export default function DeckDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-6" />
      <div className="h-8 w-64 bg-gray-200 rounded mb-3" />
      <div className="h-4 w-full bg-gray-100 rounded mb-8" />
      <div className="flex gap-3 mb-8">
        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
        <div className="h-10 w-28 bg-gray-200 rounded-lg" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="py-4 flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-48 bg-gray-100 rounded" />
            </div>
            <div className="h-5 w-8 bg-gray-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
