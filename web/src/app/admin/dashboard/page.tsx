'use client'
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
    
    const { user, loading } = useAuth()

    if(loading){
      return (<div>Loading...</div>)
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