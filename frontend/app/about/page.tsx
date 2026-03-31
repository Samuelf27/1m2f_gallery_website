import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sobre Maria França — 1M2F Gallery",
}

export default function AboutPage() {
  return (
    <main className="aboutPage">

      <section className="aboutHero">
        <div className="aboutHeroText">
          <div className="aboutTag">A artista</div>
          <h1 className="aboutTitle">
            Maria<br /><em>França</em>
          </h1>
          <p className="aboutBio">
            Brasileira, nascida em 1969, São Paulo. Vivências nos EUA, América do Sul, Ásia, Caribe, Arábia Saudita e Europa que, quando refletidas, moldam sua obra e suas criações. Com formação em história, TI e turismo, é uma pessoa multiprofissional e multifuncional.
          </p>
        </div>

        <div className="aboutHeroImage">
          <img
            src="https://1m2f.b-cdn.net/wp-content/uploads/2024/03/maria-1512x1512-1.jpeg"
            alt="Maria França"
          />
        </div>
      </section>

      <section className="aboutContent">
        <div className="aboutBlock">
          <div className="aboutBlockLabel">A missão</div>
          <h3>Criar o que nunca foi criado</h3>
          <p>
            Criar arte inesquecível e fascinante, que ninguém fez antes. Criar atmosferas únicas contra o "vazio". Dar espaço mágico para ambientes mais acolhedores e expressivos.
          </p>
        </div>

        <div className="aboutBlock">
          <div className="aboutBlockLabel">A obra</div>
          <h3>Mais de 6.000 criações</h3>
          <p>
            Acrílico ou óleo sobre tela, papel, madeira, têxteis, porcelana e aço. Usa pincéis, espátula, palitos e dedos para resultados únicos e marcantes. Escolher cores harmoniosas é uma habilidade especial de Maria.
          </p>
        </div>

        <div className="aboutBlock">
          <div className="aboutBlockLabel">O que é arte</div>
          <h3>Arte é existência</h3>
          <p>
            Para Maria França, arte é perder-se ou encontrar-se em seus próprios pensamentos e expressar sentimentos ao mundo. É criar, compartilhar a existência e respeitar o Outro com suas diferenças. A ARTE é uma companheira da VIDA.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="footerLogo">1M2F</div>
        <p>© 2026 Maria França. Todos os direitos reservados.</p>
        <div className="footerLinks">
          <a href="https://www.instagram.com/1m2f_art_gallery/" target="_blank">Instagram</a>
          <a href="https://www.youtube.com/@1M2FArtGallery-MariaFran%C3%A7a" target="_blank">YouTube</a>
        </div>
      </footer>

    </main>
  )
}
