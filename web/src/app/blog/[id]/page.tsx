"use client"
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import BlogCategory from "@/components/blog/blogCategory";
import BLogInfromation from "@/components/blog/blogInfromation";
import SearchSection from "@/components/blog/searchSection";
import ReaderFeedback from "@/components/blog/readerFeedback";

type Blog = {
    id: number;
    title: string;
    author: string;
    content: string;
    likes: number;
    date: Date;
    readingDuration: number; // milliseconds
    image: string;
    category: string;
}

const page = () => {

    const { id } = useParams() as {id: string};
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // State to track loading status



    const blogPosts: Blog[] = [
        {
            id: 1,
            title: "Opening Day of Boating Season, Seattle WA",
            author: "John Doe",
            content: "Of course the Puget Sound is very watery, and where there is water, there are boats. Today is  the Grand Opening of Boating Season when traffic gets stalled in the University District (UW) while the Montlake Bridge  lorem ipsum lorem ispum lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem Of course the Puget Sound is very watery, and where there is water, there are boats. Today is  the Grand Opening of Boating Season when traffic gets stalled in the University District (UW) while the Montlake Bridge  lorem ipsum lorem ispum lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem Of course the Puget Sound is very watery, and where there is water, there are boats. Today is  the Grand Opening of Boating Season when traffic gets stalled in the University District (UW) while the Montlake Bridge  lorem ipsum lorem ispum lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem",
            likes: 250,
            date: new Date(),
            readingDuration: 240000, // milliseconds
            image: "/images/blog.png",
            category: "Droit administratif",
        },
        {
            id: 2,
            title: "Opening Day of Boating Season, Seattle WA",
            author: "Jane Smith",
            content: "Of course the Puget Sound is very watery, and where there is water, there are boats. Today is  the Grand Opening of Boating Season when traffic gets stalled in the University District (UW) while the Montlake Bridge  lorem ipsum lorem ispum lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem Of course the Puget Sound is very watery, and where there is water, there are boats. Today is  the Grand Opening of Boating Season when traffic gets stalled in the University District (UW) while the Montlake Bridge  lorem ipsum lorem ispum lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem Of course the Puget Sound is very watery, and where there is water, there are boats. Today is  the Grand Opening of Boating Season when traffic gets stalled in the University District (UW) while the Montlake Bridge  lorem ipsum lorem ispum lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem lorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum loremlorem lorem ipsum lorem ipsum lorem",
            likes: 300,
            date: new Date(),
            readingDuration: 4000,
            image: "/images/blog.png",
            category: "Droit des affaires",
        },
    ];

    useEffect(() => {
        if (id) {
            const foundBlog = blogPosts.find((post) => post.id === parseInt(id));
            setBlog(foundBlog || null);
            setLoading(false); // Set loading to false once the data is fetched
        }
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <h1 className="text-3xl font-bold">Loading...</h1>
            </div>
        );
    }

    if (!blog) return(
        <div className="h-screen flex items-center justify-center">
            <h1 className="text-7xl font-bold">Blog not found!</h1>
        </div>

    ) 

    return(
        <div className="py-8 lg:mx-12 mx-8">
            <SearchSection />
            <BlogCategory blogCategory={blog.category}/>
            <BLogInfromation blog={blog} />
            <Suspense fallback={<div>Loading...</div>}>
                <ReaderFeedback />
            </Suspense>
        </div>
    )
}

export default page;