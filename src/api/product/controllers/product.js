"use strict";

/**
 * product controller
 */

// https://docs.strapi.io/developer-docs/latest/development/backend-customization/controllers.html#adding-a-new-controller

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product");
