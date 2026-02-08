export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  try {
    const data = req.body;

    const orderId = data.order_id;
    const status = data.transaction_status;
    const amount = Number(data.gross_amount);

    console.log("🔔 WEBHOOK MASUK");
    console.log("ORDER ID:", orderId);
    console.log("STATUS:", status);
    console.log("AMOUNT:", amount);

    // ✅ HANYA LANJUT JIKA PEMBAYARAN SUKSES
    if (status !== "settlement") {
      console.log("⏳ BUKAN SETTLEMENT, DIABAIKAN");
      return res.status(200).json({ message: "Not settlement" });
    }

    // 🧠 TENTUKAN PRODUK
    let productType = "";
    let products = [];

    if (amount === 89000) {
      productType = "PRODUK_A";
      products = ["A"];
    } else if (amount === 118000) {
      productType = "PRODUK_A_BUNDLE";
      products = ["A", "B"];
    } else {
      console.log("❌ NOMINAL TIDAK DIKENAL");
      return res.status(200).json({ message: "Unknown amount" });
    }

    console.log("✅ PEMBAYARAN SUKSES");
    console.log("TIPE PRODUK:", productType);
    console.log("ISI PRODUK:", products);

    // ⛔ STEP 2 BERHENTI DI SINI
    // STEP 3: EMAILJS AKAN DITAMBAHKAN DI SINI

    return res.status(200).json({
      message: "Payment processed",
      orderId,
      productType,
      products
    });

  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return res.status(500).json({ message: "Webhook error" });
  }
}
