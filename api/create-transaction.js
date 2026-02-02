import midtransClient from "midtrans-client";

export default async function handler(req, res) {

  // ✅ CORS HEADERS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ HANDLE PREFLIGHT
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("BODY:", req.body);

    const snap = new midtransClient.Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
      serverKey: process.env.MIDTRANS_SERVER_KEY
    });

    const parameter = {
      transaction_details: {
        order_id: req.body.order_id,
        gross_amount: req.body.gross_amount
      },
      customer_details: {
        first_name: req.body.name || "Customer",
        email: req.body.email || "customer@email.com"
      }
    };

    const transaction = await snap.createTransaction(parameter);

    return res.status(200).json({
      token: transaction.token
    });

  } catch (error) {
    console.error("MIDTRANS ERROR:", error);
    return res.status(500).json({
      message: "Midtrans error",
      error: error.message
    });
  }
}
