"use strict";

/**
 * product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  // Method 1: Creating an entirely custom action
  //   async exampleAction(ctx) {
  //     try {
  //       ctx.body = "ok";
  //     } catch (err) {
  //       ctx.body = err;
  //     }
  //   },

  // Method 2: Wrapping a core action (leaves core logic in place)
  async find(ctx) {
    // // some custom logic here
    // ctx.query = { ...ctx.query, local: "en" };

    // Calling the default core action
    const { data: products, meta } = await super.find(ctx);
    console.log({
      ctx,
      products,
      meta,
      attributes: products[0].attributes,
      reviews: products[0].attributes.reviews,
    });

    for (const product of products) {
      console.log(product);
      const reviews = product?.attributes?.reviews?.data;
      let averageRating =
        reviews.reduce((ratingSum, currentValue) => {
          //   console.log(ratingSum, currentValue?.attributes?.rating);
          return ratingSum + currentValue?.attributes?.rating;
        }, 0) / reviews.length;
      averageRating = +averageRating.toFixed(1);
      console.log(averageRating, typeof averageRating);
    }

    // // some more custom logic
    // meta.date = Date.now();

    return { data: products, meta };
  },

  // Method 3: Replacing a core action
  //   async findOne(ctx) {
  //     // const { id } = ctx.params;
  //     // const { query } = ctx;
  //     // const entity = await strapi
  //     //   .service("api::restaurant.restaurant")
  //     //   .findOne(id, query);
  //     // const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
  //     // return this.transformResponse(sanitizedEntity);
  //   },
}));
