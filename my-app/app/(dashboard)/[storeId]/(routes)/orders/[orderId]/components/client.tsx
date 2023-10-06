"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { OrderColumn, columns } from "./columns"
import { CustomerInfo, customerColumn } from "./columns-customer"

import { DataTable } from "@/components/ui/data-table"
import ApiList from "@/components/ui/api-list"


interface ProductClientProps {
    data: OrderColumn[]
}

interface CustomerInfoProps {
    data: CustomerInfo[]
 }

export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Items (${data.length})`} description=""></Heading>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}></DataTable>
        </>
    )
}



export const Customer: React.FC<CustomerInfoProps> = ({
    data
}) => {

    return (
        <>
            <div className="flex items-center justify-between">
                {/* <Heading title={`Items (${data.length})`} description=""></Heading> */}
            </div>
            <Separator />
            <DataTable searchKey="name" columns={customerColumn} data={data}></DataTable>
        </>
    )
}