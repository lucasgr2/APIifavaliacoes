import { supabase } from "../database/supaBaseConection.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken"


class SessionController{
    async create(request,response){
        const {email,senha} = request.body
        // consulta usuario
        let {data:user} = await supabase.from("Usuarios").select("*").eq("email",email);
        // Retorno em array mesmo sendo único, tirando do array
        user = user[0]
        // Error usario nao encontrado ou senha invalida
        if(!user || user.senha !== senha){
            throw new AppError("Email ou senha inválidos", 401)
        }
        //Se tem formulario ativo
        let {data:formularioAtivo} = await supabase.from("formularios").select("id").eq("ativo",true);
        formularioAtivo = formularioAtivo[0]?  formularioAtivo[0].id :  null;
        //Se o usuario ja respondeu o form
        let isResponded;
        if(formularioAtivo){
            let {data:registro} = await supabase.from("registro_aluno_formulario").select("*").match({idFormulario:formularioAtivo,idUsuario:user.id});
            registro = registro[0]
            isResponded = registro ? true : false;
        }else{
            isResponded = true;
        }
        

        // Passando pelas verificações hora de gerar o token do usuário
        const token = jwt.sign({id:user.id,email: user.email}, process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRATION
        })
        
        return response.send({userId:user.id, userRole:user.role, token:token, idFormulario:formularioAtivo, isResponded})

    }
}

export default SessionController;