// components/CommentComponent.tsx
import { EmojiPicker } from "@/components/EmojiPicker";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/hooks/useAuth";
import { getRelativeTime } from "@/lib/utils/relativeTime";
import { Comment } from "@/types/entities/comment";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useState } from "react";

interface CommentComponentProps {
    comment: Comment;
    onDelete: (commentId: number) => void;
    onEdit: (commentId: number, newBody: string) => void;
    onLike: (commentId: number, isLike: boolean) => void;
    onReply: (commentId: number, replyBody?: string) => void;
}

const CommentComponent = ({ comment, onDelete, onEdit, onLike, onReply }: CommentComponentProps) => {
    const { user: AuthUSER } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const {showAlert} = useAlert();
    const [showEmojis, setShowEmojis] = useState(false);
    const [newBody, setNewBody] = useState(comment.body);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyBody, setReplyBody] = useState("");

    const handleEdit = () => {
        onEdit(comment.id, newBody);
        setIsEditing(false);
    };

    const handleReply = () => {
        setSubmitting(true);
        if (replyBody.trim() === "") {
            showAlert("warning", "Avertissement!", "Veuillez remplir le champ d'entrée.");
            setSubmitting(false);
            return;
        }
        console.log("Comment component: ",replyBody);
        
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
            showAlert("warning", "Avertissement!", "Veuillez vous connecter pour liker un commentaire.");
            return;
        }
        
        onLike(commentId, isLike);
        setIsLike(!isLike);
    }

    return (
        <div className={`text-white p-4 rounded-md mb-4 ${comment.userId === AuthUSER?.id ? "bg-[#385F7A]" : "bg-primary"}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                    <button className="bg-secondary w-7 h-7 rounded-full p-2 text-sm btn 
                    font-semibold text-white flex items-center justify-center">
                        {comment.name?.charAt(0)}
                    </button>
                    <span className="font-semibold">
                        {comment.name + " " + comment.surname}
                    </span>
                </div>
                {AuthUSER?.id === comment.userId && (
                    <div className="hidden md:flex gap-2 items-center mr-4 md:mr-0">
                        <button className="px-3 py-1 hover:border rounded-md hover:border-white text-sm flex 
                        items-center gap-1 hover:bg-secondary" 
                        onClick={() => onDelete(comment.id)}>
                            <Icon icon="mdi:trash-can" width={16} />
                            Supprimer
                        </button>
                        <button className="px-3 py-1 hover:border rounded-md hover:border-white text-sm flex 
                        items-center gap-1 hover:bg-secondary" 
                        onClick={() => setIsEditing(!isEditing)}>
                            <Icon icon="mdi:pencil" width={16} />
                            Modify
                        </button>
                    </div>
                )}
            </div>
            {isEditing ? (
                <div>
                    <div className="flex flex-col md:flex-row p-2 border border-gray-400 rounded-md">
                        <div className="w-full flex flex-col p-2 bg-white rounded-md">
                            <textarea
                                value={newBody} onChange={(e) => setNewBody(e.target.value)} 
                                className="focus:outline-none resize-none w-full placeholder:text-sm 
                                text-black p-2 rounded-md"
                                placeholder={`Commenter en tant que ${AuthUSER?.name}`}
                            />
                            <div className="flex items-center justify-between">
                                <div>
                                    <Icon
                                        icon="lucide:smile"
                                        width={24}
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
                <div className="text-sm">{comment.body}</div>
            )}
            <div className="flex flex-col md:flex-row items-center justify-between my-4 text-xs">
                <div className="self-start my-3 md:my-0 flex items-center gap-3">
                    <span className="mr-6">
                        {getRelativeTime(comment.createdAt)}
                    </span>
                    <button onClick={() => handleLikeComment(comment.id)} className="flex items-center gap-1 group">
                        <Icon 
                        className={`group-hover:bg-scondary ${isLike ? (AuthUSER?.id === comment.userId ? "text-primary": "text-secondary") : "text-white" }`} 
                        icon="mdi:thumb-up" width={25} />
                        <span>{comment.likes}</span>
                    </button>
                </div>
                <div className="w-full md:w-fit text-sm flex flex-row-reverse my-2 md:my-0 md:flex-row 
                items-center gap-3">
                    <button onClick={() => onReply(comment.id)}>
                        Voir les réponses ({comment.replies})
                    </button>
                    {AuthUSER && (
                        <button
                            className="mr-auto md:mr-0 py-1 px-2 border rounded-md flex items-center
                            gap-3 text-sm"
                            onClick={() => setShowReplyInput((prev) => !prev)}
                        >
                            Répondre
                            <Icon icon="lucide:message-circle" width={15} />
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
                                        width={24}
                                        onClick={() => setShowEmojis((prev) => !prev)}
                                        className="cursor-pointer text-primary hover:text-white hover:bg-primary p-2 
                                        rounded-full transition"
                                    />
                                    {showEmojis && <EmojiPicker onSelect={(emoji) => setReplyBody((prev) => prev + emoji)} />}
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
                    <button className="w-full px-3 py-1 border rounded-md border-white text-sm flex items-center 
                    justify-center gap-1 bg-[rgba(217,217,217,0.26)] hover:bg-secondary" onClick={() => onDelete(comment.id)}>
                        <Icon icon="mdi:trash-can" width={25} />
                        Supprimer
                    </button>
                    <button className="w-full px-3 py-1 border rounded-md border-white text-sm flex items-center 
                    justify-center gap-1 bg-[rgba(217,217,217,0.26)] hover:bg-secondary" onClick={() => setIsEditing(!isEditing)}>
                        <Icon icon="mdi:pencil" width={25} />
                        Modify
                    </button>
                </div>
            )}
        </div>
    );
};

export default CommentComponent;