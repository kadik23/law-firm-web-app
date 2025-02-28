import useDateFormatter from "@/hooks/useDateFormatter";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { Dispatch, SetStateAction } from "react";
import { useFavorites } from "@/hooks/useFavourites";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/contexts/AlertContext";
import { useLike } from "@/hooks/useLike";

const BlogInformation = ({
  blog,
  setisFavorited,
  isFavorited,
  isLike,
  setisLike,
  setBlog
}: {
  blog: Blog;
  setisFavorited: Dispatch<SetStateAction<boolean>>;
  isFavorited: boolean;
  isLike: boolean;
  setisLike: Dispatch<SetStateAction<boolean>>;
  setBlog: Dispatch<SetStateAction<Blog | null | undefined>>
}) => {
  const { addToFavorites, removeFromFavorites } = useFavorites();
  const { likeBlog, dislike } = useLike();
  const { user } = useAuth();
  const { showAlert } = useAlert();

  const handleFavoriteToggle = async () => {
    if (user) {
      const success = isFavorited
        ? await removeFromFavorites(blog.id)
        : await addToFavorites(blog.id);

      if (success) {
        setisFavorited(!isFavorited);
      }
    } else {
      showAlert(
        "warning",
        "Avertissement!",
        "Veuillez vous connecter pour favorite blog."
      );
    }
  };

  const like = async () => {
    if (user) {
      let success;
  
      if (isLike) {
        success = await dislike(blog.id);
        if (success) {
          setBlog({ ...blog, likes: blog.likes - 1 });
        }
      } else {
        success = await likeBlog(blog.id);
        if (success) {
          setBlog({ ...blog, likes: blog.likes + 1 });
        }
      }
  
      if (success) {
        setisLike(!isLike);
      }
    } else {
      showAlert(
        "warning",
        "Avertissement!",
        "Veuillez vous connecter pour liker le blog."
      );
    }
  };  

  return (
    <div className="w-full flex md:flex-col flex-col-reverse mb-8">
      <div
        className="pb-4 my-4 w-full flex md:flex-row flex-col gap-3 justify-between items-center
          md:border-0 border-b-[1px] border-black"
      >
        <div className="text-sm font-medium text-gray-600">
          {useDateFormatter(blog.createdAt)}. {blog.readingDuration} minutes de
          lecture
        </div>
        <button
          className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md
                      flex items-center gap-1 hover:bg-primary hover:text-white"
        >
          <Icon icon="mdi:share" width={20} />
          <span className="md:flex hidden">Partager</span>
        </button>
      </div>

      <div className="w-full">
        <div className="relative lg:w-[500px] lg:h-[250px] float-left mr-4">
          <img
            src={`${blog.image}`}
            alt={blog.title}
            className="rounded-md w-full h-full object-cover"
          />
          <div className="w-full text-white absolute bottom-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                className="relative group overflow-visible"
                onClick={like}
              >
                <Icon
                  icon="mdi:like"
                  width={20}
                  className={`group-hover:text-secondary ${
                    isLike ? "text-blue-500" : ""
                  }`}                />
                <span className="absolute -top-4 right-2 hidden group-hover:block text-xs font-semibold text-nowrap">
                  Like
                </span>
              </button>
              {blog.likes}
            </div>
            <div>
              <button
                onClick={handleFavoriteToggle}
                className="relative group overflow-visible"
              >
                <Icon
                  icon="mdi:heart"
                  width={20}
                  className={`group-hover:text-secondary ${
                    isFavorited ? "text-red-500" : ""
                  }`}
                />
                <span className="absolute -top-4 right-2 hidden group-hover:block text-xs font-semibold text-nowrap">
                  {isFavorited ? "Remove from favorites" : "Add to favorites"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="">
          <h1 className="md:text-5xl text-4xl font-bold text-gray-800">
            {blog.title}
          </h1>
          <div
            style={{ textIndent: "2rem" }}
            className="text-justify leading-normal text-gray-600 text-sm"
          >
            {blog.body}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogInformation;
