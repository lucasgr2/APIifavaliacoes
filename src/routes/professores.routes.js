import ProfessoresController from "../controllers/ProfessoresController.js"

const professoresController = new ProfessoresController;

async function ProfessoresRoutes(fastify){

    fastify.get("/", professoresController.request);
    fastify.get("/:id", professoresController.requestEspecific);
    fastify.post('/', professoresController.create);
    fastify.delete('/:id', professoresController.delete);
    fastify.put('/:id', professoresController.update);
}

export default ProfessoresRoutes;