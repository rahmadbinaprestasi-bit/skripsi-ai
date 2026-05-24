import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/duitku";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const merchantCode = formData.get("merchantCode") as string;
    const amount = formData.get("amount") as string;
    const merchantOrderId = formData.get("merchantOrderId") as string;
    const resultCode = formData.get("resultCode") as string;
    const reference = formData.get("reference") as string;
    const signature = formData.get("signature") as string;

    // Validate required fields
    if (!merchantCode || !amount || !merchantOrderId || !resultCode || !signature) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature({
      merchantCode,
      amount,
      merchantOrderId,
      resultCode,
      signature,
    });

    if (!isValid) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 400 });
    }

    const supabase = await createServiceClient();

    // Find the transaction
    const { data: transaction } = await supabase
      .from("transactions")
      .select("*, subscription_plans(*), profiles(*)")
      .eq("merchant_order_id", merchantOrderId)
      .single();

    if (!transaction) {
      console.error("Transaction not found:", merchantOrderId);
      return new Response("Transaction not found", { status: 404 });
    }

    // Check if already processed
    if (transaction.status === "success") {
      return new Response("Already processed", { status: 200 });
    }

    // Result code "00" means success
    if (resultCode === "00") {
      // Update transaction status
      await supabase
        .from("transactions")
        .update({
          status: "success",
          reference,
          paid_at: new Date().toISOString(),
          payment_method: formData.get("paymentMethod") as string || null,
        })
        .eq("id", transaction.id);

      // Update user profile with new plan
      const plan = transaction.subscription_plans;
      await supabase
        .from("profiles")
        .update({
          plan: plan.slug,
          word_quota: plan.word_limit === -1 ? 999999999 : plan.word_limit,
        })
        .eq("id", transaction.user_id);

      // Process affiliate commission if exists
      const referredProfile = transaction.profiles;
      if (referredProfile?.referred_by) {
        const commissionAmount = Math.round(transaction.amount * 0.2); // 20% commission
        await supabase.from("affiliate_commissions").insert({
          referrer_id: referredProfile.referred_by,
          referred_id: transaction.user_id,
          transaction_id: transaction.id,
          commission_type: "cash",
          amount: commissionAmount,
          status: "pending",
        });
      }

      console.log(`Payment successful for order: ${merchantOrderId}`);
    } else {
      // Payment failed or expired
      await supabase
        .from("transactions")
        .update({
          status: resultCode === "01" ? "expired" : "failed",
        })
        .eq("id", transaction.id);
    }

    return new Response("OK", { status: 200 });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return new Response("Internal error", { status: 500 });
  }
}