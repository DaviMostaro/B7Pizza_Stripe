"use client"

import { useCart } from "@/stores/cart";
import { Button } from "../ui/button";

export const CartButton = () => {
    const cart = useCart();

    return (
        <Button className="cursor-pointer" onClick={() => cart.setOpen(true)}>Carrinho</Button>
    );
}