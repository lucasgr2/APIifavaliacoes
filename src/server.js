import Fastify from "fastify";
import cors from '@fastify/cors'
import { supabase } from "./database/supaBaseConection.js";
import dotenv from "dotenv";
import AppError from "./utils/AppError.js";
import multipart from '@fastify/multipart';

dotenv.config(); // Carrega o arquivo .env para ser acessado 
//rotas
import  Roteador  from "./routes/index.js";

//Criando instância do fastify
const fastify = Fastify();

// Registra o plugin multipart para lidar com upload de arquivos
fastify.register(multipart);

// Habilita o plugin Fastify CORS que configura a aplicação para o navegador permitir solicitações de aplicações terceiras
 await fastify.register(cors, {
  origin: '*', // Isso permite solicitações de qualquer origem. Você pode ajustar isso para limitar a origem conforme necessário.
  methods: ['GET', 'PUT', 'POST', 'DELETE'], // Métodos HTTP permitidos
  //allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
});

//Registrando no fastify arquivo de rotas (Ele organiza todas as rotas da aplicação)
fastify.register(Roteador);



// Registrar o tratamento de erros personalizado
fastify.setErrorHandler((error, request, response) => {
    if (error instanceof AppError) {
        response.status(error.statusCode).send({ status:'error', message: error.message });
    } else {
        response.status(500).send({ status:'error', message: 'Internal Server Error' });
    }
  });

//Colocando o server para rodar
fastify.listen({
    host: '0.0.0.0',
    port: process.env.PORT
}).then(()=> {
    console.log("servidor conectado com sucesso")
})



// GET MATERIAS POR TURMA ESPECIFICA
fastify.get('/materias/:turma', async (req)=>{
    try {
        const turma = req.params.turma
        const {data:materias,error} = await supabase.from("Relacao_aulas").select(`id_materia, materias(materia)`).eq('id_turma', turma);  
        // Usamos um Map para armazenar os objetos únicos, com id_materia como chave
        const map = new Map();
        // Iteramos sobre o array original
        materias.forEach(item => {
            // Se o id_materia ainda não estiver no Map, adicionamos o objeto
            if (!map.has(item.id_materia)) {
            map.set(item.id_materia, item);
            }
        });
        // Retornamos os valores do Map (objetos únicos) em formato de array

        return(Array.from(map.values()));
    } catch (error) {
        console.error(error);
    }
})

//--------------------------------- MATERIA_PROFESSOR ---------------------------------------------
//GET Relação Aulas
fastify.get('/relacaoAulas/:turma', async (req)=>{
    try {
        const turma = req.params.turma;
        const {data: MateriaProfessor} = await supabase.from("Relacao_aulas").select(`id_professor , professores(nome) , id_materia , materias(materia)`).eq('id_turma',turma);
        return(MateriaProfessor);
    } catch (error) {
        console.error(error);
    }
})

//Post Relação Aulas
fastify.post('/relacaoAulas', async (req,res)=>{
    try {
        const {id_professor, id_materia, id_turma} = req.body;
        const {error} = await supabase.from("Relacao_aulas").insert({id_professor, id_materia, id_turma});
        if (error) {throw new Error(error.message);}
        return("relação criada com sucesso")
    } catch (error) {
        // Captura o erro e retorna uma resposta de erro
        console.log(`Erro na requisição: ${error}`);
        return res.status(500).send({ error: error });
    }
})


//GET MATERIAS
fastify.delete('/relacaoAulas/:idProfessor/:idMateria/:idTurma', async (req,res)=>{
    try {       
        const id_professor  = req.params.idProfessor;
        const id_materia  = req.params.idMateria;
        const id_turma  = req.params.idTurma;
        const { error } = await supabase.from('Relacao_aulas').delete().match({ id_professor, id_materia, id_turma});
        if (error) {throw new Error(error.message);}
        return("relação deletada com sucesso")
    } catch (error) {
        // Captura o erro e retorna uma resposta de erro
        console.log(`Erro na requisição: ${error}`);
        return res.status(500).send({ error: error });
    }
})
// GET MATERIA POR TURMA ESPECIFICA
fastify.get('/MateriaProfessor/:turma', async (req)=>{
    try {
        const turma = req.params.turma
        const {data: MateriaProfessor} = await supabase.from("materias").select(`id,materia,turma_id,professores(id,nome)`).eq('turma_id',turma);
        return(MateriaProfessor);
    } catch (error) {
        console.error(error);
    }
})
