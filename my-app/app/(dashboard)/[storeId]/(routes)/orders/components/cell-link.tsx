"use client"


import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OrderColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";
import Link from "next/link";
import { OrderItem } from "@prisma/client";


interface CellLinkProps {
    data: OrderColumn
}



const CellLink: React.FC<CellLinkProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("Billboard id copied to the clipboard");
    }
    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
            router.refresh();
            toast.success("Billboard deleted")
        } catch (error) {
            toast.error("Make sure you removed all categories using this billboard.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    console.log('data', data)
    // const names: string[] = data.map((item:string) => item.name).join(', ');
    // data.map((item) => item.name).join(', '),

    return (
        <>
        <Link href={`orders/${data.id}`}>{data.products}</Link>
        </>
    );
}

export default CellLink;