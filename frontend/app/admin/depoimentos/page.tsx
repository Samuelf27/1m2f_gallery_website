import { getTestimonials } from "@/services/api"
import type { Testimonial } from "@/types/testimonial.types"
import Link from "next/link"
import { DeleteTestimonialButton } from "./_components/DeleteTestimonialButton"

export default async function AdminDepoimentos() {
  let testimonials: Testimonial[] = []
  let fetchError = false

  try {
    testimonials = await getTestimonials()
  } catch {
    fetchError = true
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <p className="adminPageLabel">Conteúdo</p>
          <h1>Depoimentos</h1>
        </div>
        <Link href="/admin/depoimentos/new" className="adminButton">
          + Novo Depoimento
        </Link>
      </div>

      {fetchError && (
        <p className="adminError">Não foi possível carregar os depoimentos.</p>
      )}

      <div className="adminList">
        {testimonials.length === 0 && !fetchError && (
          <p className="adminEmpty">Nenhum depoimento cadastrado.</p>
        )}
        {testimonials.map((t) => (
          <div key={t.id} className="adminCard">
            <div className="adminCardInfo">
              <h3>{t.name}</h3>
              {t.role && <p>{t.role}{t.city ? ` · ${t.city}` : ""}</p>}
              <span className="adminCardExcerpt">
                &ldquo;{t.text.length > 120 ? t.text.slice(0, 120) + "..." : t.text}&rdquo;
              </span>
            </div>

            <div className="adminCardBadges">
              <span className={`adminBadge ${t.visible ? "adminBadge--green" : "adminBadge--dim"}`}>
                {t.visible ? "Visível" : "Oculto"}
              </span>
            </div>

            <div className="adminCardActions">
              <Link href={`/admin/depoimentos/${t.id}`} className="editButton">
                Editar
              </Link>
              <DeleteTestimonialButton id={t.id} name={t.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}