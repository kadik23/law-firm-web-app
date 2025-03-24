// components/CommentComponent.tsx
import { EmojiPicker } from "@/components/EmojiPicker";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/hooks/useAuth";
import { useReaderFeedback } from "@/hooks/useReaderFeedback";
import { getRelativeTime } from "@/lib/utils/relativeTime";
import { Comment } from "@/types/entities/comment";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useEffect, useState } from "react";

interface CommentComponentProps {
  comment: Comment;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number, newBody: string) => void;
  onLike: (commentId: number, isLike: boolean) => void;
  onReply: (commentId: number, replyBody?: string) => void;
}

const CommentComponent = ({
  comment,
  onDelete,
  onEdit,
  onLike,
  onReply,
}: CommentComponentProps) => {
  const { user: AuthUSER } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showAlert } = useAlert();
  const [showEmojis, setShowEmojis] = useState(false);
  const [newBody, setNewBody] = useState(comment.body);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const { isLike, setIsLike, checkIsLiked } = useReaderFeedback(comment.id.toString());
  const handleEdit = () => {
    onEdit(comment.id, newBody);
    setIsEditing(false);
  };

  useEffect(() => {
    checkIsLiked(comment.id);
  }, [])
  

  const handleReply = () => {
    setSubmitting(true);
    if (replyBody.trim() === "") {
      showAlert(
        "warning",
        "Avertissement!",
        "Veuillez remplir le champ d'entrée."
      );
      setSubmitting(false);
      return;
    }
    console.log("Comment component: ", replyBody);

    onReply(comment.id, replyBody);
    setShowReplyInput(false);
    setReplyBody("");
    setSubmitting(false);
  };

  const addEmoji = (emoji: string) => {
    setShowEmojis(false);
    setNewBody((prev) => prev + emoji);
  };

  const handleLikeComment = (commentId: number) => {
    if (!AuthUSER) {
      showAlert(
        "warning",
        "Avertissement!",
        "Veuillez vous connecter pour liker un commentaire."
      );
      return;
    }

    onLike(commentId, isLike);
    setIsLike(!isLike);
  };

  return (
    <div
      className={`text-white px-4 py-6 mb-4 rounded-lg ${
        comment.userId === AuthUSER?.id ? "bg-[#385F7A]" : "bg-primary"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <button
            className="bg-secondary w-7 h-7 rounded-full p-2 text-sm btn 
                    font-semibold text-white flex items-center justify-center"
          >
            {comment.user.name?.charAt(0)}
          </button>
          <span className="font-semibold">
            {comment.user.name + " " + comment.user.surname}
          </span>
        </div>
        {AuthUSER?.id === comment.userId && (
          <div className="hidden md:flex gap-2 items-center mr-4 md:mr-0">
            <button
              className="px-3 py-1 rounded-md text-sm flex 
                        items-center gap-1 hover:bg-secondary"
              onClick={() => onDelete(comment.id)}
            >
              <Icon icon="mdi:trash-can" width={20} />
              Supprimer
            </button>
            <button
              className="px-3 py-1 rounded-md text-sm flex 
                        items-center gap-1 hover:bg-secondary"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Icon icon="mdi:pencil" width={20} />
              Modifier
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div>
          <div className="flex flex-col md:flex-row p-2 border border-gray-400 rounded-md">
            <div className="w-full flex flex-col p-2 bg-white rounded-md">
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="focus:outline-none resize-none w-full placeholder:text-sm 
                                text-black p-2 rounded-md"
                placeholder={`Commenter en tant que ${AuthUSER?.name}`}
              />
              <div className="flex items-center justify-between">
                <div>
                  <Icon
                    icon="lucide:smile"
                    width={18}
                    onClick={() => setShowEmojis((prev) => !prev)}
                    className="cursor-pointer text-primary hover:text-white 
                                        hover:bg-primary p-2 rounded-full transition"
                  />
                  {showEmojis && <EmojiPicker onSelect={addEmoji} />}
                </div>
                <button
                  onClick={handleEdit}
                  className="self-end  text-white font-semibold 
                                    px-4 py-2 rounded-md bg-primary hover:bg-secondary hover:text-white 
                                    hover:border-none text-sm"
                >
                  {submitting ? <LoadingSpinner /> : <span>Save</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>{comment.body}</div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between my-4">
        <div className="self-start my-3 md:my-0 flex items-center gap-3">
          <span className="mr-6 text-xs">
            {getRelativeTime(comment.createdAt)}
          </span>
          <button
            onClick={() => handleLikeComment(comment.id)}
            className="flex items-center gap-1 group"
          >
            <Icon
              className={`group-hover:bg-scondary ${
                isLike
                  ? AuthUSER?.id === comment.userId
                    ? "text-primary"
                    : "text-secondary"
                  : "text-white"
              }`}
              icon="mdi:thumb-up"
              width={20}
            />
            <span>{comment.likesCount}</span>
          </button>
        </div>
        <div
          className="w-full md:w-fit text-sm flex flex-row-reverse my-2 md:my-0 md:flex-row 
                items-center gap-3"
        >
          {comment.replies > 0 && (
            <button onClick={() => onReply(comment.id)}>
              Voir les réponses ({comment.replies})
            </button>
          )}
          {AuthUSER && (
            <button
              className={`${
                comment.replies > 0 ? "" : "self-end"
              } mr-auto md:mr-0 py-1 px-2 border rounded-md flex items-center
                            gap-3 text-sm`}
              onClick={() => setShowReplyInput((prev) => !prev)}
            >
              <Icon icon="lucide:message-circle" width={15} />
              Répondre
            </button>
          )}
        </div>
      </div>
      {/* Reply Input Section */}
      {showReplyInput && AuthUSER && (
        <div className="mt-4">
          <div className="flex flex-col md:flex-row p-2 border border-gray-400 rounded-md">
            <div className="w-full flex flex-col p-2 bg-white rounded-md">
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                className="focus:outline-none resize-none w-full placeholder:text-sm 
                                text-black p-2 rounded-md"
                placeholder={`Répondre en tant que ${AuthUSER?.name}`}
              />
              <div className="flex items-center justify-between">
                <div>
                  <Icon
                    icon="lucide:smile"
                    width={18}
                    onClick={() => setShowEmojis((prev) => !prev)}
                    className="cursor-pointer text-primary hover:text-white hover:bg-primary p-2 
                                        rounded-full transition"
                  />
                  {showEmojis && (
                    <EmojiPicker
                      onSelect={(emoji) => setReplyBody((prev) => prev + emoji)}
                    />
                  )}
                </div>
                <button
                  onClick={handleReply}
                  className="self-end  text-white font-semibold 
                                    px-4 py-2 rounded-md bg-primary hover:bg-secondary hover:text-white 
                                    hover:border-none text-sm"
                >
                  {submitting ? <LoadingSpinner /> : <span>Envoyer</span>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {AuthUSER?.id === comment.userId && (
        <div className="w-full flex md:hidden gap-2 items-center mr-4">
          <button
            className="w-full px-3 py-1 rounded-md text-sm flex items-center 
                    justify-center gap-1 hover:bg-secondary"
            onClick={() => onDelete(comment.id)}
          >
            <Icon icon="mdi:trash-can" width={20} />
            Supprimer
          </button>
          <button
            className="w-full px-3 py-1 rounded-md text-sm flex items-center 
                    justify-center gap-1 hover:bg-secondary"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Icon icon="mdi:pencil" width={20} />
            Modify
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentComponent;
