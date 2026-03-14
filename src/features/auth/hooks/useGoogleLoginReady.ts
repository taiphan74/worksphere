"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            ux_mode?: "popup" | "redirect";
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, string | number>,
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_GSI_SCRIPT_ID = "google-identity-services";

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleIdentityScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google OAuth chi chay tren client"));
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      GOOGLE_GSI_SCRIPT_ID,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Khong the tai Google Identity Services")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_GSI_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Khong the tai Google Identity Services")),
      { once: true },
    );
    document.head.appendChild(script);
  }).catch((error) => {
    googleScriptPromise = null;
    throw error;
  });

  return googleScriptPromise;
}

type UseGoogleLoginReadyOptions = {
  onCredentialResponse: (response: { credential?: string }) => void;
};

export function useGoogleLoginReady({
  onCredentialResponse,
}: UseGoogleLoginReadyOptions) {
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);
  const credentialResponseRef = useRef(onCredentialResponse);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    credentialResponseRef.current = onCredentialResponse;
  }, [onCredentialResponse]);

  useEffect(() => {
    let cancelled = false;

    async function initializeGoogleLogin() {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      if (!clientId) {
        return;
      }

      await loadGoogleIdentityScript();

      if (cancelled || !buttonContainerRef.current || !window.google?.accounts?.id) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          void credentialResponseRef.current(response);
        },
        ux_mode: "popup",
      });

      buttonContainerRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonContainerRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: 240,
      });

      setIsReady(true);
    }

    void initializeGoogleLogin().catch(() => {
      if (!cancelled) {
        setIsReady(false);
      }
    });

    return () => {
      cancelled = true;
      setIsReady(false);

      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = "";
        buttonContainerRef.current = null;
      }
    };
  }, []);

  return {
    buttonContainerRef,
    isReady,
  };
}
