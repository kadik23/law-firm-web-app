import OtherBlogs from "@/components/blog/otherBlogs";
import { Header } from "./header";
import blogPosts from "@/components/blog/blogs";

const VosBlogs= () => {
    const totalBlogs = blogPosts.length;
    return (
        <div>
            <Header totalBolgs={totalBlogs}/>
            <OtherBlogs blogs={blogPosts} signIn={true} />
        </div>
    )
}

export default VosBlogs;