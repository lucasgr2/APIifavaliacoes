import { supabase } from "../database/supaBaseConection.js";

class MateriasController{

    async request(){
        try {
            const {data:materias} = await supabase.from("materias").select("id,materia");
            return(materias);
        } catch (error) {
            console.error(error);
        }
    }

    async create(req,res){
        try {
            const {materia} = req.body;
    
            const {error} = await supabase.from("materias").insert({materia:materia})
            if (error) {throw new Error(error.message);}
            return("materia criada com sucesso")
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }

    async delete(req,res){
        try {
            const id = req.params.id;
            const {error} = await supabase.from("materias").delete().eq('id',id);
            if (error) {throw new Error(error.message);}
            return("materia deletada com sucesso")
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }

    async update(req,res){
        try {
            const id = req.params.id;
            const {materia} = req.body;
            const {error} = await supabase.from("materias").update({materia:materia}).eq('id',id);
            if (error) {throw new Error(error.message);}
            return("materia criada com sucesso")
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }
}

export default MateriasController;