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
  const [commentLoading, setCommentLoading] = useState(false);
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

  const handleAddComment = async (newCommentBody: string) => {
    if (newCommentBody.trim() === "") {
      showAlert(
        "warning",
        "Avertissement!",
        "Veuillez remplir le champ d'entrée."
      );
      return;
    }
    try {
      setCommentLoading(true);
      const response = await axios.post(`/user/blogs/addcomment`, {
        body: newCommentBody,
        blogId: blogId,
      });
      setAllComments((prevComments) => [
        ...prevComments,
        { ...response.data, replies: 0 },
      ]);
      setTotalComments(totalComments + 1);
      showAlert(
        "success",
        "Commenter réussie",
        `Commenter réussie ${response.data.id}`
      );
    } catch (err) {
      setError("Failed to add comment");
      showAlert("error", "vous n'avez pas commenté", err as string);
      console.error(err);
    } finally {
      setCommentLoading(false);
    }

    setShowCommentInput(false);
  };

  const handleDeleteComment = async (commentId: number) => {
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
      try {
        setCommentLoading(true);
        const response = await axios.delete(
          `/user/blogs/deletecomment/${commentId}`
        );

        setAllComments(
          allComments.filter((comment) => comment.id !== commentId)
        );
        setTotalComments(totalComments - 1);
        showAlert(
          "success",
          "Commente supprimé avec succès",
          response.data.message
        );
      } catch (err) {
        setError("Failed to delete comment");
        showAlert("error", "vous n'avez pas commenté", err as string);
        console.error(err);
      } finally {
        setCommentLoading(false);
      }
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
      } catch (err) {
        setError("Failed to fetch testimonials");
        console.error(err);
      } finally {
        setRepliesLoading(false);
        setModelIsOpen(true);
      }
    }
  };

  const handleEditComment = async (commentId: number, newBody: string) => {
    try {
      setCommentLoading(true);
      const response = await axios.put(
        `/user/blogs/updatecomment/${commentId}`,
        {
          id: commentId,
          body: newBody,
        }
      );
      const updatedComments = allComments.map((comment) => {
        if (comment.id === commentId) {
          return { ...comment, body: newBody };
        }
        return comment;
      });
      setAllComments(updatedComments);
      showAlert(
        "success",
        "Commentaire mis à jour avec succès",
        response.data.message
      );
    } catch (err) {
      setError("Failed to delete comment");
      showAlert("error", "Vous n'avez pas mise a jour", err as string);
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
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
    commentLoading,
  };
};
