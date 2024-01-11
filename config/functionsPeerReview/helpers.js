function hacerParejas(objeto, usersToPair = 1) {
    const elementos = [...Object.values(objeto)];
    const longitud = elementos.length;
    while (true) {
        if (longitud < 2 || usersToPair < 1 || usersToPair >= longitud) {
            if (usersToPair < 1) usersToPair = 1;
            if (usersToPair >= longitud) usersToPair = longitud - 1;
            if (longitud < 2) throw new Error('Cannot pair less than 2 users');
        }
        else break;
    }

    const parejas = [];
    for (let i = 0; i < longitud; i++) {
        const pareja = [];
        pareja.push(elementos[i]);
        for (let j = 1; j <= usersToPair; j++) {
            const indexUsuarioACorregir = (i + j) % longitud;
            // no se puede corregir a uno mismo
            if (indexUsuarioACorregir !== i) {
                const usuarioACorregir = elementos[indexUsuarioACorregir];
                pareja.push(usuarioACorregir);
            }
        }

        parejas.push(pareja);
    }

    return { parejas };
}

async function obtenerUsuariosDeCurso(idCourse) {

    const curso = await strapi.entityService.findOne('api::course.course',
        idCourse, {
        populate: { students: true, professor: true }
    });
    const { students } = curso;

    if (!students || !curso) {
        throw new Error('Cannot find students or course, warning: idCourse cannot be undefined');
    }
    return { curso, usuariosDelCurso: students };
}

module.exports = async function crearActividadVinculandoUsuarios(ctx) {
    try {

        let { idCourse, idMainActivity, idActivityPeerReview, evaluator, startDate, usersToPair = 1 } = ctx.request.body;
        const { curso, usuariosDelCurso } = await obtenerUsuariosDeCurso(idCourse);

        if (evaluator === undefined &&
            curso.professor === undefined &&
            curso.professor.id === undefined &&
            curso.professor.id === null &&
            curso.professor.id === ''
        ) {
            throw new Error('Cannot find professor/evaluator');
        }
        else if (evaluator === undefined) evaluator = curso.professor.id;

        if (idMainActivity === undefined) throw new Error('idMainActivity cannot be undefined')

        if (idActivityPeerReview === undefined) throw new Error('idActivityPeerReview cannot be undefined')

        const { qualifications } = await strapi.entityService.
            findOne('api::activity.activity',
                idMainActivity, {
                populate: {
                    qualifications: {
                        populate: {
                            user: true
                        }
                    }
                }
            });
        // usuarios que ha entregado la actividad
        const usuariosQueHanHechoLaActividad = qualifications.map(qualification => qualification.user);
        // usuarios que no han entregado la actividad
        const usuariosQueNoHanHechoLaActividad =
            usuariosDelCurso.
                filter(usuario => usuariosQueHanHechoLaActividad.
                    every(usuarioQueHaHechoLaActividad => usuarioQueHaHechoLaActividad.id !== usuario.id));

        const { parejas } = hacerParejas(usuariosQueHanHechoLaActividad, usersToPair);

        for (const pareja of parejas) {
            // find qualifications of all users
            const user = pareja[0];
            const parejaSinUser = pareja.filter(user => user.id !== pareja[0].id);

            const peerReviewqualifications = qualifications.
                filter(qualification => parejaSinUser.
                    some(user => user.id === qualification.user.id)).map(qualification => qualification.id);
            const qualification = await strapi.entityService.create('api::qualification.qualification', {
                data: {
                    activity: idActivityPeerReview,
                    user: user,
                    evaluator: evaluator,
                    peer_review_qualifications: peerReviewqualifications,
                    publishedAt: startDate
                },
            });
        }

        ctx.body = { parejas };
        return ctx.body;

    } catch (err) {
        ctx.body = { error: err.message || 'Error al crear la actividad' }
        return ctx.body;

    }
}