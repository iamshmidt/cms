import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
    params
}: { params: { billboardId: string } }) => {
    const billboard = await prismadb.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    })
    return (
        <div className="flex-col px-4">
            <div className="flex-1 space-y-4 p-8 pt-6"></div>
            <BillboardForm initialData={billboard}></BillboardForm>
        </div>
    );
}

export default BillboardPage;