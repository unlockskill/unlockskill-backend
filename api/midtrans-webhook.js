import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const body = req.body;
    console.log("WEBHOOK BODY:", body);

    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;
    const signatureKey = body.signature_key;

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const input = orderId + statusCode + grossAmount + serverKey;

    const expectedSignature = crypto
      .createHash("sha512")
      .update(input)
      .digest("hex");

    if (signatureKey !== expectedSignature) {
      return res.status(403).json({ message: "Invalid signature" });
    }

    if (body.transaction_status === "settlement") {
      console.log("✅ PAYMENT SUCCESS:", orderId);
      // nanti kirim email di sini
    }

    return res.status(200).json({ message: "Webhook received" });

  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return res.status(500).json({ message: "Webhook error" });
  }
}
