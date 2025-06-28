import { PizzaList } from "@/components/home/pizza-list";
import { Header } from "@/components/layout/header";
import { api } from "@/lib/axios";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams } : Props) {
    const sessionId = (await searchParams).session_id as string;

    if(!sessionId) return redirect('/');

    const paymentSession = await stripe.checkout.sessions.retrieve(sessionId);

    if(!paymentSession) return redirect('/');

    const status = paymentSession.status;
    const paymentStatus = paymentSession.payment_status;
    const customerEmail = paymentSession.customer_email;
    const paymentMetadata = paymentSession.metadata;

    return (
        <div>
            <Header />
            <main className="container mx-auto mb-10 text-center">
                <h1 className="text-2xl">Parabéns pela compra!</h1>
                <h3 className="text-xl">Em breve você receberá um e-mail para <strong>{customerEmail}</strong> com os detalhes da compra.</h3>
                {/* <p>Status: {status}</p>
                <p>Pagamento: {paymentStatus}</p>
                <p>Email: {customerEmail}</p>
                <p>Order Id: {paymentMetadata?.order_id}</p> */}
            </main>
        </div>
    )
}