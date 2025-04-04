import RespostasController from "../controllers/RespostasController.js";

const respostasController = new RespostasController;

async function RespostasRoutes(fastify){

    fastify.get("/:idprofessor/:idformulario", respostasController.read);

    fastify.post("/",respostasController.create);
}

export default RespostasRoutes;