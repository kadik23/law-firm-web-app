"use client";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { getRelativeTime } from "@/lib/utils/relativeTime";
import { useRouter } from "next/navigation";

interface NotificationItemProps {
  item: NotificationType;
  onDelete: (id: number) => void;
  onMarkAsRead: (id: number) => void;
}

const NotificationItem = ({ item, onDelete, onMarkAsRead }: NotificationItemProps) => {
  const router = useRouter();

  const getNotificationTitle = () => {
    switch (item.type) {
      case "Comments":
        return "New Comment";
      case "Consultation":
        return "Consultation Update";
      case "Documents":
        return "Document Update";
      default:
        return "Notification";
    }
  };

  const handleClick = () => {
    if (item.type === "Comments" && item.entityId) {
      router.push(`/blog/${item.entityId}`);
    }
  };

  const clickable = item.type === "Comments";

  return (
    <div
      className={`flex flex-col gap-2 ${item.isRead ? "bg-primary" : "bg-secondary"} text-white px-8 py-4 rounded-lg ${!item.isRead ? "border-l-4 border-yellow-400" : ""} ${clickable ? "cursor-pointer hover:bg-secondary/80 transition" : ""}`}
      onClick={clickable ? handleClick : undefined}
      tabIndex={clickable ? 0 : -1}
      role={clickable ? "button" : undefined}
      aria-label={clickable ? "Voir le blog" : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {item.user ? (
            <button className="bg-secondary w-8 h-8 rounded-full flex items-center justify-center p-2 btn font-semibold shadow-lg">
              {item.user?.name[0]}
            </button>
          ) : null}
          <div className="font-semibold">
            {item.user ? item.user?.name : getNotificationTitle()}
          </div>
          {!item.isRead && <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>}
        </div>
        <div className="items-center gap-2 md:flex hidden">
          {!item.isRead && (
            <button
              className="px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-secondary hover:border hover:border-zinc-300"
              onClick={e => { e.stopPropagation(); onMarkAsRead(item.id); }}
            >
              <Icon icon="mdi:check" width={16} />
              <span className="text-xs">Marquer comme lu</span>
            </button>
          )}
          <button
            className="px-3 py-1 rounded-md text-sm flex items-center gap-1 hover:bg-secondary hover:border hover:border-zinc-300"
            onClick={e => { e.stopPropagation(); onDelete(item.id); }}
          >
            <Icon icon="mdi:trash-can" width={16} />
            <span className="text-xs">Supprimer</span>
          </button>
          <div className="text-xs opacity-50">{getRelativeTime(item.createdAt)}</div>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="w-[60ch] font-normal text-sm">{item.description}</div>
        <div className="flex items-center justify-between md:hidden">
          {!item.isRead && (
            <button
              className="py-3 rounded-md text-sm flex items-center gap-1 hover:bg-secondary hover:border hover:border-zinc-300"
              onClick={e => { e.stopPropagation(); onMarkAsRead(item.id); }}
            >
              <Icon icon="mdi:check" width={16} />
              <span className="text-xs">Marquer comme lu</span>
            </button>
          )}
          <button
            className="py-3 rounded-md text-sm flex items-center gap-1 hover:bg-secondary hover:border hover:border-zinc-300"
            onClick={e => { e.stopPropagation(); onDelete(item.id); }}
          >
            <Icon icon="mdi:trash-can" width={16} />
            <span className="text-xs">Supprimer</span>
          </button>
          <div>{getRelativeTime(item.createdAt)}</div>
        </div>
        <div className="text-sm pb-1 self-center border-b-2 border-white flex md:hidden">
          {item.blog?.name || item.service?.name || item.status}
        </div>
      </div>
      <div className="text-sm pb-1 border-b-2 border-white hidden md:flex">
        {item.type === "Comments"
          ? item.blog?.name
          : item.type === "Documents"
          ? item.service?.name
          : item.status}
      </div>
    </div>
  );
};

export default NotificationItem;
