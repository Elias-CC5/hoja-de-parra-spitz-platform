"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Culqi: {
      publicKey: string;
      settings: (options: Record<string, unknown>) => void;
      options: (options: Record<string, unknown>) => void;
      open: () => void;
      close: () => void;
      token?: { id: string };
      order?: unknown;
    };
    culqi: () => void;
  }
}

interface UseCulqiCheckoutParams {
  amountInSoles: number;
  onTokenReady: (token: string) => void;
}

/**
 * Carga el script de Culqi.js y expone `openCheckout()` para abrir el modal
 * de pago con tarjeta. Cuando el usuario completa el pago, Culqi invoca
 * window.culqi() con el token en window.Culqi.token, que se propaga a
 * onTokenReady para procesar el cargo en el backend.
 */
export function useCulqiCheckout({ amountInSoles, onTokenReady }: UseCulqiCheckoutParams) {
  const isScriptLoaded = useRef(false);

  useEffect(() => {
    if (isScriptLoaded.current || document.getElementById("culqi-checkout-script")) return;

    const script = document.createElement("script");
    script.id = "culqi-checkout-script";
    script.src = "https://checkout.culqi.com/js/v4";
    script.async = true;
    document.body.appendChild(script);
    isScriptLoaded.current = true;

    window.culqi = () => {
      if (window.Culqi.token) {
        onTokenReady(window.Culqi.token.id);
      }
    };
  }, [onTokenReady]);

  const openCheckout = () => {
    if (!window.Culqi) return;

    window.Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY ?? "";
    window.Culqi.settings({
      title: "Hoja de Parra Spitz",
      currency: "PEN",
      amount: Math.round(amountInSoles * 100),
    });
    window.Culqi.options({
      lang: "auto",
      installments: false,
      paymentMethods: { tarjeta: true, yape: false, bancaMovil: false, agente: false, billetera: false, cuotealo: false },
    });
    window.Culqi.open();
  };

  return { openCheckout };
}
