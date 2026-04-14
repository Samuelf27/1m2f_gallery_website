import { getExhibitions } from "@/services/api"
import type { Exhibition } from "@/types/exhibition.types"
import Link from "next/link"
import { DeleteExhibitionButton } from "./_components/DeleteExhibitionButton"

const STATUS_LABELS: Record<string, string> = {
  proxima:   "Próxima",
  em_cartaz: "Em cartaz",
  encerrada: "Encerrada",
  indefinida: "Sem data",
}

const STATUS_CLASS: Record<string, string> = {
  proxima:   "adminBadge--gold",
  em_cartaz: "adminBadge--green",
  encerrada: "adminBadge--dim",
  indefinida: "adminBadge--dim",
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—"
  const [y, m, d] = dateStr.split("-")
  return `${d}/${m}/${y}`
}

export default async function AdminExposicoes() {
  let exhibitions: Exhibition[] = []
  let fetchError = false

  try {
    exhibitions = await getExhibitions()
  } catch {
    fetchError = true
  }

  return (
    <div className="adminPage">
      <div className="adminPageHeader">
        <div>
          <p className="adminPageLabel">Conteúdo</p>
          <h1>Exposições</h1>
        </div>
        <Link href="/admin/exposicoes/new" className="adminButton">
          + Nova Exposição
        </Link>
      </div>

      {fetchError && (
        <p className="adminError">Não foi possível carregar as exposições.</p>
      )}

      <div className="adminList">
        {exhibitions.length === 0 && !fetchError && (
          <p className="adminEmpty">Nenhuma exposição cadastrada.</p>
        )}
        {exhibitions.map((ex) => (
          <div key={ex.id} className="adminCard">
            <div className="adminCardInfo">
              <h3>{ex.title}</h3>
              {ex.subtitle && <p>{ex.subtitle}</p>}
              <span>
                {ex.location ? `${ex.location} · ` : ""}
                {formatDate(ex.start_date)} — {formatDate(ex.end_date)}
              </span>
            </div>

            <div className="adminCardBadges">
              <span className={`adminBadge ${STATUS_CLASS[ex.status]}`}>
                {STATUS_LABELS[ex.status]}
              </span>
            </div>

            <div className="adminCardActions">
              <Link href={`/admin/exposicoes/${ex.id}`} className="editButton">
                Editar
              </Link>
              <DeleteExhibitionButton id={ex.id} title={ex.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}