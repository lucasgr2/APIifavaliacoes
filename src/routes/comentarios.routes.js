import ComentariosController from "../controllers/ComentariosController.js"

const comentariosController = new ComentariosController;

async function ComentariosRoutes(fastify){

    fastify.get("/:idprofessor/:idformulario", comentariosController.requestEspecific);
    fastify.put("/", comentariosController.update);
    
}

export default ComentariosRoutes;