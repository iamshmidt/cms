import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage = async ({
    params
}: { params: { sizeId: string } }) => {
    const size = await prismadb.size.findUnique({
        where: {
            id: params.sizeId
        }
    })
    return (
        <div className="flex-col px-4">
            <div className="flex-1 space-y-4 p-8 pt-6"></div>
            <SizeForm initialData={size}></SizeForm>
        </div>
    );
}

export default SizePage;