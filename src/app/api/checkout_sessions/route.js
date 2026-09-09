import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe, PURCHASE_CREDIT_ID } from '../../lib/stripe'
// import { stripe } from '../../../lib/stripe'

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const formData= await request.formData()
    const purchaseId= formData.get("package")
    const creditId= PURCHASE_CREDIT_ID[purchaseId]

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: creditId,
          
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard/supporter/purchase-credit/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
    //   integration_identifier: '{{INTEGRATION_ID}}',
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}