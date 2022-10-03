"use strict";

/**
 * review controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const calculateAverageRating = (reviews, fixed = 1) => {
  let averageRating =
    reviews.reduce((ratingSum, currentValue) => {
      return ratingSum + currentValue?.rating;
    }, 0) / reviews.length;
  return +averageRating.toFixed(fixed);
};

const averageRating = async (productId, strapi) => {
  const findProduct = await strapi.entityService.findOne(
    "api::product.product",
    productId,
    {
      fields: ["title"],
      populate: { reviews: true },
    }
  );
  const { reviews } = findProduct;
  const averageRating = calculateAverageRating(reviews);
  await strapi.entityService.update("api::product.product", productId, {
    data: {
      averageRating,
    },
  });
};

module.exports = createCoreController("api::review.review", ({ strapi }) => ({
  async create(ctx) {
    const response = await super.create(ctx);
    const productId = ctx.request.body.data.product;
    await averageRating(productId, strapi);
    return response;
  },

  async update(ctx) {
    const response = await super.update(ctx);
    const productId = ctx.request.body.data.product;
    await averageRating(productId, strapi);
    return response;
  },

  /**
   * Delete endpoint should match this syntax (http://localhost:1337/api/reviews/26?productId=405)
   * @param {any} ctx
   * @returns
   */
  async delete(ctx) {
    const response = await super.delete(ctx);
    const productId = +ctx.request.url.split("?")[1].split("=")[1];
    await averageRating(productId, strapi);
    return response;
  },
}));
