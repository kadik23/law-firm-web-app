import { useState, useEffect } from "react";
import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/hooks/useAuth";
import { Comment } from "@/types/entities/comment";
import axios from "@/lib/utils/axiosClient";

export const useReaderFeedback = (blogId: string) => {
  const { user: AuthUSER } = useAuth();
  const { showAlert } = useAlert();
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [modelIsOpen, setModelIsOpen] = useState(false);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [commentReplies, setCommentReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [repliesLoading, setRepliesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/user/blogs/commentsByBlog/${blogId}?page=${currentPage + 1}`
      );
      setAllComments((prev) => [...prev, ...response.data.comments]);
      setTotalComments(response.data.totalComments);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (err) {
      setError("Failed to fetch testimonials");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const handleAddComment = (newCommentBody: string) => {
    if (newCommentBody.trim() === "") {
      showAlert(
        "warning",
        "Avertissement!",
        "Veuillez remplir le champ d'entrée."
      );
      return;
    }

    const newComment: Comment = {
      id: allComments.length + 1,
      userId: AuthUSER?.id,
      user: { name: AuthUSER?.name, surname: AuthUSER?.surname },
      blogId: parseInt(blogId),
      body: newCommentBody,
      likes: 0,
      isAReply: 0,
      replies: 0,
      originalCommentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setShowCommentInput(false);
    setAllComments((prevComments) => [newComment, ...prevComments]);
  };

  const handleDeleteComment = (commentId: number) => {
    const deletedComment = allComments.find(
      (comment) => comment.id === commentId
    );
    if (!deletedComment) return;

    if (deletedComment.originalCommentId) {
      const updatedComments = allComments.map((comment) => {
        if (comment.id === deletedComment.originalCommentId) {
          return { ...comment, replies: comment.replies - 1 };
        }
        return comment;
      });
      setModelIsOpen(false);
      setAllComments(
        updatedComments.filter((comment) => comment.id !== commentId)
      );
    } else {
      setAllComments(allComments.filter((comment) => comment.id !== commentId));
    }
  };

  const handleLikeComment = (commentId: number, isLike: boolean) => {
    if (!AuthUSER) {
      showAlert(
        "warning",
        "Avertissement!",
        "Veuillez vous connecter pour liker un commentaire."
      );
      return;
    }
    const updatedComments = allComments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + (isLike ? -1 : 1) };
      }
      return comment;
    });
    setAllComments(updatedComments);
  };

  const handleReplyComment = async (commentId: number, replyBody?: string) => {
    if (replyBody) {
      const newReply: Comment = {
        id: allComments.length + 1,
        userId: AuthUSER?.id,
        user: { name: AuthUSER?.name, surname: AuthUSER?.surname },
        blogId: parseInt(blogId),
        body: replyBody,
        likes: 0,
        isAReply: 1,
        replies: 0,
        originalCommentId: commentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedComments = allComments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, replies: comment.replies + 1 };
        }
        return comment;
      });

      setAllComments([...updatedComments, newReply]);
    } else {
      try {
        setRepliesLoading(true);
        const response = await axios.get(
          `/user/blogs/repliesCommentsByComment/${commentId}`
        );

        setCommentReplies(response.data.replies);
        // setTotalComments(response.data.totalComments);
        // setTotalPages(response.data.totalPages);
        // setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError("Failed to fetch testimonials");
        console.error(err);
      } finally {
        setRepliesLoading(false);
        setModelIsOpen(true);
      }
    }
  };

  const handleEditComment = (commentId: number, newBody: string) => {
    const updatedComments = allComments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, body: newBody };
      }
      return comment;
    });
    setAllComments(updatedComments);
  };

  const handleCommentInput = () => {
    if (!AuthUSER) {
      showAlert(
        "warning",
        "Unauthorized",
        "Vous devez vous connecter pour commenter ce blog."
      );
      return;
    }
    setShowCommentInput(!showCommentInput);
  };

  return {
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
    loading,
    error,
    totalComments,
    totalPages,
    currentPage,
    repliesLoading,
    fetchComments,
  };
};
