import crypto from "crypto";
import emailjs from "@emailjs/nodejs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("🔔 WEBHOOK MASUK");

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      customer_details
    } = req.body;

    console.log("ORDER ID:", order_id);
    console.log("STATUS:", transaction_status);
    console.log("AMOUNT:", gross_amount);

    // ===============================
    // 1️⃣ VALIDASI SIGNATURE MIDTRANS
    // ===============================
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const payload = order_id + status_code + gross_amount + serverKey;

    const expectedSignature = crypto
      .createHash("sha512")
      .update(payload)
      .digest("hex");

    if (signature_key !== expectedSignature) {
      console.log("❌ SIGNATURE TIDAK VALID");
      return res.status(401).json({ message: "Invalid signature" });
    }

    // ===============================
    // 2️⃣ CEK STATUS PEMBAYARAN
    // ===============================
    if (transaction_status !== "settlement") {
      console.log("⏳ BELUM SETTLEMENT");
      return res.status(200).json({ message: "Payment not settled" });
    }

    console.log("✅ PEMBAYARAN SUKSES");

    // ===============================
    // 3️⃣ TENTUKAN PRODUK
    // ===============================
    let productLinks = "";
    let productName = "";

    if (gross_amount === "89000") {
  productName = "Unlock Skill – Produk Utama";
  productLinks =
     "Akses Produk:\nhttps://majestic-glove-b03.notion.site/Akses-Bundle-8-Juta-Produk-Digital-Lisensi-U-PLR-PLR-MRR-23ff5ee2488e80b4a065d81cfd6986a2";
}
}

if (gross_amount === "118000") {
  productName = "Unlock Skill – Produk + Bundling";
  productLinks =
    "Akses Produk Utama:\nhttps://majestic-glove-b03.notion.site/Akses-Bundle-8-Juta-Produk-Digital-Lisensi-U-PLR-PLR-MRR-23ff5ee2488e80b4a065d81cfd6986a2\n\n" +
    "Akses Produk Bundling:\nhttps://cdn.scalev.id/DPF/fZZBlKZIM6hA2eHDM8qzD89R/Reseller%20Power%20Kit%20File%20Download.pdf";
    "Akses Produk Bundling:\nhttps://cdn.scalev.id/uploads/1761556181/tKe4Oa1mGTIeDrMQc4pbmg/FILE-DOWNLOAD-BONUS-TERBARU.pdf";
}
}
    // ===============================
    // 4️⃣ KIRIM EMAIL VIA EMAILJS
    // ===============================
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: customer_details?.email || "customer@email.com",
        order_id: order_id,
        product_name: productName,
        product_links: productLinks
      },
      {
        publicKey: process.env.qgcvNkoqoA0mZZ-g7
      }
    );

    console.log("📧 EMAIL BERHASIL DIKIRIM");

    return res.status(200).json({ message: "Webhook processed" });

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return res.status(500).json({ message: "Webhook error" });
  }
}
