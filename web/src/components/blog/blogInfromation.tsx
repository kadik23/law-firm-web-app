import useDateFormatter from "@/hooks/useDateFormatter";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

const BLogInfromation = ({ blog }:{blog:Blog}) => {

    return (
        <div className="w-full flex md:flex-col flex-col-reverse mb-8">

            {/* Blog Header (date and share button) */}
            <div className="pb-4 my-4 w-full flex md:flex-row flex-col gap-3 justify-between items-center
            md:border-0 border-b-[1px] border-black">

                {/* date and reading duration */}
                <div className="text-sm font-medium text-gray-600">
                    {useDateFormatter(blog.date)} minutes de lecture
                </div>

                {/* comment and Share Button */}
                <div className="flex gap-3">
                    <button className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md
                        flex items-center gap-1 md:hidden">
                            {/* comment icon */}
                            <Icon
                                icon="mdi:comment"
                                width={20}
                                className="text-black"
                            />
                            <span className="">Commenter</span>
                    </button>
                    <button className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md
                        flex items-center gap-1">
                            {/* share icon */}
                            <Icon
                                icon="mdi:share"
                                width={20}
                                className="text-black"
                            />
                            <span className="md:flex hidden">Partager</span>
                    </button>

                </div>
            </div>

            {/* Blog Image and content */}
            <div className="w-full">
                
                {/* Blog image */}
                <div
                    className="relative lg:w-[500px] lg:h-[250px] float-left mr-4" 
                    style={{ backgroundImage: `url('/images/${blog.image}')` }}
                >
                    <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="rounded-md w-full h-full object-cover" 
                    />
                    <div className="w-full text-white absolute bottom-0 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            {/* like icon */}
                            <button>
                                <Icon
                                        icon="mdi:like"
                                        width={20}
                                />
                            </button>
                            {blog.likes}
                        </div>
                        <div>
                            {/* heart icon */}
                            <button>
                                <Icon
                                        icon="mdi:heart"
                                        width={20}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Blog content */}
                <div className="">
                    <h1 className="md:text-5xl text-4xl font-bold text-gray-800">{blog.title}</h1>
                    <p className="text-md mb-3 text-gray-600"><span className="text-primary font-bold mr-2">Author:</span>{blog.author}</p>
                    <div style={{ textIndent: '2rem' }}  className="text-justify leading-normal text-gray-600 text-sm">{blog.content}</div>
                </div>
            </div>
        </div>
    )
}

export default BLogInfromation;