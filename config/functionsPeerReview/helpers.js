function hacerParejasPeerReview(objeto, usersToPair = 1) {
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

    return { grupos: parejas };
}

function hacerParejasGrupos(grupos, usersToPair = 1) {
    const longitud = grupos.length;
    while (true) {
        if (longitud < 2 || usersToPair < 1 || usersToPair >= longitud) {
            if (usersToPair < 1) usersToPair = 1;
            if (usersToPair >= longitud) usersToPair = longitud - 1;
            if (longitud < 2) throw new Error('Cannot pair less than 2 groups');
        }
        else break;
    }

    const parejas = [];
    for (let i = 0; i < longitud; i++) {
        const pareja = [];
        const pareja2 = [];
        pareja.push(grupos[i].users[0].id);
        pareja2.push(grupos[i].users[1].id);
        for (let j = 1; j <= usersToPair; j++) {
            const indexGrupoACorregir = (i + j) % longitud;
            // no se puede corregir a uno mismo
            if (indexGrupoACorregir !== i) {
                const grupoACorregir = grupos[indexGrupoACorregir];
                pareja.push(grupoACorregir);
                pareja2.push(grupoACorregir);
            }
        }

        parejas.push(pareja);
        parejas.push(pareja2);
    }

    return { grupos: parejas };

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

async function hacerGrupos(students, usersToPair = 2) {
    const longitud = students.length;
    while (true) {
        if (longitud < 2 || usersToPair < 2 || usersToPair >= longitud) {
            if (usersToPair < 2) usersToPair = 2;
            if (usersToPair >= longitud) usersToPair = longitud - 1;
            if (longitud < 2) throw new Error('Cannot pair less than 2 users');
        } else {
            break;
        }
    }

    const parejas = [];
    const numGrupos = Math.ceil(longitud / usersToPair);

    for (let i = 0; i < numGrupos; i++) {
        const pareja = [];
        for (let j = 0; j < usersToPair; j++) {
            const indexUsuario = i * usersToPair + j;
            if (indexUsuario < longitud) {
                const usuario = students[indexUsuario];
                pareja.push(usuario);
            }
        }

        parejas.push(pareja);
    }

    if (parejas[parejas.length - 1].length <= usersToPair / 2) {
        const ultimoGrupo = parejas.pop();
        let itr = 0
        for (const usuario of ultimoGrupo) {
            const index = (parejas.length - 1 - itr) % parejas.length;
            console.log({ index });
            console.log({ usuario });
            parejas[index].push(usuario);
            itr++;

        }
    }

    return { grupos: parejas };
}


async function crearActividadVinculandoUsuarios(ctx) {
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

        const { qualifications, groupActivity } = await strapi.entityService.
            findOne('api::activity.activity',
                idMainActivity, {
                populate: {
                    qualifications: {
                        populate: {
                            user: true,
                            group: {
                                populate: {
                                    users: true
                                }

                            }
                        }
                    }
                }
            });

        console.log(groupActivity);
        let parejas;

        // usuarios que ha entregado la actividad
        if (groupActivity) {
            const gruposQueHanHechoLaActividad = qualifications.map(qualification => qualification.group);
            const { grupos } = hacerParejasGrupos(gruposQueHanHechoLaActividad, usersToPair);
            parejas = grupos
        }
        else {
            const usuariosQueHanHechoLaActividad = qualifications.map(qualification => qualification.user);
            const { grupos } = hacerParejasPeerReview(usuariosQueHanHechoLaActividad, usersToPair);
            parejas = grupos
        }

        for (const pareja of parejas) {
            // find qualifications of all users
            const user = pareja[0];
            const parejaSinUser = pareja.filter(user => user.id !== pareja[0].id);
            let peerReviewqualifications;

            if (groupActivity) {
                peerReviewqualifications = qualifications.
                    filter(qualification => parejaSinUser.
                        some(group => group.id === qualification.group.id)).map(qualification => qualification.id);
                console.log(peerReviewqualifications);

            }
            else {
                peerReviewqualifications = qualifications.
                    filter(qualification => parejaSinUser.
                        some(user => user.id === qualification.user.id)).map(qualification => qualification.id);
            }
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

module.exports = {
    hacerGrupos,
    hacerParejasGrupos,
    obtenerUsuariosDeCurso,
    crearActividadVinculandoUsuarios

} 