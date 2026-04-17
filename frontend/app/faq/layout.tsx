import type { Metadata } from "next"
import { SITE_URL } from "@/lib/config"

const ogImage = `${SITE_URL}/api/og?title=Perguntas+Frequentes&description=Respostas+sobre+obras%2C+aquisi%C3%A7%C3%A3o%2C+entrega+e+exposi%C3%A7%C3%B5es+da+Galeria+1M2F&label=FAQ`

export const metadata: Metadata = {
  title: "Perguntas Frequentes",
  description: "Respostas às dúvidas mais comuns sobre obras, aquisição, formas de pagamento, entrega e exposições da Galeria 1M2F — Maria França.",
  keywords: [
    "faq galeria de arte", "como comprar arte", "entrega obras de arte",
    "Maria França dúvidas", "1M2F galeria perguntas", "certificado autenticidade arte",
  ],
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title:       "FAQ — 1M2F Gallery",
    description: "Respostas sobre obras, aquisição, pagamento e entrega da Galeria 1M2F.",
    url:          `${SITE_URL}/faq`,
    siteName:    "1M2F Gallery",
    locale:      "pt_BR",
    type:        "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "FAQ 1M2F Gallery" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "FAQ — 1M2F Gallery",
    description: "Respostas sobre obras, aquisição, pagamento e entrega.",
    images:      [ogImage],
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "As obras são originais?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Todas as obras disponíveis na galeria são peças originais criadas por Maria França, acompanhadas de certificado de autenticidade assinado pela artista.",
      },
    },
    {
      "@type": "Question",
      name: "Quais são os materiais utilizados?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Maria França trabalha principalmente com acrílico sobre tela, porcelana pintada à mão, papel e aço. Cada coleção pode apresentar técnicas mistas e experimentações com novos materiais.",
      },
    },
    {
      "@type": "Question",
      name: "Posso encomendar uma obra personalizada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim, Maria França aceita encomendas especiais mediante disponibilidade de agenda. Entre em contato via WhatsApp ou formulário de contato para discutir sua proposta.",
      },
    },
    {
      "@type": "Question",
      name: "Como faço para adquirir uma obra?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Clique em 'Adquirir esta Obra' na página da obra desejada para iniciar uma conversa pelo WhatsApp. Nossa equipe responde em até 24 horas com informações de preço, disponibilidade e envio.",
      },
    },
    {
      "@type": "Question",
      name: "Quais formas de pagamento são aceitas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aceitamos transferência bancária (TED/PIX), cartão de crédito em até 12x e boleto bancário. Parcelamentos especiais podem ser negociados diretamente para obras de maior valor.",
      },
    },
    {
      "@type": "Question",
      name: "Vocês entregam em todo o Brasil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. As obras são embaladas com materiais especializados para arte e enviadas via transportadoras parceiras com seguro de transporte incluso. O prazo varia conforme a região.",
      },
    },
    {
      "@type": "Question",
      name: "Fazem envios internacionais?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Realizamos envios internacionais mediante cotação prévia. Os custos alfandegários e de seguro internacional são de responsabilidade do comprador. Entre em contato para mais informações.",
      },
    },
    {
      "@type": "Question",
      name: "Como as obras são embaladas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Utilizamos embalagens especializadas para obras de arte com cantoneiras, espumas de proteção e caixas de madeira para peças maiores, garantindo a integridade da obra durante o transporte.",
      },
    },
  ],
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  )
}
