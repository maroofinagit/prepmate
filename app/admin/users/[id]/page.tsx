import { getUserDetails } from "@/app/actions/admin";
import UserDetailAdmin from "@/components/UserDetailAdmin";

export default async function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;            
}) {
    
    const { id } = await params;

    let user;

    try {
        user = await getUserDetails(id);        
    } catch (err) {
        console.error("❌ Error fetching user details:", err);
        return <div className="p-6 bg-gray-50 min-h-screen">Error loading user details.</div>;
    }

    return <UserDetailAdmin user={user} />;
}