'use strict';

/**
 * activity controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const crearActividadVinculandoUsuarios = require('../../../../config/functionsPeerReview/helpers')

module.exports = createCoreController('api::activity.activity',
    ({ strapi }) => ({
        async peerReviewPairing(ctx) {
            try {
                await crearActividadVinculandoUsuarios(ctx);
            } catch (err) {
                ctx.body = err;
            }
        }

    }));
