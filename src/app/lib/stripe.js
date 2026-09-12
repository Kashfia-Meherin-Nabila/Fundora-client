import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PURCHASE_CREDIT_ID={
    "supporter_starter" :"price_1UDme9FxSVrTxjLWVnDh77vK",
    "supporter_popular" : "price_1UDhgNFxSVrTxjLWzdoDTl2B",
    "supporter_value": "price_1UDmmwFxSVrTxjLWOpjN2MZE",
    "supporter_premium": "price_1UDmo1FxSVrTxjLWlk1EXgqG"
}