import { supabase } from "../database/supaBaseConection.js";

class TurmasController {
    
    async request(req,res){
        try {
            const {data:turmas} = await supabase.from("turmas").select("id,turma,quantalunos,nivel");
            return(turmas);
        } catch (error) {
            console.error(error);
        }
    }

    async requestByNivel(req,res){
        try {
            const nivel = req.params.nivel;
            const {data:turmas} = await supabase.from("turmas").select(`id,turma,quantalunos,nivel`).eq('nivel',nivel);
            return res.status(200).send(turmas);
        } catch (error) {
            console.error(error);
        }
    }

    async requestEspecific(req,res){
        try {
            const idTurma = req.params.id
            const {data:turma} = await supabase.from("Relacao_aulas").select("id_professor, professores(nome),id_materia, materias(materia)").eq("id_turma", idTurma)
            return(turma)
        } catch (error) {
            console.log(`Erro na requisição: ${error}`)
        }
    }

    async create(req,res){
        try {
            const {turma:nome,quantalunos,nivel} = req.body;
            const {error} = await supabase.from('turmas').insert({ turma: nome, quantalunos: quantalunos, nivel:nivel });
            // Se houver um erro, lança uma exceção
            if (error) {throw new Error(error.message);}
            // Retorna uma resposta de sucesso
            return res.status(201).send({ message: 'Turma criada com sucesso!' });
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }

    async update(req,res){
        try {
            const id = req.params.id;
            const {turma,quantalunos,nivel} = req.body;
            const {error} = await supabase.from("turmas").update({turma:turma,quantalunos:quantalunos, nivel:nivel}).eq('id',id);
            // Se houver um erro, lança uma exceção
            if (error) {throw new Error(error.message);}
            // Retorna uma resposta de sucesso
            return res.status(200).send({ message: 'Turma alterada com sucesso!' });

          
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }
}

export default TurmasController;