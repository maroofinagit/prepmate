export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 p-12 mt-20 animate-pulse">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="h-6 w-40 bg-gray-300 rounded-md"></div>
                <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>

            {/* Main Content */}
            <div className="grid md:grid-cols-3 gap-6">

                {/* Left Panel */}
                <div className="md:col-span-2 space-y-6">
                    <div className="h-40 bg-gray-300 rounded-xl"></div>
                    <div className="h-64 bg-gray-300 rounded-xl"></div>
                </div>

                {/* Right Panel */}
                <div className="space-y-6">
                    <div className="h-32 bg-gray-300 rounded-xl"></div>
                    <div className="h-32 bg-gray-300 rounded-xl"></div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 space-y-4">
                <div className="h-6 w-48 bg-gray-300 rounded-md"></div>
                <div className="h-24 bg-gray-300 rounded-xl"></div>
                <div className="h-24 bg-gray-300 rounded-xl"></div>
            </div>
        </div>
    );
}