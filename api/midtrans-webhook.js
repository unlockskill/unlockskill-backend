import { send } from "@emailjs/nodejs";
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      transaction_status,
      gross_amount,
      order_id,
      customer_details,
    } = req.body;

    console.log("🔔 WEBHOOK MASUK");
    console.log("ORDER ID:", order_id);
    console.log("STATUS:", transaction_status);
    console.log("AMOUNT:", gross_amount);

    // hanya proses pembayaran sukses
    if (transaction_status !== "settlement") {
      return res.status(200).json({ message: "Not settlement" });
    }

    // ===============================
    // 1️⃣ TENTUKAN PRODUK & LINK
    // ===============================
    let productName = "";
    let productLinks = "";

    // 🔹 PRODUK 89.000
    if (gross_amount === "89000") {
      productName = "Unlock Skill – Produk Utama";
      productLinks = `
<a href="https://majestic-glove-b03.notion.site/Akses-Bundle-8-Juta-Produk-Digital-Lisensi-U-PLR-PLR-MRR-23ff5ee2488e80b4a065d81cfd6986a2"
   style="display:inline-block;padding:14px 28px;
   background:#22c55e;color:#000;text-decoration:none;
   border-radius:8px;font-weight:bold;">
⬇️ Unduh Produk Utama
</a>`;
    }

    // 🔹 PRODUK BUNDLING 118.000
    if (gross_amount === "118000") {
      productName = "Unlock Skill – Produk + Bundling";
      productLinks = `
<a href="https://majestic-glove-b03.notion.site/Akses-Bundle-8-Juta-Produk-Digital-Lisensi-U-PLR-PLR-MRR-23ff5ee2488e80b4a065d81cfd6986a2"
   style="display:inline-block;margin-bottom:12px;
   padding:14px 28px;background:#22c55e;
   color:#000;text-decoration:none;border-radius:8px;
   font-weight:bold;">
⬇️ Unduh Produk Utama
</a>
<br/><br/>

<a href="https://cdn.scalev.id/uploads/1761556181/tKe4Oa1mGTIeDrMQc4pbmg/FILE-DOWNLOAD-BONUS-TERBARU.pdf"
   style="display:inline-block;margin-bottom:12px;
   padding:14px 28px;background:#38bdf8;
   color:#000;text-decoration:none;border-radius:8px;
   font-weight:bold;">
🎁 Unduh Bonus 1
</a>
<br/><br/>

<a href="https://cdn.scalev.id/DPF/fZZBlKZIM6hA2eHDM8qzD89R/Reseller%20Power%20Kit%20File%20Download.pdf"
   style="display:inline-block;
   padding:14px 28px;background:#facc15;
   color:#000;text-decoration:none;border-radius:8px;
   font-weight:bold;">
🚀 Unduh Bonus 2
</a>`;
    }

    // ===============================
    // 2️⃣ KIRIM EMAIL VIA EMAILJS
    // ===============================
    await send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: customer_details.email,
        to_name: customer_details.first_name || "Customer",
        product_name: productName,
        product_links: productLinks,
      },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
      }
    );

    console.log("✅ EMAIL TERKIRIM");

    return res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("❌ ERROR WEBHOOK:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
