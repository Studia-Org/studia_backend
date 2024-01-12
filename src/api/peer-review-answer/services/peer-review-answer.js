'use strict';

/**
 * peer-review-answer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::peer-review-answer.peer-review-answer');
