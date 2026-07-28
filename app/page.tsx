import LandingPage from "@/components/LandingPage";
import { headers } from "next/headers";
import { auth } from "./lib/auth";
import { getShortExams, getUserExams } from "./actions/action";

export default async function Home() {

  const headersData = await headers();
  const data = await auth.api.getSession({ headers: headersData });
  const user = data?.session?.userId ? data.user : null;

  const exams = await getShortExams();
  let userExams: any[] = user ? await getUserExams(user.id) : [];

  return (
    <main className=" min-h-screen overflow-hidden w-screen">
      <LandingPage user={user} exams={exams} userExams={userExams} />
    </main>
  );
}

