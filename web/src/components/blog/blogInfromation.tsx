import useDateFormatter from "@/hooks/useDateFormatter";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

const BLogInfromation = ({ blog }: { blog: Blog }) => {
  return (
    <div className="w-full flex md:flex-col flex-col-reverse mb-8">
      {/* Blog Header (date and share button) */}
      <div
        className="pb-4 my-4 w-full flex md:flex-row flex-col gap-3 justify-between items-center
            md:border-0 border-b-[1px] border-black"
      >
        {/* date and reading duration */}
        <div className="text-sm font-medium text-gray-600">
          {useDateFormatter(blog.createdAt)}. {blog.readingDuration} minutes de lecture
        </div>

        {/* comment and Share Button */}
        <div className="flex gap-3">
          <button
            className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md
                        flex items-center gap-1 md:hidden"
          >
            {/* comment icon */}
            <Icon icon="mdi:comment" width={20} className="text-black" />
            <span className="">Commenter</span>
          </button>
          <button
            className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md
                        flex items-center gap-1 hover:bg-primary hover:text-white"
          >
            {/* share icon */}
            <Icon icon="mdi:share" width={20} />
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
            src="/images/blog.png"
            alt={blog.title}
            className="rounded-md w-full h-full object-cover"
          />
          <div className="w-full text-white absolute bottom-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              {/* like icon */}
              <button className="relative group overflow-visible">
                <Icon icon="mdi:like" width={20} className="group-hover:text-secondary"/>
                <span className="absolute -top-4 right-2 hidden group-hover:block text-xs font-semibold text-nowrap">Like</span>
              </button>
              {blog.likes}
            </div>
            <div>
              {/* heart icon */}
              <button className="relative group overflow-visible">
                <Icon icon="mdi:heart" width={20} className="group-hover:text-secondary"/>
                <span className="absolute -top-4 right-2 hidden group-hover:block text-xs font-semibold text-nowrap">Favorite blog</span>
              </button>
            </div>
          </div>
        </div>

        {/* Blog content */}
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

export default BLogInfromation;
