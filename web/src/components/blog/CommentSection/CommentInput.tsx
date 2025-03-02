// components/CommentInput.tsx
import { useState } from "react";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/LoadingSpinner";
import { EmojiPicker } from "@/components/EmojiPicker";

interface CommentInputProps {
    onSubmit: (comment: string) => void;
    onClose: () => void;
}

const CommentInput = ({ onSubmit, onClose }: CommentInputProps) => {
    const { user: AuthUSER } = useAuth();
    const [comment, setComment] = useState("");
    const [showEmojis, setShowEmojis] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = () => {
        if (comment.trim() === "") {
            return; // Prevent submission if the comment is empty
        }
        setSubmitting(true);
        console.log("CommentInput: ", comment);
        onSubmit(comment); // Pass the comment to the parent component
        setComment(""); // Reset the comment state after submission
        setSubmitting(false);
    };

    const addEmoji = (emoji: string) => {
        setShowEmojis(false);
        setComment((prev) => prev + emoji);
    };

    return (
        <div className="mb-4 border rounded-md border-black p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                    <button className="bg-secondary w-10 h-10 rounded-full p-2 btn font-semibold text-white flex items-center justify-center">
                        {AuthUSER?.name[0]}
                    </button>
                    <span className="font-semibold">
                        {AuthUSER?.name + " " + AuthUSER?.surname}
                    </span>
                </div>
                <Icon
                    icon="mdi:close"
                    width={32}  
                    onClick={onClose}
                    className="hover:text-textColor cursor-pointer"
                />
            </div>
            <div className="flex flex-col md:flex-row items-center p-2 border border-gray-400 rounded-md">
                <div className="flex-1 w-full">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="focus:outline-none resize-none w-full placeholder:text-sm"
                        placeholder={`Commenter en tant que ${AuthUSER?.name}`}
                    />
                    <div className="relative">
                        <Icon
                            icon="lucide:smile"
                            width={24}
                            onClick={() => setShowEmojis(!showEmojis)}
                            className="cursor-pointer hover:text-white hover:bg-primary p-2 rounded-full transition"
                        />
                        {showEmojis && (
                            <div className="">
                                <EmojiPicker onSelect={addEmoji} />
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    className="self-end md:self-center text-white font-semibold px-4 py-2 rounded-md bg-primary hover:bg-secondary hover:text-white hover:border-none text-sm"
                >
                    {submitting ? <LoadingSpinner /> : <span>Envoyer</span>}
                </button>
            </div>
        </div>
    );
};

export default CommentInput;