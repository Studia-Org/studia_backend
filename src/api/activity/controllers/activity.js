'use strict';

/**
 * activity controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { crearActividadVinculandoUsuarios, hacerGrupos, obtenerUsuariosDeCurso } = require('../../../../config/functionsPeerReview/helpers')

module.exports = createCoreController('api::activity.activity',
    ({ strapi }) => ({
        async peerReviewPairing(ctx) {
            try {
                await crearActividadVinculandoUsuarios(ctx);
            } catch (err) {
                ctx.body = err;
            }
        },
        async createGroupsStudents(ctx) {
            try {
                // @ts-ignore
                let { idCourse, idActivty, longitudGrupo } = ctx.request.body;
                const { usuariosDelCurso } = await obtenerUsuariosDeCurso(idCourse);
                const { grupos } = await hacerGrupos(usuariosDelCurso, longitudGrupo);

                grupos.forEach(async grupo => {
                    const group = await strapi.entityService.create('api::group.group', {
                        data: {
                            users: grupo,
                            publishedAt: new Date(),
                            activity: idActivty
                        },
                    });
                })

                ctx.body = grupos;
                return ctx
            } catch (err) {
                return err.message;
            }
        }
    }));
// 