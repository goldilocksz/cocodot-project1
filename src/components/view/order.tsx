'use client'

import { Plus } from 'lucide-react'
import { Button } from '../ui/button'

export default function OrderView() {
  return (
    <section>
      <div className="flex-middle h-10 justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
        {/* <Button className="flex gap-1">
          <Plus className="h-4 w-4" />
          Add Order
        </Button> */}
      </div>
    </section>
  )
}
