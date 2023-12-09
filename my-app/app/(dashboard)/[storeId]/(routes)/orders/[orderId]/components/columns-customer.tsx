"use client"

import { ColumnDef } from "@tanstack/react-table"

export type CustomerInfo = {
  orderNumber: number
    phone: string
    address: string
    email: string
    name: string
    lastName: string
    totalPrice: string
  }
  
export const customerColumn: ColumnDef<CustomerInfo>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
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
      accessorKey: "totalPrice",
      header: "Total",
    },
  ]