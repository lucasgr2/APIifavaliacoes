import QuestoesController from "../controllers/QuestoesController.js"

const questoesController = new QuestoesController;

async function QuestoesRoutes(fastify){

    fastify.get("/", questoesController.request);
    
    //POSTANDO UM NOVO DADO NA TABELA
    fastify.post('/', questoesController.create);
    
    // DELETAR UMA PERGUNTA
    fastify.delete('/:id', questoesController.delete);
}

export default QuestoesRoutes;