import { getUserDetails } from "@/app/actions/admin";
import UserDetailAdmin from "@/components/UserDetailAdmin";

export default async function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;            
}) {
    
    const { id } = await params;

    const user = await getUserDetails(id);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-semibold text-gray-700">User not found</h1>
            </div>
        );
    }
    return <UserDetailAdmin user={user} />;
}