"use client";

import { useEffect } from "react";

export function Chatbot() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://console.shopinzen.com/freemium/chatbot-integrator.js?v=${new Date().getTime()}`;
    script.defer = true;
    script.setAttribute(
      "data-shopinzen-bot",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJla0c4ZUpHWEhyIiwiaWF0IjoxNzc2MTcyMjgxfQ.I6U0yt53olu1rpEMAXggMT31hWY-9OTFu4kPMYvsrgI"
    );
    script.setAttribute("data-bubblecolor", "#1261b5");
    script.setAttribute("data-typescreen", "MOBILE");
    script.setAttribute(
      "data-pkey",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJla0c4ZUpHWEhyIiwiaWF0IjoxNzc2MTcyMjgxfQ.I6U0yt53olu1rpEMAXggMT31hWY-9OTFu4kPMYvsrgI"
    );
    script.setAttribute("data-customicon", "false");
    script.setAttribute(
      "data-botavatarurl",
      "https://storage.googleapis.com/shopinzen_freemium_images/bots/691f44682755d6f0afbf3882/avatars/379abeec-717a-4d6b-bb22-85f9d66b5bb5.png"
    );

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
