import midtransClient from "midtrans-client";

export default async function handler(req, res) {
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

    res.status(200).json({
      token: transaction.token
    });

  } catch (error) {
    console.error("MIDTRANS ERROR:", error);
    res.status(500).json({
      message: "Midtrans error",
      error: error.message
    });
  }
}
