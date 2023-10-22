import { User } from "@prisma/client";
import { FullCoversationType } from "../types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

const useOtherUser = (conversation: FullCoversationType | {
    user: User[]
}) => {
    const session = useSession()

    const otherUser = useMemo(() =>{
        const currentUserEmail = session?.data?.user?.email

        const otherUser = conversation.user.filter((element) => element.email !== currentUserEmail)

        return otherUser[0]
    },[session?.data?.user?.email, conversation.user])

    return otherUser
}

export default useOtherUser