import Link from "next/link"
import Image from "next/image"
import { WHATSAPP_URL } from "@/lib/config"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerTop">
        <div className="footerBrand">
          <Image
            src="/logo.png"
            alt="1M2F Gallery"
            width={64}
            height={24}
            style={{ objectFit: "contain", objectPosition: "left center", opacity: 0.5 }}
          />
          <p className="footerTagline">Arte que transforma ambientes</p>
        </div>

        <div className="footerNav">
          <div className="footerNavCol">
            <span>Navegação</span>
            <Link href="/">Home</Link>
            <Link href="/artworks">Galeria</Link>
            <Link href="/about">Sobre</Link>
            <Link href="/contact">Contato</Link>
          </div>
          <div className="footerNavCol">
            <span>Redes sociais</span>
            <a href="https://www.instagram.com/1m2f_art_gallery/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.youtube.com/@1M2FArtGallery-MariaFran%C3%A7a" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="footerBottom">
        <p>© 2026 Maria França. Todos os direitos reservados.</p>
        <p className="footerLocation">São Paulo, Brasil</p>
      </div>
    </footer>
  )
}