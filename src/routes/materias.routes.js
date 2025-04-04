import MateriasController from "../controllers/MateriasController.js"

const materiasController = new MateriasController;

async function MateriasRoutes(fastify){

    fastify.get("/", materiasController.request);
    
    //POSTANDO UM NOVO DADO NA TABELA
    fastify.post('/', materiasController.create);
    
    // DELETAR UMA MATERIA
    fastify.delete('/:id', materiasController.delete);

    // ALTERANDO UMA MATERIA
    fastify.put('/:id', materiasController.update);
}

export default MateriasRoutes;