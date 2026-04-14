export type ExhibitionStatus = "proxima" | "em_cartaz" | "encerrada" | "indefinida"

export type Exhibition = {
  id: number
  title: string
  subtitle: string | null
  start_date: string | null
  end_date: string | null
  location: string | null
  description: string | null
  status: ExhibitionStatus
}