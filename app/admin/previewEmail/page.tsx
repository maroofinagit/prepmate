// 'use server';
import { getEmailTemplate } from "@/app/lib/emailTempelete";

// export const revalidate = 0;

export default async function EmailPreview() {
    const html = await getEmailTemplate({
        name: "Maroof",
        body: `
Bewajah
`,
    });

    return (
        <iframe
            srcDoc={html}
            style={{ width: "100%", height: "100vh", border: "none", padding: "50px 0 0 0", margin: "0" }}
        />
    );
}