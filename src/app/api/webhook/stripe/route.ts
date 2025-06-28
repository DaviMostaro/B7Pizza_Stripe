import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const headersList = await headers();
    const stripeSignature = headersList.get('stripe-signature');
    const rawBody = await request.text();

    try {
        const event = stripe.webhooks.constructEvent(
            rawBody,
            stripeSignature!,
            process.env.STRIPE_WEBHOOK_KEY!
        );

        const eventsTypes = [
            'checkout.session.completed',
            'checkout.session.async_payment_succeeded'
        ];

        if(event.type.includes(event.type)) {
            const { metadata, payment_status } = event.data.object as any;

            if(payment_status === 'paid') {
                const orderId = parseInt(metadata.order_id);
                // const { order_id } = metadata;
                if(orderId) {
                    const order = await prisma.order.findUnique({
                        where: { id: orderId }
                    });
                    if(order) {
                        await prisma.order.update({
                            where: { id: orderId },
                            data: { status: 'PAID' }
                        });
                    }
                }
            }
        }
    } catch(err: any) {
        console.log(err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // console.log('OK');
    return NextResponse.json({  });
}