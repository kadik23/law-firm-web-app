export default function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  