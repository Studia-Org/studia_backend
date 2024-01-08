
function hacerParejas(objeto) {

    let elementos = [...Object.values(objeto)]
    const esImpar = elementos.length % 2 !== 0;
    elementos = elementos.sort(() => Math.random() - 0.5);

    const parejas = [];
    for (let i = 0; i < elementos.length; i += 2) {
        const pareja = [elementos[i], elementos[i + 1]];
        parejas.push(pareja);
    }
    if (esImpar) {
        const ultimaPareja = parejas.pop();
        const ultimoAlumno = elementos[elementos.length - 1];
        ultimaPareja.push(ultimoAlumno);
        parejas.push(ultimaPareja);
    }

    return { parejas, esImpar };
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

        let { idCourse, idMainActivity, idActivityPeerReview, evaluator, startDate } = ctx.request.body;
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


        if (idMainActivity === undefined) throw new Error('idMainActivity cannot be undefined');
        if (idActivityPeerReview === undefined) throw new Error('idActivityPeerReview cannot be undefined');


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

        const { parejas, esImpar } = hacerParejas(usuariosQueHanHechoLaActividad);

        for (const pareja of parejas) {
            const peerReviewQualificationUser1 = qualifications.find(qualification => qualification.user.id === pareja[0].id).id;
            const peerReviewQualificationUser2 = qualifications.find(qualification => qualification.user.id === pareja[1].id).id;

            const qualification1 = await strapi.entityService.create('api::qualification.qualification', {
                data: {
                    activity: idActivityPeerReview,
                    user: pareja[0].id,
                    evaluator: evaluator,
                    PeerReviewQualification: peerReviewQualificationUser2,
                    publishedAt: startDate
                },
            });
            const qualification2 = await strapi.entityService.create('api::qualification.qualification', {
                data: {
                    activity: idActivityPeerReview,
                    user: pareja[1].id,
                    evaluator: evaluator,
                    PeerReviewQualification: peerReviewQualificationUser1,
                    publishedAt: startDate
                },
            });
        }

        ctx.body = { parejas: parejas, usuariosQueNoHanHechoLaActividad: usuariosQueNoHanHechoLaActividad };
        return ctx.body;

    } catch (err) {
        ctx.body = err.message || 'Error al crear la actividad';
    }
}