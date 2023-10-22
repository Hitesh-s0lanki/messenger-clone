import client from '../libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversations = async () =>{
    const currentUser = await getCurrentUser()

    if(!currentUser?.id){
        return []
    }

    try{
        const conversation = await client.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            where:{
                userIds:{
                    has: currentUser.id
                }
            },
            include: {
                user: true,
                messages:{
                    include:{
                        sender: true,
                        seen: true
                    }
                }
            }
        })
        return conversation
    }catch(error: any){
        return []
    }
}

export default getConversations
