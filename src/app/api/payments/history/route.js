import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 }
      );
    }

    // Find Stripe customer by email
    const customers = await stripe.customers.list({
      email: email.toLowerCase(),
      limit: 10,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({
        success: true,
        payments: [],
      });
    }

    const payments = [];

    // Get invoices for each customer
    for (const customer of customers.data) {
      const invoices = await stripe.invoices.list({
        customer: customer.id,
        limit: 100,
      });

      invoices.data.forEach((invoice) => {
        if (invoice.amount_paid > 0) {
          payments.push({
            id: invoice.id,
            invoiceNumber: invoice.number,

            amount: invoice.amount_paid / 100,

            currency: invoice.currency.toUpperCase(),

            status: invoice.status,

            paid: invoice.paid,

            date: new Date(invoice.created * 1000),

            periodStart: invoice.period_start
              ? new Date(invoice.period_start * 1000)
              : null,

            periodEnd: invoice.period_end
              ? new Date(invoice.period_end * 1000)
              : null,

            hostedInvoiceUrl: invoice.hosted_invoice_url,

            subscriptionId: invoice.subscription,

            description:
              invoice.lines?.data?.[0]?.description ||
              "Fundora Credit Subscription",
          });
        }
      });
    }

    // Newest payment first
    payments.sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Payment history error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to fetch payment history.",
      },
      { status: 500 }
    );
  }
}