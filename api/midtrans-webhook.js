import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const notification = req.body;

    // 🔐 Validasi signature Midtrans
    const signatureKey = crypto
      .createHash("sha512")
      .update(
        notification.order_id +
        notification.status_code +
        notification.gross_amount +
        process.env.MIDTRANS_SERVER_KEY
      )
      .digest("hex");

    if (signatureKey !== notification.signature_key) {
      return res.status(403).json({ message: "Invalid signature" });
    }

    const transactionStatus = notification.transaction_status;

    console.log("STATUS:", transactionStatus);
    console.log("ORDER ID:", notification.order_id);

    // ✅ JIKA PEMBAYARAN SUKSES
    if (transactionStatus === "settlement") {

      // NANTI DI SINI:
      // - kirim email
      // - isi link Google Drive sesuai produk

      console.log("✅ PAYMENT SUCCESS");
    }

    return res.status(200).json({ message: "OK" });

  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return res.status(500).json({ message: "Webhook error" });
  }
}
