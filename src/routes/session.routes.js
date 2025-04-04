import SessionController from "../controllers/SessionController.js";
import AuthController from "../controllers/AuthController.js";
import VerificAuthMiddleware from "../middlewares/VerificAuthMiddleware.js";

const sessionController = new SessionController;
const authController = new AuthController;

async function SessionRoutes(fastify){
    fastify.post("/", sessionController.create);
    fastify.post("/test", authController.signin);
    fastify.get("/test/me", authController.getCurrentUser);
    
}

export default SessionRoutes;