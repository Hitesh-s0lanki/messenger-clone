import getCurrentUser from "@/app/actions/getCurrentUser";
import client from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface IParams{
    conversationId?: string;
}

export async function DELETE(req:Request,
    { params } : { params : IParams}    
) {
    try{
        const { conversationId } = params
        const currentUser = await getCurrentUser()

        if(!currentUser?.id) {
            return new NextResponse("Unauthorized", { status : 401 })
        }

        const existingConversation = await client.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                user: true
            }
        })

        if(!existingConversation){
            return new NextResponse("Invaild ID", { status : 400 })
        }

        const deletedConversation = await client.conversation.deleteMany({
            where:{
                id:conversationId,
                userIds:{
                    hasSome: [currentUser.id]
                }
            }
        })

        existingConversation.user.forEach((user) => {
            if(user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
            }
        })

        return NextResponse.json(deletedConversation)
        
    }catch(error: any){
        console.log(error)
        return new NextResponse("Internal Error", { status : 500 })
    }
}