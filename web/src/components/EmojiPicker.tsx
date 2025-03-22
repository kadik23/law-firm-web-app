"use client";
import React from "react";

export const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => {
    const emojis = ["😀", "😂", "😍", "😎", "🤩"];

    return (
        <div className="absolute left-0 bg-white border p-2 rounded-lg shadow-lg flex gap-2 z-50">
            {emojis.map((emoji, index) => (
                <button
                    key={index}
                    onClick={() => {
                        onSelect(emoji); // Call the onSelect function
                    }}
                    className="text-lg hover:bg-gray-200 p-1 rounded-md"
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
};