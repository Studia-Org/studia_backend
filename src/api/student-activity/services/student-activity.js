'use strict';

/**
 * student-activity service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::student-activity.student-activity');
