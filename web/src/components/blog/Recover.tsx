"use client";
import { useAlert } from "@/contexts/AlertContext";
import { useAuth } from "@/hooks/useAuth";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useState, useEffect } from "react";
import Modal from "../Modal";
import { EmojiPicker } from "../EmojiPicker";
import LoadingSpinner from "../LoadingSpinner";

export interface Comment {
    id: number;
    userId?: number;
    name?: string;
    surname?: string;
    blogId: number;
    body: string;
    likes: number;
    isAReply: number;
    replies: number;
    originalCommentId: number | null;
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
}

const commentsData=[
    {
        "id": 1,
        "userId": 3,
        "name": "Belhadj",
        "surname": "Mohamed",
        "blogId": 1,
        "body": "Great insights! I really enjoyed this article.",
        "likes": 5,
        "isAReply": 0,
        "replies": 13,
        "originalCommentId": null,
      "createdAt": "2025-03-01T10:00:00Z",
      "updatedAt": "2025-03-01T10:15:00Z"
    },
    {
      "id": 2,
      "userId": 2,
      "name": "Younes",
      "surname": "Ahmed",
      "blogId": 1,
      "body": "I found the points very relevant to my work. Thanks for sharing!",
      "likes": 3,
      "isAReply": 0,
      "replies": 1,
      "originalCommentId": null,
      "createdAt": "2025-03-02T10:05:00Z",
      "updatedAt": "2025-03-01T10:10:00Z"
    },
    {
      "id": 3,
      "userId": 1,
      "name": "Karim",
      "surname": "Bensalem",
      "blogId": 1,
      "body": "This helped me understand the topic better. Well written!",
      "likes": 7,
      "isAReply": 0,
      "replies": 13,
      "originalCommentId": null,
      "createdAt": "2025-03-01T10:10:00Z",
      "updatedAt": "2025-03-01T10:20:00Z"
    },
    {
      "id": 4,
      "userId": 1,
      "name": "Belhadj",
      "surname": "Mohamed",
      "blogId": 2,
      "body": "I have a question about the second section. Can you clarify?",
      "likes": 2,
      "isAReply": 0,
      "replies": 13,
      "originalCommentId": null,
      "createdAt": "2025-03-01T10:15:00Z",
      "updatedAt": "2025-03-01T10:30:00Z"
    },
    {
      "id": 5,
      "userId": 2,
      "name": "Younes",
      "surname": "Ahmed",
      "blogId": 2,
      "body": "Loved this piece! I’d love to see more content like this.",
      "likes": 6,
      "isAReply": 0,
      "replies": 13,
      "originalCommentId": null,
      "createdAt": "2025-03-01T10:20:00Z",
      "updatedAt": "2025-03-01T10:25:00Z"
    },
    {
      "id": 6,
      "userId": 3,
      "name": "Karim",
      "surname": "Bensalem",
      "blogId": 2,
      "body": "Insightful and well-structured. Thanks for sharing!",
      "likes": 4,
      "isAReply": 0,
      "replies": 13,
      "originalCommentId": null,
      "createdAt": "2025-03-01T10:25:00Z",
      "updatedAt": "2025-03-01T10:35:00Z"
    },
    {
      "id": 7,
      "userId": 2,
      "name": "Younes",
      "surname": "Ahmed",
      "blogId": 1,
      "body": "I totally agree with your points!",
      "likes": 1,
      "isAReply": 1,
      "replies": 13,
      "originalCommentId": 1,
      "createdAt": "2025-03-01T10:30:00Z",
      "updatedAt": "2025-03-01T10:45:00Z"
    },
    {
      "id": 8,
      "userId": 3,
      "name": "Karim",
      "surname": "Bensalem",
      "blogId": 2,
      "body": "I appreciate the effort you put into this.",
      "likes": 2,
      "isAReply": 1,
      "replies": 13,
      "originalCommentId": 5,
      "createdAt": "2025-03-01T10:40:00Z",
      "updatedAt": "2025-03-01T10:50:00Z"
    },
    {
      "id": 9,
      "userId": 1,
      "name": "Belhadj",
      "surname": "Mohamed",
      "blogId": 1,
      "body": "That's an interesting perspective!",
      "likes": 0,
      "isAReply": 1,
      "replies": 13,
      "originalCommentId": 3,
      "createdAt": "2025-03-01T10:50:00Z",
      "updatedAt": "2025-03-01T10:55:00Z"
    },
    {
      "id": 10,
      "userId": 2,
      "name": "Younes",
      "surname": "Ahmed",
      "blogId": 2,
      "body": "Can you elaborate on your last point?",
      "likes": 3,
      "isAReply": 1,
      "replies": 13,
      "originalCommentId": 6,
      "createdAt": "2025-03-01T10:55:00Z",
      "updatedAt": "2025-03-01T11:00:00Z"
    }
]
  
  
const ReaderFeedback = ({blogId}:{blogId:string}) => {

    const {user : AuthUSER} = useAuth();
    const {showAlert} = useAlert();
    const [showComments, setShowComments] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [modelIsOpen, setModelIsOpen] = useState(false);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentReplies, setCommentReplies] = useState<Comment[]>([]);
    const [comment, setComment] = useState("");
    
    useEffect(() => {
        // Filter comments for the given blogId
        const filteredComments: Comment[] = commentsData.filter(comment => comment.blogId === parseInt(blogId));
        setComments(filteredComments);
      }, [blogId]);

    const handleShowComments = () => {
        setShowComments((prev) => !prev);
    };

    const handleAddComment = () => {
        if (comment.trim() === "") {
            showAlert("warning", "Avertissement!", "Veuillez remplir le champ d'entrée.");
            return;
        }
        setSubmittingComment(true);

        const newComment: Comment = {
            id: comments.length + 1,
            userId: AuthUSER?.id,
            name: AuthUSER?.name,
            surname: AuthUSER?.surname,
            blogId: parseInt(blogId),
            body: comment,
            likes: 0,
            isAReply: 0,
            replies: 0,
            originalCommentId: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setComments((prevComments) => [...prevComments, newComment]);
        setComment("");
        setSubmittingComment(false);
    };

    const handleDeleteComment = (commentId:number) => {
        const updatedComments = comments.filter((comment) => comment.id !== commentId);
        setComments(updatedComments);
    };

    const handleLikeComment = (commentId: number) => {
        const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
                return {...comment, likes: comment.likes + 1 };
            }
            return comment;
        });
        setComments(updatedComments);
    };
    
    const handleReplyComment = (commentId: number) => {
        setModelIsOpen(true);
        setCommentReplies(commentsData.filter((comment) => comment.originalCommentId === commentId));
    };


    const handleEditComment = (commentId:number, newBody:string) => {
        const updatedComments = comments.map((comment) => {
            if (comment.id === commentId) {
                return { ...comment, body: newBody };
            }
            return comment;
        });
        setComments(updatedComments);
    };

    const addEmoji = (emoji: string) => {
        setComment((prev) => prev + emoji);
    };

    return (
        <div className="py-4 mb-8">
            <div className="w-full flex items-center justify-between py-4">
                <div className="font-bold text-3xl md:text-4xl text-center text-primary">
                    Avis des lecteurs de ce blog (255)
                </div>
                <button 
                    className="text-primary border-[1px] border-black font-semibold px-4 py-2 rounded-md
                    flex items-center gap-1"
                    onClick={handleShowComments}
                >
                            {/* comment icon */}
                            <Icon
                                icon="mdi:comment"
                                width={20}
                                className="text-secondary outline-black"
                            />
                            <span className="">Commenter</span>
                </button>
            </div>
            {
                
                showComments && (
                    // put the code here to show the first 3 comments and show the delete and modify buttons
                    //  for the authenticated user and also the comments's resonses and likes number
                    // and the time the comment was created 
                    <div>
                        {/* comment Input Section for Authenticated users */}
                        {AuthUSER ? 
                            <div className="mb-4 border rounded-md border-black p-4">
                                <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-1">
                                            <button className="bg-secondary w-10 h-10 rounded-full p-2 
                                            btn font-semibold text-white flex items-center justify-center">
                                                {AuthUSER?.name[0]}
                                            </button>
                                            <span className="font-semibold">
                                                {AuthUSER?.name + " " + AuthUSER?.surname}
                                            </span>
                                        </div>
                                        <Icon
                                            icon="mdi:close"
                                            width={32}
                                            onClick={() => setShowComments(false)}
                                            className="hover:text-textColor cursor-pointer"
                                        />
                                </div>
                                <div className="flex flex-col md:flex-row items-center p-2 border 
                                border-gray-400 rounded-md ">
                                    <div className="flex-1 w-full">
                                        <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="focus:outline-none resize-none w-full 
                                        placeholder:text-sm"
                                        placeholder={`Commenter en tant que ${AuthUSER?.name}`}
                                        />
                                        <div>
                                            <Icon
                                                icon="lucide:smile"
                                                width={24}
                                                onClick={() => setShowEmojis((prev) => !prev)}
                                                className="cursor-pointer hover:text-white hover:bg-primary 
                                                p-2 rounded-full transition"
                                            />
                                            {showEmojis && <EmojiPicker onSelect={addEmoji} />}
                                        </div>
                                    </div>
                                    {/* Envoyer Button */}
                                    <button
                                        onClick={handleAddComment}
                                        className="self-end md:self-center text-white font-semibold 
                                        px-4 py-2 rounded-md bg-primary hover:bg-secondary
                                        hover:text-white hover:border-none text-sm"
                                    >
                                        {submittingComment ? <LoadingSpinner /> : <span>Envoyer</span>}
                                    </button>
                                </div>
                            </div>
                            :
                           <h1 className="text-center font-semibold text-zinc-400 my-6 text-lg">
                                Vous devez vous connecter pour commenter ce blog.
                           </h1> 

                        }

                        {/* Comments Section */}
                        {comments.slice(0, 3).map((Comment) => (
                            <div 
                                key={Comment.id}
                                className={`text-white px-4 pt-4 pb-6 mb-4
                                ${AuthUSER ? "bg-[#385F7A]" : "bg-primary"}`}
                            >
                                <div 
                                    className="flex items-center justify-between mb-4"
                                >
                                    <div className="flex items-center gap-1">
                                        <button 
                                            className="bg-secondary w-7 h-7 rounded-full p-2 text-sm
                                            btn font-semibold text-white flex items-center justify-center"
                                        >
                                            {Comment.name?.charAt(0)}
                                        </button>

                                        <span className="font-semibold">
                                            {/* comment's owner name and surname  */}
                                            {Comment.name + " " + Comment.surname}
                                        </span>
                                    </div>
                                    {(AuthUSER?.id == Comment.userId) && (
                                        <div className="hidden md:flex gap-2 items-center mr-4">
                                        {/* delete button */}
                                        <button className="px-3 py-1 border rounded-md border-white text-sm 
                                        flex items-center gap-1 bg-[rgba(217,217,217,0.26)] hover:bg-secondary"
                                        onClick={() => handleDeleteComment(Comment.id)}>
                                            <Icon icon="mdi:trash-can" width={25} />
                                            Supprimer
                                        </button>
                                        {/* modify button */}
                                        <button className="px-3 py-1 border rounded-md border-white text-sm 
                                        flex items-center gap-1 bg-[rgba(217,217,217,0.26)] hover:bg-secondary"
                                        onClick={() => handleEditComment(Comment.id, Comment.body)}>
                                            <Icon icon="mdi:pencil" width={25} />
                                            Modify
                                        </button>
                                        </div>
                                    )}
                                </div>
                                {/* comment body */}
                                <div className="">
                                I{Comment.body}
                                </div>
                                <div className="flex flex-col md:flex-row items-center justify-between my-4">
                                    <div className="self-start my-3 md:my-0 flex items-center gap-3">
                                        <span className="mr-6">
                                            {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(Comment.createdAt))}
                                        </span>
                                            {/* like button */}
                                        <button 
                                            onClick={() => handleLikeComment(Comment.id)}
                                            className="flex items-center gap-1 group">
                                            <Icon
                                                
                                                className="group-hover:bg-scondary" 
                                                icon="mdi:thumb-up" 
                                                width={25} />
                                            <span>{Comment.likes}</span>
                                        </button>
                                    </div>
                                    <div className="w-full md:w-fit text-sm flex flex-row-reverse my-2 md:my-0 md:flex-row 
                                    items-center gap-3">
                                        {/* comment's responses  */}
                                        <button
                                        className="" 
                                        onClick={() => handleReplyComment(Comment.id)}>
                                            Voir les réponses ({Comment.replies})
                                        </button>
                                        {/* comment's responses */}
                                        {AuthUSER && (
                                            <button
                                                className="mr-auto md:mr-0 py-1 px-2 border rounded-md flex items-center gap-3 
                                                text-sm"    
                                            >
                                                <Icon icon="lucide:message-circle" width={15} />
                                                Répondre
                                            </button>
                                        )}
                                    </div>
                                    {(AuthUSER?.id == Comment.userId) && (
                                        <div className="w-full flex md:hidden gap-2 items-center mt-4">
                                        {/* delete button */}
                                        <button className="w-full px-3 py-1 border rounded-md border-white text-sm 
                                        flex items-center justify-center gap-1 bg-[rgba(217,217,217,0.26)] hover:bg-secondary"
                                        onClick={() => handleDeleteComment(Comment.id)}>
                                            <Icon icon="mdi:trash-can" width={25} />
                                            Supprimer
                                        </button>
                                        {/* modify button */}
                                        <button className="w-full px-3 py-1 border rounded-md border-white text-sm 
                                        flex items-center justify-center gap-1 bg-[rgba(217,217,217,0.26)] hover:bg-secondary"
                                        onClick={() => handleEditComment(Comment.id, Comment.body)}>
                                            <Icon icon="mdi:pencil" width={25} />
                                            Modify
                                        </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {modelIsOpen && (
                        <Modal 
                            isOpen={modelIsOpen} 
                            onClose={() => setModelIsOpen(false)}
                            isNotStepOne={true}
                        >
                            {commentReplies.slice(0, 3).map((Comment) => (
                                <div 
                                    key={Comment.id}
                                    className={`w-full text-white px-4 pt-4 pb-6 my-4
                                    ${AuthUSER ? "bg-[#385F7A]" : "bg-primary"}`}
                                >
                                    <div 
                                        className="flex items-center justify-between mb-4"
                                    >
                                        <div className="flex items-center gap-1">
                                            <button 
                                                className="bg-secondary w-7 h-7 rounded-full p-2 text-sm
                                                btn font-semibold text-white flex items-center justify-center"
                                            >
                                                {Comment.name?.charAt(0)}
                                            </button>

                                            <span className="font-semibold">
                                                {/* comment's owner name and surname  */}
                                                {Comment.name + " " + Comment.surname}
                                            </span>
                                        </div>
                                        {(AuthUSER?.id == Comment.userId) && (
                                            <div className="flex gap-2 items-center mr-4">
                                            {/* delete button */}
                                            <button className="px-3 py-1 border rounded-md border-white text-sm 
                                            flex items-center gap-1 bg-[rgba(217,217,217,0.26)] hover:bg-secondary"
                                            onClick={() => handleDeleteComment(Comment.id)}>
                                                <Icon icon="mdi:trash-can" width={25} />
                                                Supprimer
                                            </button>
                                            {/* modify button */}
                                            <button className="px-3 py-1 border rounded-md border-white text-sm 
                                            flex items-center gap-1 bg-[rgba(217,217,217,0.26)] hover:bg-secondary"
                                            onClick={() => handleEditComment(Comment.id, Comment.body)}>
                                                <Icon icon="mdi:pencil" width={25} />
                                                Modify
                                            </button>
                                            </div>
                                        )}
                                    </div>
                                    {/* comment body */}
                                    <div className="">
                                    I{Comment.body}
                                    </div>
                                    <div className="flex items-center justify-between my-4">
                                        <div className="flex items-center gap-3">
                                            <span>
                                            {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(Comment.createdAt))}
                                            </span>
                                                {/* like button */}
                                            <button 
                                                onClick={() => handleLikeComment(Comment.id)}
                                                className="flex items-center gap-1 group">
                                                <Icon
                                                    
                                                    className="group-hover:bg-scondary" 
                                                    icon="mdi:thumb-up" 
                                                    width={25} />
                                                <span>{Comment.likes}</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {/* comment's responses  */}
                                            <button onClick={() => handleReplyComment(Comment.id)}>
                                                Voir les réponses ({Comment.replies})
                                            </button>
                                            {/* comment's responses */}
                                            {AuthUSER && (
                                                <button
                                                    className="py-1 px-2 border rounded-md flex items-center gap-3 text-sm"    
                                                >
                                                    <Icon icon="lucide:message-circle" width={15} />
                                                    Répondre
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Modal>
                        )}
                    </div>
                )
                
            }
            
            

        </div>
    )
}

export default ReaderFeedback;