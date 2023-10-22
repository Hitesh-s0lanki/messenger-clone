"use client";

import clsx from "clsx";
import EmptyState from "../components/EmptyState";
import useConverstion from "../hooks/useConversation";

const Home = () => {

    const { isOpen } = useConverstion()

    return ( 
        <div className={
            clsx(`lg:pl-80 h-full lg:block`, isOpen ? 'block' : 'hidden')
        }
        >
            <EmptyState />
        </div>
     );
}
 
export default Home;