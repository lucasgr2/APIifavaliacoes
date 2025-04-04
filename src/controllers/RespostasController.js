import { supabase } from "../database/supaBaseConection.js";
import AppError from "../utils/AppError.js";

class RespostasController{

    async read(req,res){
        let dadosFormatados = [
            {},
            {},
            {},
            {}
        ];

        try {
            const idprofessor = req.params.idprofessor;
            const idformulario = req.params.idformulario;
            const {data:respostas} = await supabase.from("respostas").select(`id,pergunta_id,perguntas(pergunta,tipo),materia_id,materias(materia),professor_id,turma_id,turmas(turma,nivel),resposta,avaliacao`).eq('professor_id',idprofessor).eq('formulario_id',idformulario);
            //dividir as respostas por perguntas
            //depois por nivel
            //depois por disciplina
            //depois por turma
            // Itera sobre cada resposta e organiza os dados
            respostas.forEach(res => {
                const { pergunta_id, perguntas, materias, turmas, avaliacao: respostaValor, resposta } = res;
                const pergunta = perguntas.pergunta;
                const materia = materias.materia;
                const turma = turmas.turma;
                const nivel = turmas.nivel;
            
                // Se a pergunta ainda não existe no objeto, cria uma entrada para ela
                if (!dadosFormatados[0][pergunta_id] && pergunta_id != 7) {
                    dadosFormatados[0][pergunta_id] = {
                        pergunta: pergunta,
                        quantResposta:0,
                        pontuacao:0,
                        nivel: {}
                    };
                }else if(!dadosFormatados[0][pergunta_id] && pergunta_id == 7){
                    dadosFormatados[0][pergunta_id] = {
                        respostas: []
                    };
                }
                if(pergunta_id != 7){
                // Se o nivel ainda não existe na pergunta, cria uma entrada para ela
                if (!dadosFormatados[0][pergunta_id].nivel[nivel] ) {
                    dadosFormatados[0][pergunta_id].nivel[nivel] = {
                        quantResposta:0,
                        pontuacao:0,
                        materias:{}

                    };
                }
                // Se a matéria ainda não existe no nivel, cria uma entrada para ela
                if (!dadosFormatados[0][pergunta_id].nivel[nivel].materias[materia] ) {
                    dadosFormatados[0][pergunta_id].nivel[nivel].materias[materia] = {
                        quantResposta:0,
                        pontuacao:0,
                        turmas:{}
                    };
                }
                // Se a turma ainda não existe na matéria, cria uma entrada para ela
                if (!dadosFormatados[0][pergunta_id].nivel[nivel].materias[materia].turmas[turma] ) {
                    dadosFormatados[0][pergunta_id].nivel[nivel].materias[materia].turmas[turma] = {
                        "0": 0,
                        "1": 0,
                        "2": 0,
                        "3": 0,
                        "4": 0
                    };
                }
                    // Incrementa o contador da resposta específica
                    dadosFormatados[0][pergunta_id].nivel[nivel].materias[materia].turmas[turma][respostaValor]++;
                    // QTDO Respostas e Pontuação por Pergunta
                    dadosFormatados[0][pergunta_id].quantResposta++;
                    dadosFormatados[0][pergunta_id].pontuacao += respostaValor;
                    // QTDO Respostas e Pontuação por Nivel
                    dadosFormatados[0][pergunta_id].nivel[nivel].quantResposta++;
                    dadosFormatados[0][pergunta_id].nivel[nivel].pontuacao += respostaValor;
                    // QTDO Respostas e Pontuação por materia
                    dadosFormatados[0][pergunta_id].nivel[nivel].materias[materia].quantResposta++;
                    dadosFormatados[0][pergunta_id].nivel[nivel].materias[materia].pontuacao += respostaValor;
                }else{
                    dadosFormatados[0][pergunta_id].respostas.push(resposta);
                }
            });

            let resumoPerguntas = calcularResumoPerguntas(dadosFormatados)
            dadosFormatados[1] = resumoPerguntas;

            let resumoNiveis = calcularResumoNiveis(dadosFormatados)
            dadosFormatados[2] = resumoNiveis;

            let resumoDisciplinas = calcularResumoDisciplinas(dadosFormatados);
            dadosFormatados[3] = resumoDisciplinas;

            return(dadosFormatados);
        } catch (error) {
            console.error(error);
        }

    }

    async create(req,res){
        try {
            const { respostas, formularioId, userId } = req.body;
        
            // Primeiro insert na tabela 'respostas'
            const { error: respostasError } = await supabase
                .from('respostas')
                .insert(respostas);
        
            if (respostasError) {
                console.error('Erro ao inserir respostas:', respostasError);
                throw new AppError("Erro ao salvar respostas.", 500)
            }
        
            // Segundo insert na tabela 'registro_aluno_formulario'
            const { error: registroError } = await supabase
                .from('registro_aluno_formulario')
                .insert({ idFormulario:formularioId, idUsuario:userId });
        
            if (registroError) {
                console.error('Erro ao inserir registro do aluno:', registroError);
                throw new AppError("Erro ao salvar registro do aluno.", 500)
            }
        
            // Retorno de sucesso caso ambos os inserts tenham sido bem-sucedidos
            return res.code(200).send( 'Dados salvos com sucesso!');
        } catch (error) {
            console.error('Erro no processamento do endpoint:', error);
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }

    }
}

export default RespostasController;

