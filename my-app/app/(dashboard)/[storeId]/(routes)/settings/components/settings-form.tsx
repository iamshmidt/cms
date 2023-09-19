
"use client"
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Store } from "@prisma/client";
import { Trash } from "lucide-react";
import { z } from "zod";

interface SettingsFormProps {
    initialData: Store;
}

const formSchema = z.object({
    name: z.string().min(1),
  });

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData,
}) => {
    return(
        <>
        <div className="flex items-center justify-between">
            <Heading title="Settings" description="Manage store preferences"></Heading>
            <Button variant="destructive" size="icon" onClick={()=>{}}>
                <Trash className="h-4 w-4"></Trash>
            </Button>
        </div>
        <Separator></Separator>
        </>
    )
}