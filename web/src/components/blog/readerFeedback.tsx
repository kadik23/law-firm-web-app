// components/ReaderFeedback.tsx
"use client";
import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useState, useEffect } from "react";
import { commentsData } from "@/consts/comments";
import CommentComponent from "./CommentSection/CommentComponent";
import CommentInput from "./CommentSection/CommentInput";
import CommentModal from "../CommentModal";

const ReaderFeedback = ({ blogId }: { blogId: string }) => {
    const { user: AuthUSER } = useAuth();
    const { showAlert } = useAlert();
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [modelIsOpen, setModelIsOpen] = useState(false);
    const [allcomments, setAllComments] = useState<Comment[]>([]);
    const [commentReplies, setCommentReplies] = useState<Comment[]>([]);

    useEffect(() => {
        const filteredComments: Comment[] = commentsData.filter(comment => comment.blogId === parseInt(blogId));
        setAllComments(filteredComments);
    }, [blogId]);

    const handleAddComment = (newCommentBody: string) => {
        if (newCommentBody.trim() === "") {
            showAlert("warning", "Avertissement!", "Veuillez remplir le champ d'entrée.");
            return;
        }
    
        const newComment: Comment = {
            id: allcomments.length + 1,
            userId: AuthUSER?.id,
            name: AuthUSER?.name,
            surname: AuthUSER?.surname,
            blogId: parseInt(blogId),
            body: newCommentBody,
            likes: 0,
            isAReply: 0,
            replies: 0, // Initialize replies count to 0
            originalCommentId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setShowCommentInput(false);
        setAllComments((prevComments) => [newComment, ...prevComments]);
    };

    const handleDeleteComment = (commentId: number) => {
        const deletedComment = allcomments.find((comment) => comment.id === commentId);
        if (!deletedComment) return;
    
        // If the deleted comment is a reply, decrement the parent's replies count
        if (deletedComment.originalCommentId) {
            const updatedComments = allcomments.map((comment) => {
                if (comment.id === deletedComment.originalCommentId) {
                    return { ...comment, replies: comment.replies - 1 };
                }
                return comment;
            });
            setModelIsOpen(false);
            setAllComments(updatedComments.filter((comment) => comment.id !== commentId));
        } else {
            // If it's a parent comment, just remove it
            setAllComments(allcomments.filter((comment) => comment.id !== commentId));
        }
    };

    const handleLikeComment = (commentId: number, isLike: boolean) => {
        if (!AuthUSER) {
            showAlert("warning", "Avertissement!", "Veuillez vous connecter pour liker un commentaire.");
            return;
        }
        if(isLike){
            const updatedComments = allcomments.map((comment) => {
                if (comment.id === commentId) {
                    return { ...comment, likes: comment.likes - 1 };
                }
                return comment;
            });
            setAllComments(updatedComments);
        } else {
            const updatedComments = allcomments.map((comment) => {
                if (comment.id === commentId) {
                    return { ...comment, likes: comment.likes + 1 };
                }
                return comment;
            });
            setAllComments(updatedComments);
        };
    }

    const handleReplyComment = (commentId: number, replyBody?: string) => {
        if (replyBody) {
            const newReply: Comment = {
                id: allcomments.length + 1, // Ensure unique ID
                userId: AuthUSER?.id,
                name: AuthUSER?.name,
                surname: AuthUSER?.surname,
                blogId: parseInt(blogId),
                body: replyBody,
                likes: 0,
                isAReply: 1, // Mark as a reply
                replies: 0, // Replies to replies are not supported in this example
                originalCommentId: commentId, // Link to the parent comment
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
    
            // Update the parent comment's replies count
            const updatedComments = allcomments.map((comment) => {
                if (comment.id === commentId) {
                    return { ...comment, replies: comment.replies + 1 };
                }
                return comment;
            });
    
            // Add the new reply to the comments list
            setAllComments([...updatedComments, newReply]);
        } else {
            // Show replies in the modal
            setCommentReplies(allcomments.filter((comment) => comment.originalCommentId === commentId));
            setModelIsOpen(true);
        }
    };
    
    

    const handleEditComment = (commentId: number, newBody: string) => {
        const updatedComments = allcomments.map((comment) => {
            if (comment.id === commentId) {
                return { ...comment, body: newBody };
            }
            return comment;
        });
        setAllComments(updatedComments);
    };

    return (
        <div className="py-4 mb-8">
            <div className="w-full flex items-center justify-between py-4">
                <div className="font-bold text-3xl md:text-4xl text-center text-primary">
                    Avis des lecteurs de ce blog ({allcomments.length})
                </div>
                <button
                    className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md flex items-center gap-1"
                    onClick={() => setShowCommentInput((prev) => !prev)}
                >
                    <Icon icon="mdi:comment" width={20} className="text-secondary outline-black" />
                    <span>Commenter</span>
                </button>
            </div>
            {AuthUSER ? (
                showCommentInput && (
                    <CommentInput onSubmit={handleAddComment} onClose={() => setShowCommentInput(false)} />
                )
            ) : (
                <h1 className="text-center font-semibold text-zinc-400 my-6 text-lg">
                    Vous devez vous connecter pour commenter ce blog.
                </h1>
            )}
            <div>
                {allcomments
                .slice(0, 3)
                .map((comment) => (
                    <CommentComponent
                        key={comment.id}
                        comment={comment}
                        onDelete={handleDeleteComment}
                        onEdit={handleEditComment}
                        onLike={handleLikeComment}
                        onReply={handleReplyComment}
                    />
                ))}
                {/* Voir plus */}
                <div className="flex items-center gap-2 text-sm text-white justify-center rounded-md
                bg-primary py-2 hover:bg-scondary cursor-pointer">
                    Voir plus
                </div>
                {modelIsOpen && (
                    <CommentModal isOpen={modelIsOpen} onClose={() => setModelIsOpen(false)} isNotStepOne={true}>
                        {commentReplies.map((reply) => (
                            <div className="mt-6" key={reply.id}>
                                <CommentComponent
                                    comment={reply}
                                    onDelete={handleDeleteComment}
                                    onEdit={handleEditComment}
                                    onLike={handleLikeComment}
                                    onReply={handleReplyComment}
                                />
                            </div>
                        ))}
                    </CommentModal>
                )}
            </div>
            
            
        </div>
    );
};

export default ReaderFeedback;