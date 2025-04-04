import UsuariosController from "../controllers/UsuariosController.js"

const usuariosController = new UsuariosController;

async function UsuariosRoutes(fastify){

    fastify.get("/", usuariosController.request);
    
    //Pesquisando por relações de uma turma em especifico
    //fastify.get("/relacaoaulas/:id", turmasController.requestEspecific);

    //POSTANDO UM NOVO DADO NA TABELA
    fastify.post('/', usuariosController.create);

    //POSTANDO ATRAVES DE PLANILHA NA TABELA
    fastify.post('/upload', usuariosController.createMassive);
    
    // DELETAR UMA Usuario
    fastify.delete('/:id', usuariosController.delete);

    // ALTERANDO UMA Usuario
    fastify.put('/:id', usuariosController.update);
}

export default UsuariosRoutes;