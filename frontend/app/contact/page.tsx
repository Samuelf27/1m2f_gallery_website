import { getSettings } from "@/services/api"
import { WHATSAPP_NUMBER } from "@/lib/config"
import ContactForm from "./_components/ContactForm"

const DEFAULT_INSTAGRAM = "https://www.instagram.com/1m2f_art_gallery/"
const YOUTUBE_URL       = "https://www.youtube.com/@1M2FArtGallery-MariaFran%C3%A7a"

export default async function ContactPage() {
  const settings = await getSettings()

  const waNumber = settings.whatsapp || WHATSAPP_NUMBER
  const waUrl    = `https://wa.me/${waNumber}`
  const waLabel  = `+${waNumber.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "$1 $2 $3-$4")}`

  const contactItems = [
    {
      label: "Telefone / WhatsApp",
      value: waLabel,
      href:  waUrl,
    },
    settings.email
      ? { label: "E-mail", value: settings.email, href: `mailto:${settings.email}` }
      : { label: "E-mail", value: "m.franca@1m2f-art-gallery.com", href: "mailto:m.franca@1m2f-art-gallery.com" },
    {
      label: "Instagram",
      value: "@1m2f_art_gallery",
      href:  settings.instagram || DEFAULT_INSTAGRAM,
    },
    {
      label: "YouTube",
      value: "1M2F Art Gallery",
      href:  YOUTUBE_URL,
    },
    {
      label: "Localização",
      value: settings.address || "São Paulo, Brasil",
      href:  null as string | null,
    },
  ]

  return (
    <main className="contactPage">
      <div className="contactLeft">
        <div className="contactTag">Fale conosco</div>
        <h1 className="contactTitle">
          Entre em<br /><em>contato</em>
        </h1>
        <p className="contactDesc">
          Adquira uma obra, encomende uma peça exclusiva ou tire suas dúvidas. Respondemos em até 24h.
        </p>

        <div className="contactInfo">
          {contactItems.map((item) => (
            <div key={item.label} className="contactItem">
              <span>{item.label}</span>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {item.value}
                </a>
              ) : (
                <span className="contactItemValue">{item.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <ContactForm waUrl={waUrl} />
    </main>
  )
}
