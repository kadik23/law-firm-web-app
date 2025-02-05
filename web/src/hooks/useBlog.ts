import { isAxiosError } from "axios";
import axios from "@/lib/utils/axiosClient";
import { useState } from "react";

function useBlog() {
  const [blog, setBlog] = useState<Blog | null>();
  const [loading, setLoading] = useState(true);
  const [isFavorited, setisFavorited] = useState(false);
  const fetchBlog = async (id: number) => {
    try {
      const response = await axios.get(`/user/blogs/${id}`);
      if (response.status === 200) {
        setBlog(response.data);
        const favResponse = await axios.get(
          `user/favorites/IsBlogFavorited/${response.data.id}`,
          { withCredentials: true }
        );
        if(favResponse.status == 200){
          setisFavorited(favResponse.data.isFavorited)
        }
      }
    } catch (err: unknown) {
      if (isAxiosError(err) && err.response?.status === 401) {
        console.warn("Blog not found");
      } else {
        console.error("An unexpected error occurred:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return { fetchBlog, blog, loading, isFavorited, setisFavorited };
}

export default useBlog;
