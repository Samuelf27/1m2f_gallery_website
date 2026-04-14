export default function ArtworksLoading() {
  return (
    <main className="page">
      {/* Header skeleton */}
      <div className="pageHeader" style={{ paddingBottom: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="skeletonLine" style={{ width: "120px", height: "18px" }} />
          <div className="skeletonLine" style={{ width: "200px", height: "13px", opacity: 0.5 }} />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid--2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skeletonCard" style={{ "--delay": `${(i % 6) * 60}ms` } as React.CSSProperties}>
            <div className="skeletonImage" />
            <div className="skeletonMeta">
              <div className="skeletonLine skeletonLine--title" />
              <div className="skeletonLine skeletonLine--sub" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
