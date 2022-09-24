"use strict";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  //   // Method 1: Creating an entirely custom action
  //   async exampleAction(ctx) {
  //     try {
  //       ctx.body = "ok";
  //     } catch (err) {
  //       ctx.body = err;
  //     }
  //   },
  //   // Method 2: Wrapping a core action (leaves core logic in place)
  //   async find(ctx) {
  //     // some custom logic here
  //     ctx.query = { ...ctx.query, local: "en" };
  //     // Calling the default core action
  //     const { data, meta } = await super.find(ctx);
  //     // some more custom logic
  //     meta.date = Date.now();
  //     return { data, meta };
  //   },
  //   // Method 3: Replacing a core action
  //   async findOne(ctx) {
  //     const { id } = ctx.params;
  //     const { query } = ctx;
  //     const entity = await strapi
  //       .service("api::restaurant.restaurant")
  //       .findOne(id, query);
  //     const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
  //     return this.transformResponse(sanitizedEntity);
  //   },

  /**
   * Create an order and sets up the stripe checkout session for the frontend
   * @param {any} ctx
   * @returns
   */
  async create(ctx) {
    // const response = await super.create(ctx);
    console.log(ctx.request);
    const { products } = ctx.request.body;
    if (!products) {
      return ctx.throw(400, "Please specify products");
    }

    // const entry = await strapi.entityService.findOne(
    //   "api::product.product",
    //   product.id,
    //   {
    //     fields: ["title", "description"],
    //     populate: { category: true },
    //   }
    // );

    // const entries = await strapi.entityService.findMany(
    //   "api::article.article",
    //   {
    //     fields: ["title", "description"],
    //     filters: { title: "Hello World" },
    //     sort: { createdAt: "DESC" },
    //     populate: { category: true },
    //   }
    // );
  },
}));
