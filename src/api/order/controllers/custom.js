const { createCoreController } = require("@strapi/strapi").factories;

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  /**
   * Create custom confirm order given checkout session, verifies payment and update the order
   * @param {any} ctx
   * @returns
   */
  async confirm(ctx) {
    const { checkout_session } = ctx.request.body?.data;
    const session = await stripe.checkout.sessions.retrieve(checkout_session);

    if (session.payment_status === "paid") {
      const updatedOrder = await strapi.db.query("api::order.order").update({
        where: { session_id: checkout_session },
        data: {
          status: "paid",
        },
      });

      updatedOrder?.quantityWithProductIds.forEach(async (product) => {
        const quantityInStock = await strapi.entityService.findOne(
          "api::product.product",
          product?.id,
          {
            fields: ["quantity"],
          }
        );

        const remainingQuantity = quantityInStock.quantity - product?.quantity;

        await strapi.entityService.update("api::product.product", product?.id, {
          data: {
            quantity: remainingQuantity,
            available: remainingQuantity == 0 ? false : true,
          },
        });
      });

      return updatedOrder;
    } else {
      ctx.throw(
        400,
        "It seems like the order wasn't verified, please contact support"
      );
    }
  },
}));
