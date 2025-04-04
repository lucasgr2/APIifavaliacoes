import TurmasController from "../controllers/TurmasController.js"

const turmasController = new TurmasController;

async function TurmasRoutes(fastify){

    fastify.get("/", turmasController.request);
    fastify.get("/:nivel", turmasController.requestByNivel);
    
    //Pesquisando por relações de uma turma em especifico
    fastify.get("/relacaoaulas/:id", turmasController.requestEspecific);

    //POSTANDO UM NOVO DADO NA TABELA
    fastify.post('/', turmasController.create);

    // ALTERANDO UMA MATERIA
    fastify.put('/:id', turmasController.update);
}

export default TurmasRoutes;