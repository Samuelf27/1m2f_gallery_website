"use client"

import { useState } from "react"
import Link from "next/link"

type FAQItem = { question: string; answer: string }
type FAQSection = { title: string; items: FAQItem[] }

const FAQ_DATA: FAQSection[] = [
  {
    title: "Sobre as obras",
    items: [
      {
        question: "As obras são originais?",
        answer: "Sim. Todas as obras disponíveis na galeria são peças originais criadas por Maria França, acompanhadas de certificado de autenticidade assinado pela artista.",
      },
      {
        question: "Quais são os materiais utilizados?",
        answer: "Maria França trabalha principalmente com acrílico sobre tela, porcelana pintada à mão, papel e aço. Cada coleção pode apresentar técnicas mistas e experimentações com novos materiais.",
      },
      {
        question: "Existem edições limitadas ou reproduções?",
        answer: "Atualmente a galeria comercializa apenas obras originais. Informações sobre possíveis edições especiais são divulgadas nas redes sociais e por e-mail para contatos cadastrados.",
      },
      {
        question: "Posso encomendar uma obra personalizada?",
        answer: "Sim, Maria França aceita encomendas especiais mediante disponibilidade de agenda. Entre em contato via WhatsApp ou formulário de contato para discutir sua proposta.",
      },
    ],
  },
  {
    title: "Aquisição e pagamento",
    items: [
      {
        question: "Como faço para adquirir uma obra?",
        answer: "Clique em "Adquirir esta Obra" na página da obra desejada para iniciar uma conversa pelo WhatsApp. Nossa equipe responde em até 24 horas com informações de preço, disponibilidade e envio.",
      },
      {
        question: "Quais formas de pagamento são aceitas?",
        answer: "Aceitamos transferência bancária (TED/PIX), cartão de crédito em até 12x e boleto bancário. Parcelamentos especiais podem ser negociados diretamente para obras de maior valor.",
      },
      {
        question: "Os preços estão disponíveis no site?",
        answer: "Por questão de política da galeria, os valores são fornecidos mediante contato direto. Isso nos permite oferecer condições personalizadas e garantir a melhor experiência de aquisição.",
      },
    ],
  },
  {
    title: "Entrega e logística",
    items: [
      {
        question: "Vocês entregam em todo o Brasil?",
        answer: "Sim. As obras são embaladas com materiais especializados para arte e enviadas via transportadoras parceiras com seguro de transporte incluso. O prazo varia conforme a região.",
      },
      {
        question: "Fazem envios internacionais?",
        answer: "Realizamos envios internacionais mediante cotação prévia. Os custos alfandegários e de seguro internacional são de responsabilidade do comprador. Entre em contato para mais informações.",
      },
      {
        question: "Como as obras são embaladas?",
        answer: "Utilizamos embalagens especializadas para obras de arte com cantoneiras, espumas de proteção e caixas de madeira para peças maiores, garantindo a integridade da obra durante o transporte.",
      },
    ],
  },
  {
    title: "Exposições e parcerias",
    items: [
      {
        question: "Como posso convidar Maria França para uma exposição?",
        answer: "Propostas de exposição devem ser enviadas pelo formulário de contato ou diretamente por e-mail. Incluir informações sobre o espaço, público esperado, data e proposta curatorial facilita a avaliação.",
      },
      {
        question: "A galeria cede obras para exposições institucionais?",
        answer: "Sim, avaliamos propostas de comodato para exposições em museus, centros culturais e espaços institucionais. Entre em contato com antecedência mínima de 3 meses para análise.",
      },
    ],
  },
]

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null)

  function toggle(key: string) {
    setOpen((prev) => (prev === key ? null : key))
  }

  return (
    <main className="page faqPage">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="pageHeader">
        <div>
          <div className="aboutTag" style={{ marginBottom: "16px" }}>Central de ajuda</div>
          <h1 className="title" style={{ marginBottom: "8px" }}>Perguntas Frequentes</h1>
          <p className="pageSubtitle">Encontre respostas sobre obras, aquisição e exposições</p>
        </div>
        <Link href="/contact" className="heroButton">Falar conosco →</Link>
      </div>

      {/* ── Acordeão ──────────────────────────────────────── */}
      <div className="faqContent">
        {FAQ_DATA.map((section) => (
          <section key={section.title} className="faqSection">
            <h2 className="faqSectionTitle">{section.title}</h2>
            <div className="faqList">
              {section.items.map((item, i) => {
                const key = `${section.title}-${i}`
                const isOpen = open === key
                return (
                  <div key={key} className={`faqItem${isOpen ? " faqItem--open" : ""}`}>
                    <button
                      type="button"
                      className="faqQuestion"
                      onClick={() => toggle(key)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.question}</span>
                      <svg
                        className="faqChevron"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className="faqAnswer" aria-hidden={!isOpen}>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="exhCta">
        <div>
          <h2>Ainda tem dúvidas?</h2>
          <p>Nossa equipe está disponível para responder qualquer pergunta sobre as obras ou o processo de aquisição.</p>
        </div>
        <Link href="/contact" className="heroButton">Entrar em contato →</Link>
      </section>

    </main>
  )
}
