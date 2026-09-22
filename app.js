const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8081;

//MONGO DB
const mongoose = require('mongoose');
const Mongo_url = "mongodb://localhost:27017/dbListApp";
//MONGO DB

//COOKIE
app.use(cookieParser());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

const temas = {
    escuro: {bg: '#111111', color: '#e8e8e8', sidebarBg: '#222222', sidebarColor: '#e8e8e8'},
    claro: {bg: '#f5eedd', color: '#0e0e0e', sidebarBg: '#eae2d1', sidebarColor: '#0e0e0e'},
};

app.get('/', (req, res) => {
    const temaEscolhido = req.cookies.meuTema || 'claro';

    res.render('index', { 
        cores: temas[temaEscolhido],
        temaAtual: temaEscolhido
    });
});
//COOKIE

//DASHBOARD E CONFIG
app.get('/dashboard', (req, res) => {
    const temaEscolhido = req.cookies.meuTema || 'claro';

    res.render('dashboard', { 
        cores: temas[temaEscolhido],
        temaAtual: temaEscolhido
    });
});

app.get('/config', (req, res) => {
    console.log("teste cookie", req.cookies);
    const temaEscolhido = req.cookies.meuTema || 'claro';

    res.render('config', {
        cores: temas[temaEscolhido],
        temaAtual: temaEscolhido,
        mensagem: null
    });
});
//DASHBOARD E CONFIG

//SOBRE
app.get('/sobre', (req, res) => {
    const temaEscolhido = req.cookies.meuTema || 'claro';

    res.render('sobre', {
        cores: temas[temaEscolhido],
        temaAtual: temaEscolhido,
        mensagem: null
    });
});
//SOBRE




app.get('/salvar-tema', (req, res) => {
    const novoTema = req.query.tema;
    res.cookie('meuTema', novoTema,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: '/'
        
    });
    res.redirect('/config');
})

//LOGIN E CADASTRO
mongoose.connect(Mongo_url)
.then(() => console.log('Conectado ao MongoDB com sucesso!'))
.catch((err) => console.error('Erro ao conectar com o MongoDB:', err ));

const usuarioSchema  = new mongoose.Schema({
    email: {type: String, required: true},
    senha: {type: String, required: true},
})

const UsuarioLogin = mongoose.model('UsuarioLogin', usuarioSchema, 'usuario');

    


app.get('/login', (req, res) => {
    const temaEscolhido = req.cookies.meuTema || 'claro';

    res.render('login', {
        cores: temas[temaEscolhido],
        temaAtual: temaEscolhido,
        mensagem: null
    });
});

app.get('/cadastro', (req, res) => {
    const temaEscolhido = req.cookies.meuTema || 'claro';

    res.render('cadastro', {
        cores: temas[temaEscolhido],
        temaAtual: temaEscolhido,
        mensagem: null
    });
});

app.post('/dadosEnviados', async (req, res) => {

    
    const email = req.body.email;
    const senha = req.body.senha;

    const usuario = await UsuarioLogin.findOne({
        email: email,
        senha: senha
    })


        if(usuario) {

            res.redirect('/dashboard');

        } else {
            const temaEscolhido = req.cookies.meuTema || 'claro';
            const mensagem = "* E-mail ou senha incorretos."
            res.render("login", { 
                cores: temas[temaEscolhido],
                temaAtual: temaEscolhido,
                mensagem
             });
            
        }

   
});
    
app.post('/dadosEnviadosCadastro', async  (req, res) => {

    
    const confirmarSenha = req.body.confirmarSenha;
    const email = req.body.email;
    const senha = req.body.senha;
    const temaEscolhido = req.cookies.meuTema || 'claro';

        if(senha.length < 8) {

             const mensagem = "* A senha deve conter no mínimo 8 caracteres"
               return res.render("cadastro", { 
                cores: temas[temaEscolhido],
                temaAtual: temaEscolhido,
                mensagem
             });

        } 
        
        if(senha!== confirmarSenha){
            const mensagem = "* As senhas não coincidem"
                return res.render("cadastro", { 
                    mensagem,
                    cores: temas[temaEscolhido],
                    temaAtual: temaEscolhido,
                 });
        }

        const emailExistente =  await UsuarioLogin.findOne({
            email: email
        });

        if(emailExistente) {
            const mensagem = "* O email já cadastrado em nosso sistema!"
                return res.render("cadastro", { 
                    mensagem,
                    cores: temas[temaEscolhido],
                    temaAtual: temaEscolhido,
                 });

        }

          else {

            await UsuarioLogin.create({
                email: email,
                senha: senha
            })


           
            res.redirect('/dashboard');
        }



      
});
//LOGIN E CADASTRO

app.use((req, res)  => {
    res.status(404)
    res.render('404')
});

app.use((err, req, res, next) => {
    console.error(err.message)
    res.status(500)
    res.render('500')
});

app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
})
