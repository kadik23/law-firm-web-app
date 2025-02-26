import axios from "@/lib/utils/axiosClient";
import { useState, useEffect } from "react";

export const useServices = () => {
    const [services, setServices] = useState<serviceEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                const response = await axios.get("/user/services");
                setServices(response.data);
            } catch (err) {
                setError("Failed to fetch services");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    return { services, loading, error };
};
