import Link from "next/link"

type Crumb = { label: string; href?: string }

export default function AdminBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <p className="adminPageLabel">
      {crumbs.map((c, i) => (
        <span key={i}>
          {i > 0 && <span className="adminBreadcrumbSep"> / </span>}
          {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
        </span>
      ))}
    </p>
  )
}
