"use strict";

/**
 * product controller
 */

// https://docs.strapi.io/developer-docs/latest/development/backend-customization/controllers.html#adding-a-new-controller

const { createCoreController } = require("@strapi/strapi").factories;

const calculateAverageRating = (reviews, fixed = 1) => {
  let averageRating =
    reviews.reduce((ratingSum, currentValue) => {
      return ratingSum + currentValue?.attributes?.rating;
    }, 0) / reviews.length;
  return +averageRating.toFixed(fixed);
};

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    let products = data?.map((product) => {
      const { id, attributes } = product;
      const reviews = attributes?.reviews?.data;
      if (reviews?.length > 0) {
        return {
          id: id,
          attributes: {
            ...attributes,
            averageRating: calculateAverageRating(reviews),
          },
        };
      } else {
        return { id, attributes: { ...attributes, averageRating: 0 } };
      }
    });
    return { data: products, meta };
  },

  async findOne(ctx) {
    let { data: product, meta } = await super.findOne(ctx);
    const reviews = product?.attributes?.reviews?.data;
    const { id, attributes } = product;
    if (reviews?.length > 0) {
      product = {
        id,
        attributes: {
          ...attributes,
          averageRating: calculateAverageRating(reviews),
        },
      };
    } else {
      product = {
        id,
        attributes: { ...attributes, averageRating: 0 },
      };
    }
    return { data: product, meta };
  },
}));
