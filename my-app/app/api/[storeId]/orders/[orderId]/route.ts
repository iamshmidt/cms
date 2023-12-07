import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    {params} : {params: { colorId: string}}
){
    try {
       
        if(!params.colorId){
            return new NextResponse("color ID is required", {status: 400})
        }
        

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }, 
        })
        return NextResponse.json(color)
    } catch (error) {
        console.log('[color GET error: ', error)
        return new NextResponse("Internal error", {status: 500})
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, orderId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { trackingNumber, status } = body;
        console.log('body', body)
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if (!trackingNumber) {
            return new NextResponse("Tracking number is required", { status: 400 });
        }
        if (!params.orderId) {
            return new NextResponse("Order ID is required", { status: 400 });
        }

        // Check if the store associated with the user is authorized to update the order
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Update the tracking number for the order
        const updatedOrder = await prismadb.order.update({
            where: {
                id: params.orderId,
                // Assuming you need to check the storeId as well for extra security
                // storeId: params.storeId
            },
            data: {
                trackingNumber,
                status
            }
        });

        return NextResponse.json(updatedOrder);

    } catch (error) {
        console.log('[Order PATCH error]: ', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}


export async function DELETE (
    req: Request,
    {params} : {params: {storeId: string,  colorId: string}}
){
    try {
        const {userId} = auth();
        if (!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }
        if(!params.colorId){
            return new NextResponse("color ID is required", {status: 400})
        }
        
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", { status: 403})
        }


        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId
            }, 
        })
        return NextResponse.json(color)
    } catch (error) {
        console.log('[color DELETE error: ', error)
        return new NextResponse("Internal error", {status: 500})
    }
}