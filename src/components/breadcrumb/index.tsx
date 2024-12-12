import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { useLocation } from 'react-router-dom'
import { Fragment, useMemo } from 'react'

export default function index() {
  const { pathname } = useLocation()

  const breadcrumbs = useMemo(
    function generateBreadcrumbs() {
      const asPathWithoutQuery = pathname.split('?')[0]
      const asPathNestedRoutes = asPathWithoutQuery
        .split('/')
        .filter((v) => v.length > 0)

      const crumblist = asPathNestedRoutes.map((subpath, idx) => {
        const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/')
        return { href, text: subpath }
      })

      return [{ href: '/', text: 'dashboard' }, ...crumblist]
    },
    [pathname],
  )

  if (pathname === '/') {
    return null
  }

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, idx) => (
          <Fragment key={breadcrumb.text}>
            <BreadcrumbItem>
              {breadcrumb.href === pathname ? (
                <BreadcrumbPage>{breadcrumb.text}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.href}>{breadcrumb.text}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {idx + 1 !== breadcrumbs.length && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
