"use client";
import { Header } from "./header";
import { useEffect, useState, useCallback } from "react";
import FavBlogs from "@/components/blog/favBlogs";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavourites";

const VosBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [totalBlogs, setTotalBlogs] = useState(0);
    const { getFavorites, getFavoritesCount, searchFavorites, loading } = useFavorites();
    const { loading: authLoading } = useAuth();

    const loadInitialData = useCallback(async () => {
        const favBlogs = await getFavorites();
        const count = await getFavoritesCount();
        console.log("\n Favourite Blogs (VosBlogs.tsx)\n", favBlogs);
        setBlogs(favBlogs.favorites);
        setTotalBlogs(count);
    }, [getFavorites, getFavoritesCount]);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        console.log(blogs) ;
    }, [blogs]);


    const handleSearch = useCallback(async (query: string) => {
        
        if (query.trim() === '') {
            // If search is empty, load all favorites
            loadInitialData();
        } else {
            // Search in favorites
            const searchResults = await searchFavorites(query);
            setBlogs(searchResults.data);
            setTotalBlogs(searchResults.data.length);
        }
    }, [searchFavorites, loadInitialData]);

    if (authLoading) {
        return <div>Chargement...</div>;
    }


    return (
        <div>
            <Header totalBlogs={totalBlogs} onSearch={handleSearch} />
            {blogs.length == 0 && !loading ? "Il n'y a pas des articles": (<FavBlogs blogs={blogs} signIn={true} />)}
            {loading && 'Chargement...'}
        </div>
    );
};

export default VosBlogs;