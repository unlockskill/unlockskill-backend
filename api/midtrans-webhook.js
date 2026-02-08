export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { transaction_status, gross_amount, order_id, customer_details } =
      req.body;

    console.log("🔔 WEBHOOK MASUK");
    console.log("ORDER ID:", order_id);
    console.log("STATUS:", transaction_status);
    console.log("AMOUNT:", gross_amount);

    if (transaction_status !== "settlement") {
      return res.status(200).json({ message: "Not settlement" });
    }

    let productName = "";
    let productLinks = "";

    if (gross_amount === "89000" || gross_amount === "89000.00") {
      productName = "Unlock Skill – Produk Utama";
      productLinks = `
<a href="https://majestic-glove-b03.notion.site/Akses-Bundle-8-Juta-Produk-Digital-Lisensi-U-PLR-PLR-MRR-23ff5ee2488e80b4a065d81cfd698" target="_blank">⬇️ Unduh Produk Utama</a>`;
    }

    if (gross_amount === "118000" || gross_amount === "118000.00") {
      productName = "Unlock Skill – Produk + Bundling";
      productLinks = `
<a href="https://majestic-glove-b03.notion.site/Akses-Bundle-8-Juta-Produk-Digital-Lisensi-U-PLR-PLR-MRR-23ff5ee2488e80b4a065d81cfd698" target="_blank">⬇️ Unduh Produk Utama</a><br><br>
<a href="https://cdn.scalev.id/uploads/1761556181/tKe4Oa1mGTIeDrMQc4pbmg/FILE-DOWNLOAD-BONUS-TERBARU.pdf" target="_blank">🎁 Bonus 1</a><br><br>
<a href="https://cdn.scalev.id/DPF/fZZBlKZIM6hA2eHDM8qzD89R/Reseller%20Power%20Kit%20File%20Download.pdf" target="_blank">🚀 Reseller power kit</a>`;
    }

    // 🔥 KIRIM EMAIL VIA EMAILJS REST API
    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: process.env.EMAILJS_SERVICE_ID,
          template_id: process.env.EMAILJS_TEMPLATE_ID,
          user_id: process.env.EMAILJS_PUBLIC_KEY, // ❗ PAKE PUBLIC KEY
          template_params: {
            to_email: customer_details.email,
            to_name: customer_details.first_name || "Customer",
            product_name: productName,
            product_links: productLinks,
          },
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error("EmailJS gagal: " + text);
    }

    console.log("✅ EMAIL TERKIRIM");
    return res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error("❌ ERROR WEBHOOK:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
