import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { createInvoice, generateMerchantOrderId } from "@/lib/duitku";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planSlug } = await req.json();

    if (!planSlug) {
      return NextResponse.json({ error: "Plan slug is required" }, { status: 400 });
    }

    // Get plan details
    const { data: plan } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("slug", planSlug)
      .single();

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    // Generate merchant order ID
    const merchantOrderId = generateMerchantOrderId(user.id);

    // Calculate amount (use promo price if available)
    const amount = plan.price_promo ?? plan.price_normal;

    // If free plan, just update directly
    if (planSlug === "free" || amount === 0) {
      await supabase
        .from("profiles")
        .update({
          plan: "free",
          word_quota: plan.word_limit,
        })
        .eq("id", user.id);

      return NextResponse.json({ success: true, message: "Plan upgraded to free" });
    }

    // Create Duitku invoice
    const invoice = await createInvoice({
      orderId: merchantOrderId,
      amount,
      product: {
        name: `Langganan skripsiAi ${plan.name}`,
        price: amount,
      },
      email: user.email || "",
      customerName: profile?.full_name || user.email || "",
      callbackUrl: process.env.DUITKU_CALLBACK_URL || "",
      returnUrl: process.env.DUITKU_RETURN_URL || "",
      expiryPeriod: 60,
    });

    // Store transaction in database
    await supabase.from("transactions").insert({
      user_id: user.id,
      plan_id: plan.id,
      merchant_order_id: merchantOrderId,
      amount,
      status: "pending",
      payment_url: invoice.paymentUrl || invoice.payment_url,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 minutes
    });

    return NextResponse.json({
      success: true,
      paymentUrl: invoice.paymentUrl || invoice.payment_url,
      merchantOrderId,
    });
  } catch (error) {
    const err = error as { message?: string };
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan saat membuat pembayaran" },
      { status: 500 }
    );
  }
}