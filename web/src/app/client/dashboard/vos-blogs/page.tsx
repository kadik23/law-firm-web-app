import { Header } from "./header";
import blogPosts from "@/consts/blogs";
import FavBlogs from "@/components/blog/favBlogs";

const VosBlogs= () => {
    const totalBlogs = blogPosts.length;
    return (
        <div>
            <Header totalBolgs={totalBlogs}/>
            <FavBlogs blogs={blogPosts} signIn={true} />
        </div>
    )
}

export default VosBlogs;