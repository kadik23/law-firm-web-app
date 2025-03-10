// components/ReaderFeedback.tsx
"use client";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import CommentComponent from "./CommentSection/CommentComponent";
import CommentInput from "./CommentSection/CommentInput";
import CommentModal from "../CommentModal";
import { useReaderFeedback } from "@/hooks/useReaderFeedback";

const ReaderFeedback = ({ blogId }: { blogId: string }) => {
    const {
        showCommentInput,
        modelIsOpen,
        allComments,
        commentReplies,
        handleAddComment,
        handleDeleteComment,
        handleLikeComment,
        handleReplyComment,
        handleEditComment,
        handleCommentInput,
        setModelIsOpen,
    } = useReaderFeedback(blogId);

    return (
        <div className="py-4 mb-8">
            <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-between py-4">
                <div className="font-semibold md:font-bold text-xl order-2 md:order-1 md:text-4xl text-center text-primary">
                    Avis des lecteurs de ce blog ({allComments.length})
                </div>
                <button
                    className="text-primary border-[1px] order-1 md:order-2 border-black font-semibold px-4 py-2 rounded-md flex items-center gap-1"
                    onClick={handleCommentInput}
                >
                    <Icon icon="mdi:comment" width={20} className="text-secondary outline-black" />
                    <span>Commenter</span>
                </button>
            </div>
            {showCommentInput && (
                <CommentInput onSubmit={handleAddComment} onClose={() => handleCommentInput()} />
            )}
            <div>
                {allComments
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
                <div className="flex items-center gap-2 text-sm text-white justify-center rounded-md bg-primary py-2 hover:bg-scondary cursor-pointer">
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