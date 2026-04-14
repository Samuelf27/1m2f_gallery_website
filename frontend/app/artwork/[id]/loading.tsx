export default function ArtworkDetailLoading() {
  return (
    <main className="artPage">
      <div className="artLayout">
        {/* Image skeleton */}
        <div className="artImageBlock">
          <div className="artImageWrapper" style={{ background: "#1a1a1a", animation: "shimmer 1.4s ease infinite", backgroundImage: "linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)", backgroundSize: "600px 100%" }} />
        </div>

        {/* Info skeleton */}
        <div className="artInfoBlock" style={{ display: "flex", flexDirection: "column", gap: "20px", paddingTop: "40px" }}>
          <div className="skeletonLine" style={{ width: "80px", height: "11px" }} />
          <div className="skeletonLine" style={{ width: "70%", height: "36px" }} />
          <div className="skeletonLine" style={{ width: "40%", height: "14px", opacity: 0.6 }} />
          <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <div className="skeletonLine" style={{ width: "40px", height: "10px", opacity: 0.4 }} />
                <div className="skeletonLine" style={{ width: "70px", height: "14px" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeletonLine" style={{ width: `${90 - i * 8}%`, height: "13px", opacity: 0.5 }} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
