import useDateFormatter from "@/hooks/useDateFormatter";
import { useFavorites } from "@/hooks/useFavourites";
import useTruncateText from "@/hooks/useTruncateText";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Link from "next/link";

const BlogCard = ({blog, signIn}:{blog:Blog,signIn?:boolean}) => {
    const {removeFromFavorites} = useFavorites();
    const removeBlog = async () => {
        if (window.confirm("Are you sure you want to remove blog titled \"" + blog.title + "\" ?")) {
            const response = await removeFromFavorites(blog.id);
            if (response) {
                window.location.reload();
            }
        }
    }        

    return (
        <div className="w-full p-2 flex flex-col shadow-md rounded-md">
            <img 
                src={blog.image}
                alt={blog.title} 
                className="rounded-md w-full object-cover mb-2 h-32 border" 
            />
            <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-900">{blog.title}</h3>
                <p className="text-sm text-gray-500 text-justify mb-4">{useTruncateText(blog.body, 180)}</p>
                <div className="flex justify-between items-center gap-2">
                    <Link href={`/blog/${blog.id}`} className="text-sm flex gap-1 items-center hover:text-textColor">
                        Read post
                        <Icon
                            icon="mdi:arrow"
                            width={15}
                        />
                    </Link>
                    <span className="text-sm text-gray-500">{useDateFormatter(blog.createdAt)}</span>
                </div>  
            </div>
            {signIn && (
            
                <button className="bg-secondary text-white flex gap-1 items-center 
                justify-center w-full py-2 rounded-lg" onClick={removeBlog}>
                    <Icon
                        icon="mdi:delete"
                        width={15}
                    />
                    retirer le
                </button>
            )}
        </div>
    )
}

export default BlogCard;