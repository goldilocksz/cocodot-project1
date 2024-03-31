'use client'

import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { Fragment, useMemo } from 'react'

export default function index() {
  const pathname = usePathname()

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

      return [{ href: '/', text: 'home' }, ...crumblist]
    },
    [pathname],
  )

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
                  <Link href={breadcrumb.href}>{breadcrumb.text}</Link>
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
