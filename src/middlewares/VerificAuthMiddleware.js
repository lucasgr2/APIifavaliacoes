import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

//Esse middleware vai verificar se as requisições estão autenticadas com um JWT válido
function VerificAuthMiddleware(request,response,next){
    //pegando o token do header da requisição
    const authHeader = request.headers.authorization;
    // Se o token não estiver presente no header lançar a exceção
    if(!authHeader){
        throw new AppError("Requisição não autenticada",401)
    }
    //retirando o pré fixo da string que vem no header para extrair somente o token
    const [,token] = authHeader.split(" ");
    //verificando se o token é válido e extraindo o id do usuário
    try {
        const {sub:user_id} = jwt.verify(token,process.env.JWT_SECRET);
        // caso o token seja válido passando ele para a request para ser acessivel no controller
        response.user = {
            // convertendo porque o id foi passado para o token como string
            id: Number(user_id),
        }
    } catch {
        //Exceção caso tenha o token na requisição mas ele não seja válido
        throw new AppError("Token de autenticação é inválido",401);
    }
    next();
}
export default VerificAuthMiddleware;