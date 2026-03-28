export default function ArtworkCard({ art }) {

  return (
    <div className="art-card">

      <img src={art.image_url} alt={art.title} />

      <h3>{art.title}</h3>

      <p>{art.artist}</p>

      <span>{art.year}</span>

    </div>
  )
}