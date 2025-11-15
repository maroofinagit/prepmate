"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Router from "next/router";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function ProfileImageUploader({ initialImage }: { initialImage: string }) {
    const [image, setImage] = useState(initialImage);
    const router = useRouter();

    const handleUpload = async (result: any) => {
        console.log(" handle upload");
        console.log(result);


        const url = result.info.secure_url;
        setImage(url);

        try {
            const res = await fetch("/api/profilePicUpdate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: url }),
            });
            if (!res.ok) {
                toast.error(res.error || "Failed to update profile picture.");
            }
            if (res.ok) {
                toast.success("Profile picture updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
            toast.error("Error updating profile picture.");
        }

        // Just refresh the page so server renders updated image
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <Image
                src={image || "/avatar.png"}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full object-cover object-center border aspect-square"
            />

            <CldUploadWidget uploadPreset="prepmate_preset" onSuccess={handleUpload} options={{ maxFiles: 1 }}>
                {({ open }) => (
                    <Button variant="outline" size="sm" onClick={() => open()}>
                        Change Photo
                    </Button>
                )}
            </CldUploadWidget>
        </div>
    );
}
