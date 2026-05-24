import crypto from "crypto";

const DUITKU_BASE_URL = process.env.DUITKU_IS_SANDBOX === "true"
  ? "https://sandbox.duitku.com/webapi/api/merchant"
  : "https://passport.duitku.com/webapi/api/merchant";

interface DuitkuProduct {
  name: string;
  price: number;
}

interface CreateInvoiceOptions {
  orderId: string;
  amount: number;
  product: DuitkuProduct;
  email: string;
  customerName: string;
  callbackUrl: string;
  returnUrl: string;
  expiryPeriod?: number;
}

function createSignature(params: {
  merchantCode: string;
  amount: string | number;
  merchantOrderId: string;
  apiKey: string;
}): string {
  const { merchantCode, amount, merchantOrderId, apiKey } = params;
  const data = `${merchantCode}${amount}${merchantOrderId}${apiKey}`;
  return crypto.createHash("md5").update(data).digest("hex");
}

export async function createInvoice(options: CreateInvoiceOptions) {
  const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
  const apiKey = process.env.DUITKU_API_KEY!;
  const amount = String(options.amount);

  const signature = createSignature({
    merchantCode,
    amount,
    merchantOrderId: options.orderId,
    apiKey,
  });

  const payload = {
    merchantCode,
    amount: options.amount,
    merchantOrderId: options.orderId,
    signature,
    productDetails: options.product.name,
    email: options.email,
    paymentAmount: options.amount,
    additionalParam: "",
    merchantUserInfo: options.email,
    customerVaName: options.customerName || options.email,
    callbackUrl: options.callbackUrl,
    returnUrl: options.returnUrl,
    expiryPeriod: options.expiryPeriod || 60,
  };

  try {
    const response = await fetch(`${DUITKU_BASE_URL}/createInvoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Duitku API Error:", error);
    throw error;
  }
}

export function verifyWebhookSignature(params: {
  merchantCode: string;
  amount: string;
  merchantOrderId: string;
  resultCode: string;
  signature: string;
}): boolean {
  const apiKey = process.env.DUITKU_API_KEY!;
  const { merchantCode, amount, merchantOrderId, signature } = params;

  const expectedSignature = crypto
    .createHash("md5")
    .update(`${merchantCode}${amount}${merchantOrderId}${apiKey}`)
    .digest("hex");

  return signature === expectedSignature;
}

export function generateMerchantOrderId(userId: string): string {
  return `SKR-${userId.slice(0, 8)}-${Date.now()}`;
}

export default {
  createInvoice,
  verifyWebhookSignature,
  generateMerchantOrderId,
};