import useDateFormatter from "@/hooks/useDateFormatter";
import useTruncateText from "@/hooks/useTruncateText";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

const BlogCard = ({blog}:{blog:Blog}) => {
    return (
        <div className="w-full p-2 flex flex-col shadow-md rounded-md">
            <img 
                src={blog.image} 
                alt={blog.title} 
                className="rounded-md w-full h-full object-cover mb-2" 
            />
            <div>
                <h3 className="text-sm font-semibold text-gray-900">{blog.title}</h3>
                <p className="text-sm text-gray-500 text-justify mb-4">{useTruncateText(blog.content, 200)}</p>
                <div className="flex justify-between items-center gap-2">
                    <div className="text-sm flex gap-1 items-center">
                        Read post
                        <Icon
                            icon="mdi:like"
                            width={15}
                        />
                    </div>
                    <span className="text-sm text-gray-500">{useDateFormatter(blog.date)}</span>
                </div>
            </div>
        </div>
    )
}

export default BlogCard;