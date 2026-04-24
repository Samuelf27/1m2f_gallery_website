import Link from "next/link"
import Image from "next/image"
import { WHATSAPP_NUMBER } from "@/lib/config"

const DEFAULT_INSTAGRAM = "https://www.instagram.com/1m2f_art_gallery/"
const YOUTUBE_URL       = "https://www.youtube.com/@1M2FArtGallery-MariaFran%C3%A7a"

type FooterProps = {
  whatsapp?: string
  instagram?: string
  facebook?: string
}

export default function Footer({ whatsapp, instagram, facebook }: FooterProps) {
  const waUrl = `https://wa.me/${whatsapp || WHATSAPP_NUMBER}`
  const igUrl = instagram || DEFAULT_INSTAGRAM

  return (
    <footer className="footer">

      {/* ── CTA strip ─────────────────────────────── */}
      <div className="footerCta">
        <div className="footerCtaText">
          <p className="footerCtaLabel">Interessado em uma obra?</p>
          <p className="footerCtaHeading">Fale diretamente com a artista</p>
        </div>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className="heroButton">
          Conversar no WhatsApp →
        </a>
      </div>

      <div className="footerTop">
        <div className="footerBrand">
          <Image
            src="/logo.png"
            alt="1M2F Gallery"
            width={72}
            height={28}
            style={{ objectFit: "contain", objectPosition: "left center", opacity: 0.45 }}
          />
          <p className="footerTagline">Arte que transforma ambientes</p>
          <p className="footerLocation">São Paulo, Brasil</p>
        </div>

        <div className="footerNav">
          <div className="footerNavCol">
            <span>Navegação</span>
            <Link href="/">Home</Link>
            <Link href="/artworks">Galeria</Link>
            <Link href="/exposicoes">Exposições</Link>
            <Link href="/about">Sobre</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/imprensa">Imprensa</Link>
            <Link href="/contact">Contato</Link>
          </div>
          <div className="footerNavCol">
            <span>Redes sociais</span>
            <a href={igUrl} target="_blank" rel="noopener noreferrer">Instagram</a>
            {facebook && (
              <a href={facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            )}
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href={waUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <p>© 2026 Maria França · 1M2F Gallery. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}
