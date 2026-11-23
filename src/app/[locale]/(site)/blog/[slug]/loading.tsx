export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
      
      {/* Sidebar Skeleton (Table of Contents) */}
      <div className="hidden lg:block fixed top-32 w-72 left-8 h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>

      <div className="max-w-4xl mx-auto lg:ml-80">
        {/* Go Back Skeleton */}
        <div className="w-24 h-6 bg-gray-200 dark:bg-gray-800 rounded-full mb-8"></div>

        {/* Title Skeleton */}
        <div className="w-3/4 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
        <div className="w-1/2 h-12 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8"></div>

        {/* Meta Box Skeleton */}
        <div className="bg-white/70 dark:bg-[#111] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 mb-12 h-40 flex flex-col justify-between">
          <div className="flex justify-between items-center">
             <div className="flex gap-4">
                 <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                 <div className="w-24 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
             </div>
             <div className="w-20 h-8 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
          <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-2"></div>
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
             <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
             <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800"></div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            
            {/* Image Block Skeleton */}
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl my-8"></div>

            <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
            
             {/* Code Block Skeleton */}
             <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-xl my-8"></div>
        </div>
      </div>
    </div>
  );
}