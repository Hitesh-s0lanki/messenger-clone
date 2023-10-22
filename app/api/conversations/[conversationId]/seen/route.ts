import getCurrentUser from "@/app/actions/getCurrentUser"
import client from "@/app/libs/prismadb"
import { NextResponse } from "next/server"

interface IParams{
    conversationId?: string
}

export async function POST(req: Request, { params } : { params : IParams}) {
    try{
        const currentUser = await getCurrentUser()
        const {
            conversationId
        } = params

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse("Unauthorized", { status : 401})
        }

        //Finding the existing conversation
        const conversation = await client.conversation.findUnique({
            where:{
                id: conversationId
            },
            include:{
                messages:{
                    include:{
                        seen:true
                    }
                },
                user:true
            }
        })

        if(!conversation){
            return new NextResponse("Invalid Id",{status:400})
        }

        // Find Last Message
        const lastMessage = conversation.messages[conversation.messages.length - 1]

        if(!lastMessage){
            return NextResponse.json(conversation)
        }

        //Update seen of last message
        const updatedMessage = await client.message.update({
            where:{
                id:lastMessage.id
            },
            include:{
                sender: true,
                seen: true
            },
            data:{
                seen:{
                    connect:{
                        id:currentUser.id
                    }
                }
            }
        })

        return NextResponse.json(updatedMessage)
    }catch(error: any){
        console.log(error)
        return new NextResponse("Internal Error", { status : 500})
    }
}