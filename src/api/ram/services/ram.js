'use strict';

/**
 * ram service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::ram.ram');
