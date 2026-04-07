import Link from "next/link"
import { logoutAction } from "./actions"

export default function Admin() {
  return (
    <div className="adminDashboard">
      <h1>Painel Admin</h1>

      <Link href="/admin/artworks" className="adminButton">
        Gerenciar Obras
      </Link>

      <form action={logoutAction}>
        <button type="submit" className="logoutButton">
          Sair
        </button>
      </form>
    </div>
  )
}