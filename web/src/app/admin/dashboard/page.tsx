'use client'
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
    
    const { user, loading } = useAuth()

    if(loading){
      return (<div>Chargement...</div>)
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