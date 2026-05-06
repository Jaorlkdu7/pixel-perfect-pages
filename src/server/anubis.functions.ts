import { createServerFn } from "@tanstack/react-start";

const ANUBIS_AUTH =
  "Basic cGtfbi12VlpFakhZa2dTWU5OZHNzWUMtbXF6alc4N2VuYk9naEZ0SlJhSU5TT284Zk9COnNrX1RqeVlQMjlSZkhQYkdFdHBMVnpHMjlZa2FSUzZ6UjJTT29ZWEo1dmlNNHRhTVgwag==";

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

export const createAnubisPix = createServerFn({ method: "POST" }).handler(
  async () => {
    const body = {
      amount: 2099,
      paymentMethod: "pix",
      items: [
        {
          title: "Monitoramento",
          unitPrice: 2099,
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

    const res = await fetch("https://api.anubispay.com.br/v1/transactions", {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: ANUBIS_AUTH,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Anubis error", res.status, text);
      throw new Error(`Anubis ${res.status}: ${text.slice(0, 200)}`);
    }

    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Resposta inválida da Anubis");
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

    return { copyAndPaste, qrCodeBase64, raw: data };
  },
);
