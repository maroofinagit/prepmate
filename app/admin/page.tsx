import { getAdminDashboardData } from "../actions/admin";
import AdminClient from "@/components/AdminClient";

export default async function AdminPage() {

    const data = await getAdminDashboardData();

    return <AdminClient data={data} />;
}