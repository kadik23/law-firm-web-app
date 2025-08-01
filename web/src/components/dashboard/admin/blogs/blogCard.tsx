import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import Link from "next/link";
import { useState } from "react";

const BlogCard = ({
  blog,
  toggleSelect,
  processBlog,
}: {
  blog: Blog & { selected?: boolean };
  toggleSelect: (id: number) => void;
  processBlog: (id: number, action: "accept" | "refuse", rejectionReason?: string) => void;
}) => {
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  const status = blog.accepted
    ? "Accepté"
    : blog.rejectionReason
    ? "Refusé"
    : "En attente";

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
            Description: {blog.body.slice(0, 20)}...
          </p>
          <Link
            href={`/admin/dashboard/blogs/${blog.id}`}
            className="text-sm flex gap-1 items-center hover:text-primary text-textColor"
          >
            Voir en détaille
            <Icon icon="mdi:arrow" width={15} />
          </Link>
        </div>
        <div className="mt-2 flex flex-col items-center gap-2 w-full">
          <span className={`text-xs font-bold ${status === "Accepté" ? "text-green-600" : status === "Refusé" ? "text-red-600" : "text-yellow-600"}`}>{status}</span>
          {blog.rejectionReason && (
            <span className="text-xs text-red-500">Raison: {blog.rejectionReason}</span>
          )}
          {!blog.accepted && !blog.rejectionReason && (
            <div className="flex gap-2 mt-2">
              <button
                className="px-3 py-1 bg-green-500 text-white rounded"
                onClick={() => processBlog(blog.id as number, "accept")}
              >
                Accepter
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => setShowReject(true)}
              >
                Refuser
              </button>
            </div>
          )}
          {showReject && (
            <div className="flex flex-col gap-2 mt-2 w-full">
              <input
                type="text"
                className="border rounded px-2 py-1 text-xs w-full"
                placeholder="Raison du refus"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => {
                    processBlog(blog.id as number, "refuse", reason);
                    setShowReject(false);
                    setReason("");
                  }}
                  disabled={!reason.trim()}
                >
                  Confirmer
                </button>
                <button
                  className="px-3 py-1 bg-gray-300 text-black rounded"
                  onClick={() => {
                    setShowReject(false);
                    setReason("");
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
