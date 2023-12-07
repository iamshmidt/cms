"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import Link from "next/link"
import CellLink from "./cell-link"

export type OrderColumn = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  amount: number
  totalPrice: string
  products: string
  createdAt: string
  orderId: string
  productId: string
  status: string
  trackingNumber?: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => <CellLink data={row.original} />

  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  }
]
