import { supabase } from "../database/supaBaseConection.js";
import xlsx from 'xlsx';
import { fileURLToPath } from 'url';
import path from 'path';

class UsuariosController{

    async request(){
        try {
            const {data:usuarios,error} = await supabase.from("Usuarios").select("id,email,senha, role");
            if (error) {throw new Error(error.message);}
            return(usuarios);
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }

    async create(req,res){
        try {
            const {email,senha,role} = req.body;
            const {error} = await supabase.from("Usuarios").insert({email,senha,role});
            if (error) {throw new Error(error.message);}
            return("Usuario criado com sucesso");
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }

    async delete(req,res){
        try {
            const id = req.params.id;
            const {error} = await supabase.from("Usuarios").delete().eq('id',id);
            if (error) {throw new Error(error.message);}
            return("Usuario deletado com sucesso")
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }

    async update(req,res){
        try {
            const id = req.params.id;
            const {email,senha,role} = req.body;
            const {error} = await supabase.from("Usuarios").update({email,senha,role}).eq('id',id);
            if (error) {throw new Error(error.message);}
            return("Usuario criado com sucesso");
        } catch (error) {
            // Captura o erro e retorna uma resposta de erro
            console.log(`Erro na requisição: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
    }

    async createMassive(req,res){
        try {
            
            const data = await req.file();
            const buffer = await data.toBuffer();
            const workbook = xlsx.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            // Validação: Máximo de 50 usuários
            if (jsonData.length > 100) {
              return res.status(400).send({ error: 'A planilha não pode conter mais de 100 usuários.' });
            }
            // Validação: Colunas obrigatórias
            const users = jsonData.map((row) => {
              if (!row.email || !row.senha || !row.role) {
                throw new Error('Planilha com dados incorretos');
              }else if(row.role !== "aluno"){
                throw new Error('Somente alunos podem ser cadastrados por planilha!');
              }
              return {
                email: row.email,
                senha: row.senha,
                role: row.role
              };
            });
            console.log("passei aqui")
            const {error} =  await supabase.from("Usuarios").insert(users);
            if (error) {throw new Error(error.message);}
            return res.send({ message: 'Usuarios cadastrados com sucesso!'});
          } catch (error) {
            console.error("POST usuario/upload, Something Went Wrong:", error.message);
            return res.status(400).send({ error: error.message });
          }
          
    }
}

export default UsuariosController;