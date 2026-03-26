export function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-20 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-16"></div>
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-28 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
            <div className="h-56 bg-gray-100 rounded-xl"></div>
        </div>
    );
}

export function SkeletonWide() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-36 mb-4"></div>
            <div className="h-64 bg-gray-100 rounded-xl"></div>
        </div>
    );
}
