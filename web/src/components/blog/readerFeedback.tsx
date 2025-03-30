// components/ReaderFeedback.tsx
"use client";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import CommentComponent from "./CommentSection/CommentComponent";
import CommentInput from "./CommentSection/CommentInput";
import CommentModal from "../CommentModal";
import { useReaderFeedback } from "@/hooks/useReaderFeedback";
import { useEffect } from "react";

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
    totalComments,
    totalPages,
    currentPage,
    fetchComments,
    loading,
    repliesLoading,
    commentLoading,
  } = useReaderFeedback(blogId);

  
  useEffect(() => {
    fetchComments();
  }, [blogId]);

  return (
    <div className="py-4 mb-8">
      <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-between py-4">
        <div className="font-semibold md:font-bold text-xl order-2 md:order-1 md:text-4xl text-center text-primary">
          Avis des lecteurs de ce blog ({totalComments})
        </div>
        <button
          className="text-primary border-[1px] order-1 md:order-2 border-black font-semibold px-4 py-2 rounded-md flex items-center gap-1"
          onClick={handleCommentInput}
        >
          <Icon
            icon="mdi:comment"
            width={20}
            className="text-secondary outline-black"
          />
          <span>Commenter</span>
        </button>
      </div>
      {showCommentInput && (
        <CommentInput
          commentLoading={commentLoading}
          onSubmit={handleAddComment}
          onClose={() => handleCommentInput()}
        />
      )}
      <div>
        {loading && <div>Chargement...</div>}
        {allComments.map((comment, index) => (
          <CommentComponent
            key={index}
            comment={comment}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
            onLike={handleLikeComment}
            onReply={handleReplyComment}
          />
        ))}
        {totalComments > 4 && currentPage != totalPages && (
          <div
            onClick={fetchComments}
            className="flex items-center gap-2 text-sm text-white justify-center rounded-md bg-primary py-2 hover:bg-scondary cursor-pointer"
          >
            Voir plus
          </div>
        )}
        {modelIsOpen && (
          <CommentModal
            isOpen={modelIsOpen}
            onClose={() => setModelIsOpen(false)}
            isNotStepOne={true}
          >
            {repliesLoading && <div>Chargement...</div>}
            {commentReplies.map((reply, index) => (
              <div className="mt-6" key={reply.id}>
                <CommentComponent
                  key={index}
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
