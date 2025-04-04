import { supabase } from "../database/supaBaseConection.js";

class QuestoesController{

    async request(){
        try {
            const {data:perguntas} = await supabase.from("perguntas").select("*");
            return(perguntas);
        } catch (error) {
            console.error(error);
        }
    }

    async create(req,res){
        try {
            const {pergunta,tipo} = req.body;
    
            const {data: createPergunta} = await supabase.from("perguntas").insert([{
                pergunta,
                tipo
            }])
            return("pergunta criada com sucesso")
        } catch (error) {
            console.error(error);
        }
    }

    async delete(req,res){
        try {
            const id = req.params.id;
            const pergunta = await supabase.from("perguntas").delete().eq('id',id);
            return("pergunta deletada com sucesso")
          
        } catch (error) {
            console.error(error);
        }
    }
}

export default QuestoesController;