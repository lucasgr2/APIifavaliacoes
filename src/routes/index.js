import SessionRoutes from "./session.routes.js"
import QuestoesRoutes from "./questoes.routes.js";
import RespostasRoutes from "./respostas.routes.js";
import FormulariosRoutes from "./formulario.routes.js";
import MateriasRoutes from "./materias.routes.js"
import TurmasRoutes from "./turmas.routes.js"
import UsuariosRoutes from "./usuarios.routes.js";
import ComentariosRoutes from "./comentarios.routes.js";
import ProfessoresRoutes from "./professores.routes.js";

async function Roteador(fastify){
    fastify.register(SessionRoutes,{prefix:'/auth'});
    fastify.register(QuestoesRoutes,{prefix:'/perguntas'});
    fastify.register(RespostasRoutes,{prefix:'/respostas'});
    fastify.register(FormulariosRoutes,{prefix:'/formularios'});
    fastify.register(MateriasRoutes,{prefix:'/materias'});
    fastify.register(TurmasRoutes,{prefix:'/turmas'});
    fastify.register(UsuariosRoutes,{prefix:'/usuarios'});
    fastify.register(ComentariosRoutes,{prefix:'/comentarios'});
    fastify.register(ProfessoresRoutes,{prefix:'/professores'});
}

export default Roteador;