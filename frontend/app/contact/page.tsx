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
          Adquira uma obra, encomende uma peça exclusiva ou tire suas dúvidas.
        </p>

        <div className="acquisitionSteps">
          <div className="acquisitionStep">
            <span className="acquisitionStepNum">01</span>
            <div>
              <span className="acquisitionStepTitle">Escolha a obra</span>
              <p>Navegue pela galeria e encontre a peça que fala com você.</p>
            </div>
          </div>
          <div className="acquisitionStep">
            <span className="acquisitionStepNum">02</span>
            <div>
              <span className="acquisitionStepTitle">Entre em contato</span>
              <p>Respondemos em até 24h com valor, disponibilidade e condições.</p>
            </div>
          </div>
          <div className="acquisitionStep">
            <span className="acquisitionStepNum">03</span>
            <div>
              <span className="acquisitionStepTitle">Receba em casa</span>
              <p>Embalagem especializada, seguro de transporte e certificado incluso.</p>
            </div>
          </div>
        </div>

        <div className="contactResponseBadge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Resposta em até 24h
        </div>

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
