export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-40 bg-gray-200 rounded mb-8" />
      {/* サマリー */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      {/* グラフ */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-48 bg-gray-100 rounded" />
      </div>
      {/* デッキ進捗 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="h-5 w-24 bg-gray-200 rounded mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 w-full bg-gray-100 rounded mb-1" />
              <div className="h-2 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
