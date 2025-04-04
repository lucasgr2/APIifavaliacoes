import FormulariosController from "../controllers/FormulariosController.js"

const formulariosController = new FormulariosController;

async function FormulariosRoutes(fastify){

    fastify.get("/", formulariosController.request);
    fastify.get("/last", formulariosController.requestLast);
    fastify.put("/:id", formulariosController.updateAtivo);
    fastify.post("/", formulariosController.insert);
    
}

export default FormulariosRoutes;