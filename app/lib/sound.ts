// lib/sound.ts

let notification: HTMLAudioElement | null = null;
let errorSound: HTMLAudioElement | null = null;

function initializeSounds() {
    if (typeof window === "undefined") return;

    if (!notification) {
        notification = new Audio("/notification.wav");
        notification.preload = "auto";
        notification.volume = 0.35;
    }

    if (!errorSound) {
        errorSound = new Audio("/error.mp3");
        errorSound.preload = "auto";
        errorSound.volume = 0.35;
    }
}

export function playNotification() {
    if (typeof window === "undefined") return;

    initializeSounds();

    if (!notification) return;

    notification.currentTime = 0;

    notification.play().catch(() => {
        console.log("Notification sound playback failed.");
    });
}

export function playError() {
    if (typeof window === "undefined") return;

    initializeSounds();

    if (!errorSound) return;

    errorSound.currentTime = 0;

    errorSound.play().catch(() => {
        console.log("Error sound playback failed.");
    });
}