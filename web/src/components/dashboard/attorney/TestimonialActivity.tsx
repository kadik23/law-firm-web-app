import React from "react";
import Image from "next/image";

interface TestimonialActivityProps {
  title: string;
  items: Array<{
    id: number;
    content: string;
    rating: number;
    createdAt: string;
  }>;
}

const TestimonialActivity: React.FC<TestimonialActivityProps> = ({ title, items }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-3 mb-4">
        <Image
          src="/icons/dashboard/attorney/testimonial.svg"
          alt={title}
          width={24}
          height={24}
        />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun témoignage récent</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 line-clamp-2">
                    {item.content}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {renderStars(item.rating)}
                  <span className="text-xs text-gray-500">
                    {item.rating}/5
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {formatDate(item.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TestimonialActivity; 