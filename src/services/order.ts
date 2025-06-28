import { prisma } from "@/lib/prisma";
import { CartItem } from "@/types/cart-item";

export const createNewOrder = async (userId: number, cart: CartItem[]) => {
    // const newOrder = await prisma.order.create({
    //     data: {
    //         userId
    //     }
    // });

    // for(let item of cart) {
    //     await prisma.orderProducts.create({
    //         data: {
    //             orderId: newOrder.id,
    //             productId: item.productId,
    //             quantity: item.quantity
    //         }
    //     });
    // }

    // return newOrder;

    const orderProducts = [];
    let subtotal = 0;

    for(let item of cart) {
        const product = await prisma.product.findUnique({
            where: { id: item.productId }
        });
        if(product) {
            orderProducts.push({
                productId: product.id,
                price: parseFloat(product.price.toString()),
                quantity: item.quantity
            });
            subtotal += item.quantity * parseFloat(product.price.toString());
        }
    }

    const newOrder = await prisma.order.create({
        data: {
            userId,
            subtotal,
            orderProducts: {
                createMany: {
                    data: orderProducts
                }
            }
        },
        include: {
            orderProducts: {
                select: {
                    quantity: true,
                    product: {
                        select: {
                            name: true,
                            price: true
                        }
                    }
                }
            }
        }
    });

    return newOrder;
}