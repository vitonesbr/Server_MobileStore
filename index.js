const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// configuração bodyparser
app.use(bodyParser.json());

// configuração do CORS para aceita varios protocolos de requisição
const configCors = {
    origin:"*",
    optionSuccessStatus:200
}

// configuração da comunicação com o banco de dados mongodb
mongoose.connect("mongodb+srv://vitones:vitor123@appnode.cuxup.mongodb.net/AppNode?retryWrites=true&w=majority", {useNewUrlParser:true,useUnifiedTopology:true});

// construção da tabela produtos
const tbproduto = mongoose.Schema({
    nomeproduto:String,
    descricao:String,
    quantidade:Number,
    preco:String,
    foto:String
});

// construção do modelo de tabela no mongoDB
const Produto = mongoose.model("produto",tbproduto)

// criação dos end points para o modelo produto.
// vamos iniciar com a rota para efetuar o cadastro dos produtos

// verbo POST
app.post("/produto/cadastro",cors(configCors),(req,res)=>{
    const dados = new Produto(req.body);
    dados.save().then(()=>{
        res.status(201).send({rs:"produto cadastrado com sucesso!"});
    }).catch((cachorroDoido)=>console.error(`erro ao tentar cadastrar :/${cachorroDoido}`))
});

//  Verbo GET
app.get("/produto/listar",cors(configCors),(req,res)=>{
    Produto.find((erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`Ocorreu um erro ao tentar listar :/ ${erro}`});
            return;
        }
        res.status(200).send({rs:dados});
    })
});

// verbo GET por ID
app.get("/produto/codproduto/:id",cors(configCors),(req,res)=>{
    Produto.findById(req.params.id,(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`erro ao tentar consultar produto :/ ${erro}`});
            return;
        }
        res.status(200).send({rs:dados});
    });
});

// verbo GET por NOME
app.get("/produto/nomeproduto/:nome",cors(configCors),(req,res)=>{
    Produto.find({nomeproduto:req.params.nome},(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`erro ao tentar consultar o produto :/ ${erro}`});
            return;
        }
        res.status(200).send({rs:dados});
    });  
});

// verbo PUT
app.put("/produto/atualizar/:id",cors(configCors),(req,res)=>{
    Produto.findByIdAndUpdate(req.params.id,req.body,(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`erro ao tentar atualizar :/ ${erro}`});
            return;        
        }
        res.status(200).send({rs:"produto atualizado!"});
    });

});

// verbo DELETE
app.delete("/produto/deletar/:id",cors(configCors),(req,res)=>{
    Produto.findByIdAndDelete(req.params.id,(erro,dados)=>{
        if(erro){
            res.status(400).send({rs:`erro ao tentar deletar :/ ${erro}`});
            return;        
        }
        res.status(204).send({rs:"produto deletado!"});
    });
});




app.listen("3000",()=>console.log("servidor online na porta 3000"));