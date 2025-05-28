import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Link from "next/link";

const BlogCard = ({
  blog,
  toggleSelect,
}: {
  blog: Blog & { selected?: boolean };
  toggleSelect: (id: number) => void;
}) => {

  return (
    <div
      className="w-full p-2 flex flex-col shadow-md rounded-md"
      style={{
        backgroundImage: "url('/icons/dashboard/admin/card-pattern.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-full relative">
        <img
          src={blog.image}
          alt={blog.title}
          className="rounded-md w-full object-cover mb-2 h-32 border"
        />
        <input
          type="checkbox"
          name="blog-checkbox"
          className="w-5 h-5 absolute left-2 top-2"
          checked={blog.selected}
          onChange={() => toggleSelect(blog.id as number)}
        />
      </div>
      <div className="mb-3 flex flex-col items-center gap-1">
        <h3 className="text-sm font-semibold text-gray-900 text-center">
          {blog.title}
        </h3>
        <p className="text-sm  text-justify text-center">Category: {blog.category.name}</p>
        <div className="flex justify-center items-center gap-2">
          <p className="text-sm text-gray-500 text-justify text-center">
            Description: {blog.body.slice(0, 100)}...
          </p>
          <Link
            href={`/admin/dashboard/blogs/${blog.id}`}
            className="text-sm flex gap-1 items-center hover:text-primary text-textColor"
          >
            Voir en détaille
            <Icon icon="mdi:arrow" width={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
