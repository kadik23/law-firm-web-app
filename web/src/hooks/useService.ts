import axios from "@/lib/utils/axiosClient";
import { useState, useEffect } from "react";

export const useService = (id: number | undefined) => {
    const [service, setService] = useState<serviceEntity | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchServiceDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/user/services/${id}`);
                setService(response.data);
            } catch (err) {
                setError("Failed to fetch service details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetails();
    }, [id]);

    return { service, loading, error, setService };
};
