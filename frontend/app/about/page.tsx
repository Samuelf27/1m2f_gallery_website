// ✅ Sem "use client" - é uma página estática

export default function About() {
  return (
    <main className="pageContainer">
      <section className="pageHero">
        <h1>Sobre a Galeria</h1>
        <p>Arte contemporânea com identidade e propósito</p>
      </section>

      <section className="pageContent">
        <div className="contentBox">
          <h2>Nossa visão</h2>
          <p>
            A 1M2F Gallery nasce com o objetivo de conectar pessoas à arte
            contemporânea através de uma experiência digital moderna,
            minimalista e imersiva.
          </p>

          <h2>O que fazemos</h2>
          <p>
            Curamos obras únicas, destacando artistas e criando uma ponte
            entre criatividade e tecnologia.
          </p>
        </div>
      </section>
    </main>
  )
}
