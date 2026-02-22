export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full gap-4">
      
      {/* The Spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
        
        {/* Spinning Segment */}
        <div className="absolute w-12 h-12 rounded-full border-4 border-transparent border-t-black dark:border-t-white animate-spin"></div>
      </div>

      {/* Optional Text */}
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
        Loading...
      </p>

    </div>
  );
}