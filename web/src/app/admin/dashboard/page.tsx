'use client'
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
    
    const { user, loading } = useAuth()

    if(loading){
      return (<LoadingSpinner/>)
    }
    return(
        <div>
            Dashboard
            <br />
            {user && user.name} {user && user.surname}
        </div>
    )
} 

export default Dashboard;