function calcularResumoPerguntas(dadosFormatados){

    //CALCULANDO AS MEDIAS DAS PERGUNTAS
    //Medias por pergunta
    let resultados = {};
    //medias total perguntas
    let quantRespostaTotal = 0;
    let pontuacaoTotal = 0;
    let mediaTotal = 0;
    let percentualTotal = 0;
    let indice = 0;
    
    for (let perguntaId in dadosFormatados[0]) {
        if (perguntaId !== "7") {
            let pergunta = dadosFormatados[0][perguntaId];
            let media = (+pergunta.pontuacao / +pergunta.quantResposta).toFixed(2);
            let percentual = ((+pergunta.pontuacao/(+pergunta.quantResposta*4))*100).toFixed(2);
            
            resultados[perguntaId] = {
            id: `Q${perguntaId}`,
            quantResposta: pergunta.quantResposta,
            pontuacao: pergunta.pontuacao,
            media: media,
            percentual: percentual
            };

            //Incrementando no Total
            quantRespostaTotal += pergunta.quantResposta;
            pontuacaoTotal += pergunta.pontuacao;
            mediaTotal += +media;
            percentualTotal+= +percentual;
            indice++;
        } else {
            
        }    
    }

    resultados["Total"] = {
        id: `Total`,
        quantResposta: quantRespostaTotal,
        pontuacao: pontuacaoTotal,
        media: (mediaTotal/indice).toFixed(2),
        percentual: (percentualTotal/indice).toFixed(2),
    }

    return(resultados)

}
function calcularResumoNiveis(dadosFormatados){
    //Medias por Nivel
    let resultados = {};
    //medias total Niveis
    let quantRespostaTotal = 0;
    let pontuacaoTotal = 0;
    let mediaTotal = 0;
    let percentualTotal = 0;
    let indice = 0;
    
    for (let perguntaId in dadosFormatados[0]) {
        if (perguntaId !== "7") {
            let niveis = dadosFormatados[0][perguntaId]["nivel"];
            for (const nivelNome in niveis) {
                let nivel = dadosFormatados[0][perguntaId]["nivel"][nivelNome];

                if(resultados[nivelNome]){
                    resultados[nivelNome].quantResposta += nivel.quantResposta;
                    resultados[nivelNome].pontuacao += nivel.pontuacao;
                }else{
                    resultados[nivelNome] = {
                    id: nivelNome,
                    quantResposta: nivel.quantResposta,
                    pontuacao: nivel.pontuacao,
                    };
                }
            }
        } else {
        }    
    }

    for (let resultadoNivel in resultados){
        let resultado = resultados[resultadoNivel];
        let media = (+resultado.pontuacao / +resultado.quantResposta).toFixed(2);
        let percentual = ((+resultado.pontuacao/(+resultado.quantResposta*4))*100).toFixed(2);
        resultados[resultadoNivel].media = media;
        resultados[resultadoNivel].percentual = percentual;

        //INCREMENTANDO NO TOTAL
        //Incrementando no Total
        quantRespostaTotal += resultado.quantResposta;
        pontuacaoTotal += resultado.pontuacao;
        mediaTotal += +media;
        percentualTotal+= +percentual;
        indice++;
    }
    
    

    resultados["Total"] = {
        id: `Total`,
        quantResposta: quantRespostaTotal,
        pontuacao: pontuacaoTotal,
        media: (mediaTotal/indice).toFixed(2),
        percentual: (percentualTotal/indice).toFixed(2),
    }

    return(resultados)

}
function calcularResumoDisciplinas(dadosFormatados){
    //Medias por Disciplina
    let resultados = {};
    //medias total Disciplina
    let quantRespostaTotal = 0;
    let pontuacaoTotal = 0;
    let mediaTotal = 0;
    let percentualTotal = 0;
    let indice = 0;
    
    for (let perguntaId in dadosFormatados[0]) {
        if (perguntaId !== "7") {
            let niveis = dadosFormatados[0][perguntaId]["nivel"];
            for (const nivelNome in niveis) {
                let disciplinasDoNivel = dadosFormatados[0][perguntaId]["nivel"][nivelNome]["materias"];
                for (const nomeDisciplina in disciplinasDoNivel) {
                    let disciplina = dadosFormatados[0][perguntaId]["nivel"][nivelNome]["materias"][nomeDisciplina];

                    
                    if(resultados[nomeDisciplina]){
                        resultados[nomeDisciplina].quantResposta += disciplina.quantResposta;
                        resultados[nomeDisciplina].pontuacao += disciplina.pontuacao;
                    }else{
                        resultados[nomeDisciplina] = {
                        id: nomeDisciplina,
                        quantResposta: disciplina.quantResposta,
                        pontuacao: disciplina.pontuacao,
                        };
                    }


                }  
            }
        } else {}    
    }

    for (let resultadoDisciplina in resultados){
        let resultado = resultados[resultadoDisciplina];
        let media = (+resultado.pontuacao / +resultado.quantResposta).toFixed(2);
        let percentual = ((+resultado.pontuacao/(+resultado.quantResposta*4))*100).toFixed(2);
        resultados[resultadoDisciplina].media = media;
        resultados[resultadoDisciplina].percentual = percentual;

        //INCREMENTANDO NO TOTAL
        //Incrementando no Total
        quantRespostaTotal += resultado.quantResposta;
        pontuacaoTotal += resultado.pontuacao;
        mediaTotal += +media;
        percentualTotal+= +percentual;
        indice++;
    }
    
    

    resultados["Total"] = {
        id: `Total`,
        quantResposta: quantRespostaTotal,
        pontuacao: pontuacaoTotal,
        media: (mediaTotal/indice).toFixed(2),
        percentual: (percentualTotal/indice).toFixed(2),
    }

    return(resultados)

}