'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function Dashboard() {
  const [list, setList] = useState([])

  useEffect(() => {
    const supabase = createClient()
    const fetchData = async () => {
      const { data } = await supabase.from('countries').select('*')
      console.log(data)

      setList((data as []) ?? [])
    }
    fetchData()
  }, [])
  return (
    <>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Products</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Inventory</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          {list.map((country: any) => (
            <div
              key={country.id}
              className="flex items-center justify-center gap-4"
            >
              <div>{country?.id}</div>
              <div>{country?.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
