"use client"

import { ColumnDef } from "@tanstack/react-table"


export type CustomerInfoEmail = {
  name: string
  email: string
  phone: string
  address: string
}

export type OrderColumn = {
  id: string
  name: string
  quantity: number
  price: string
  category: string
  images?: string[]
  size: string
  color: string
  createdAt: string
  total: string
  trackingNumber?: string
  status?: string
  customer?: CustomerInfoEmail
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }} />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
]
