import { supabase } from "../database/supaBaseConection.js";

class ComentariosController{
    async requestEspecific(req,res){
        try {
            const idprofessor = req.params.idprofessor;
            const idformulario = req.params.idformulario;
            const {data:comentarios,error} = await supabase.from("respostas").select(`id,resposta`).eq('professor_id',idprofessor).eq('formulario_id',idformulario).neq("resposta",null).neq("resposta","");
            if (error) {throw new Error(error.message);}
                return(comentarios);
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }

    async update(req,res){
        try {
            const {comentarios} = req.body
            if (!comentarios || typeof comentarios !== "object") {
                return res.status(400).json({ error: "Dados de comentários inválidos." });
            }
            // Itera sobre o objeto de comentários
            for (const [id, texto] of Object.entries(comentarios)) {
                // Atualiza cada comentário no Supabase
                const {error } = await supabase.from("respostas").update({ resposta: texto }).eq("id", id);
                if (error) {
                    console.error(`Erro ao atualizar comentário ${id}:`, error);
                    return res.status(500).json({ error: "Erro ao atualizar comentários." });
                }
            }
            
                return("Comentarios atualizados com sucesso");
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }
}

export default ComentariosController;