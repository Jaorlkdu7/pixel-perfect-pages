import { createFileRoute } from "@tanstack/react-router";

const ANUBIS_AUTH =
  "Basic cGtfbi12VlpFakhZa2dTWU5OZHNzWUMtbXF6alc4N2VuYk9naEZ0SlJhSU5TT284Zk9COnNrX1RqeVlQMjlSZkhQYkdFdHBMVnpHMjlZa2FSUzZ6UjJTT29ZWEo1dmlNNHRhTVgwag==";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function pickDeep(obj: any, keys: string[]): string {
  if (!obj || typeof obj !== "object") return "";
  for (const k of keys) {
    if (typeof obj[k] === "string" && obj[k]) return obj[k];
  }
  for (const v of Object.values(obj)) {
    if (v && typeof v === "object") {
      const r = pickDeep(v, keys);
      if (r) return r;
    }
  }
  return "";
}

export const Route = createFileRoute("/api/anubis-pix")({
  // @ts-expect-error - server handlers via TanStack Start augmentation
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, { status: 204, headers: CORS }),
      POST: async () => {
        try {
          const body = {
            amount: 2090,
            paymentMethod: "pix",
            items: [
              {
                title: "Monitoramento",
                unitPrice: 2090,
                quantity: 1,
                tangible: false,
              },
            ],
            customer: {
              name: "cliente",
              email: "monitoramentoseuparceiro_pgto@gmail.com",
              phone: "19999999999",
              document: { number: "06209832644", type: "cpf" },
            },
          };

          const res = await fetch(
            "https://api.anubispay.com.br/v1/transactions",
            {
              method: "POST",
              headers: {
                accept: "application/json",
                authorization: ANUBIS_AUTH,
                "content-type": "application/json",
              },
              body: JSON.stringify(body),
            },
          );

          const text = await res.text();
          if (!res.ok) {
            console.error("Anubis error", res.status, text);
            return new Response(
              JSON.stringify({
                error: `Anubis ${res.status}`,
                detail: text.slice(0, 500),
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json", ...CORS },
              },
            );
          }

          let data: any = {};
          try {
            data = JSON.parse(text);
          } catch {
            return new Response(
              JSON.stringify({ error: "Resposta inválida da Anubis" }),
              {
                status: 200,
                headers: { "Content-Type": "application/json", ...CORS },
              },
            );
          }

          const copyAndPaste = pickDeep(data, [
            "qr_code_payload",
            "pixCopiaECola",
            "qrcode",
            "qrCode",
            "emv",
            "payload",
          ]);
          const qrCodeBase64 = pickDeep(data, [
            "qr_code_base64",
            "qrCodeBase64",
            "qrcodeBase64",
          ]);

          return new Response(
            JSON.stringify({ copyAndPaste, qrCodeBase64 }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...CORS },
            },
          );
        } catch (e: any) {
          console.error("anubis-pix handler error", e);
          return new Response(
            JSON.stringify({ error: "SERVICE_FAILED", detail: String(e) }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...CORS },
            },
          );
        }
      },
    },
  },
});
