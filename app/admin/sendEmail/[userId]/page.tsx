import { getUserData, sendEmail } from "@/app/actions/admin";
import { toast } from "sonner";
import SendEmailClient from "@/components/SendEmailClient";

export default async function SendEmailPage({ params }: { params: Promise<{ userId: string }> }) {

    const { userId } = await params;
    
    if (!userId) {
        toast.error("User ID is missing in the URL.");
        return null;
    }

    const user = await getUserData(userId);
    
    if (user.success === false || !user.data) {
        toast.error("User not found.");
        return null;
    }

    if (!user.data.email || !user.data.name) {
        toast.error("User email or name is missing.");
        return null;
    }


    return (
        <SendEmailClient
            email={user.data.email}
            name={user.data.name}
        />
    );
}