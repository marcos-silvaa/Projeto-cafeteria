// Imports
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Config para URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Ler os dados.json
const dadosFilePath= path.join(__dirname,'dados.json');

// Middlewares

app.use(express.json());
app.use(express.static('public'))

//              ROTAS

// Buscar uma informação

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public','index.html'));
});

// Salvar uma informação

app.post('/salvar',(req,res)=>{
    const dadosParaEnviar = req.body || {};

    console.log('Dados Recebidos',dadosParaEnviar);

    if(!dadosParaEnviar.pedidos || !dadosParaEnviar.total){

        return res.status(400).send('Dados inválidos');
    }

    salvarDados(dadosParaEnviar);
    res.send('Dados salvos com sucesso!')
})



// Funçoes
function lerDados(){
    try{
        const dados = fs.readFileSync(dadosFilePath,'utf-8');
        return JSON.parse(dados);
    } catch(err){
        console.error('Erro ao ler o arquivo', err);
        return [];
    }
}

function salvarDados(novoDado){

    const dados = lerDados();
    dados.push(novoDado);

    try{
        fs.writeFileSync(dadosFilePath,JSON.stringify(dados,null,2), 'utf-8')
        console.log('Dados salvos com sucesso!');
    }catch(err){
        console.error('Erro ao salvar os dados', err);
    }
}

app.get('/ler',(req,res)=>{

    try{
        const dados = lerDados();
        res.json(dados);

    }catch(err){
        res.status(500).send('Erro ao ler os dados')
    }
})




app.listen(PORT,()=>{
    console.log(`Servidor rodando em http://localhost:${PORT}`)
})