"use strict";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

/**
 * Given a dollar amount number, convert it to it's value in cents
 * @param number
 */
const fromDecimalToInt = (number) => parseInt(number * 100);
// const fromDecimalToInt = (number) => parseFloat(number.toFixed(2) * 100);

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  /**
   * Create an order and sets up the stripe checkout session for the frontend
   * @param {any} ctx
   * @returns
   */

  async create(ctx) {
    const SERVER_URL = process.env.STRAPI_SERVER_URL || "http://localhost:1337";
    const BASE_URL = ctx.request.headers.origin || "http://localhost:3000";
    const {
      products: productIds,
      user: userId,
      quantityWithProductIds,
    } = ctx.request.body.data;

    // console.log(ctx.request.body.data);

    // https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/query-engine-api.html
    const user = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id: userId },
        populate: {
          shippingAddress: true,
          billingAddress: true,
        },
      });

    const getQuantityAgainstEveryProduct = (id) => {
      return quantityWithProductIds.find((product) => product.id === id).qty;
    };

    let products = await strapi.db.query("api::product.product").findMany({
      select: ["*"],
      where: {
        id: {
          $in: productIds,
        },
      },
      populate: { image: true },
      orderBy: { publishedAt: "DESC" },
    });

    let lineItems = [];
    if (products?.length > 0) {
      products.forEach((product) => {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: product.title,
              images: [`${SERVER_URL}${product.image.url}`],
              description: product.description,
            },
            unit_amount: fromDecimalToInt(product.price),
          },
          quantity: getQuantityAgainstEveryProduct(product.id),
        });
      });
    }

    // console.log({ lineItems, products });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      mode: "payment",
      // metadata: {
      //   user: userId,
      //   // products: productIds.map(String),
      //   products: productIds,
      //   total: 200,
      // },
      line_items: lineItems,
      success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: BASE_URL,
    });

    let response = await super.create(ctx);
    const { id: orderId, attributes } = response.data;

    await strapi.entityService.update("api::order.order", orderId, {
      data: {
        checkoutSession: session.id,
      },
    });
    response = {
      data: {
        id: orderId,
        attributes: { ...attributes, checkoutSession: session.id },
      },
      meta: {},
    };
    return response;
  },
}));

// const session = await stripe.checkout.sessions.create({
//   payment_method_types: ["card"],
//   customer_email: user.email,
//   mode: "payment",
//   metadata: {
//     user: user.id,
//     products: productIds,
//     total: 200,
//   },
//   line_items: [
//     {
//       price_data: {
//         currency: "usd",
//         product_data: {
//           name: title,
//           images: [coverPhoto],
//           description,
//         },
//         unit_amount: fromDecimalToInt(cost), //we need to convert this price into cents
//       },
//       quantity: 1,
//     },
//   ],

//   success_url: `http://localhost:3000/`,
//   cancel_url: `http://localhost:3000/`,
// });
