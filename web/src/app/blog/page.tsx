
import BlogCategory from "@/components/blog/blogCategory";
import OtherBlogs from "@/components/blog/otherBlogs";
import blogPosts from "@/components/blog/blogs";

const Blogs = () => {
    return(
        <div>
            <BlogCategory />
            <OtherBlogs blogs={blogPosts} />
        </div>
    )
}

export default Blogs;