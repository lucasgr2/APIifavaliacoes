import { supabase } from "../database/supaBaseConection.js";

class FormulariosController{
    async request(req,res){
        try {
            const {data:formularios} = await supabase.from("formularios").select("*").order('id', { ascending: false });
            return(formularios);
        } catch (error) {
            console.error(error);
            return(error)
        }
    }

    async requestLast(req,res){
        try {
            const {data:formularios} = await supabase.from("formularios").select("id").order('id', { ascending: false }).limit(1).single();
            return(formularios);
        } catch (error) {
            console.error(error);
            return(error)
        }
    }

    async insert(req,res){
        try {
            const {nome,semestre,ano} = req.body;
            const { error } = await supabase.from('formularios').insert({ nome: nome, semestre: semestre, ano:ano });
        } catch (error) {
            console.error(error);
            return(error);
        }
    }

    async updateAtivo(req,res){
        try{
            const id = req.params.id;
            console.log(id)
            const {ativo} = req.body; 
            const { error } = await supabase.from('formularios').update({ ativo: ativo }).eq('id', id)
        }catch(error){
            console.error(error);
            return(error) 
        }
    }
}

export default FormulariosController;