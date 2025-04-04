import { supabase } from "../database/supaBaseConection.js";

class ProfessoresController{

    async request(){
        try {
            const {data:professores} = await supabase.from("professores").select("*");
    
            return(professores);
        } catch (error) {
            console.error(error);
        }
    }

    async requestEspecific(){
        try {
            const id = req.params.id;
            const professor = await supabase.from("professores").select("*").eq('id',id);
            
            if (!professor) {
                return('Invalid value')
              }else{
                return(professor)
              }
          
        } catch (error) {
            console.error(error);
        }
    }

    async create(req,res){
        try {
            const {nome,titulacao} = req.body;
    
            const {error} = await supabase.from("professores").insert([{
                nome,
                titulacao
            }])
            if (error) {throw new Error(error.message);}
            return("professor criado com sucesso")
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }

    async delete(req,res){
        try {
            const id = req.params.id;
            const professor = await supabase.from("professores").delete().eq('id',id);
            return("professor deletado com sucesso")
        } catch (error) {
            console.error(error);
        }
    }

    async update(req,res){
        try {
            const id = req.params.id;
            const {nome,titulacao} = req.body;
            const professorUpdate = await supabase.from("professores").update({nome:nome,titulacao:titulacao}).eq('id',id);
            return("professor atualizado com sucesso")
        } catch (error) {
            console.error(error);
        }
    }
}

export default ProfessoresController;