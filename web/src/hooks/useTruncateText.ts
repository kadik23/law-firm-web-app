import { useState, useEffect } from 'react';

const useTruncateText = (text: string, maxLength: number) => {
  const [truncatedText, setTruncatedText] = useState('');

  const truncateText = () => {
    if (text.length > maxLength) {
      setTruncatedText(text.slice(0, maxLength) + '...');
    } else {
      setTruncatedText(text);
    }
  };

  // Run the truncate function whenever text or maxLength changes
  useEffect(() => {
    truncateText();
  }, [text, maxLength]); // Dependencies array to trigger the effect

  return truncatedText;
};

export default useTruncateText;
