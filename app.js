const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8081;

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

app.get('/sobre', (req, res) => {
    const temaEscolhido = req.cookies.meuTema || 'claro';

    res.render('sobre', {
        cores: temas[temaEscolhido],
        temaAtual: temaEscolhido,
        mensagem: null
    });
});

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


app.get('/salvar-tema', (req, res) => {
    const novoTema = req.query.tema;
    res.cookie('meuTema', novoTema,{
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        path: '/'
        
    });
    res.redirect('/config');
})




app.post('/dadosEnviados', (req, res) => {

    
    const email = req.body.email;
    const senha = req.body.senha;

    const emailCorreto = "joazinhodasilva@gmail.com"
    const senhaCorreto = "12345678"

        if(email == emailCorreto && senha == senhaCorreto ) {

            res.redirect('/dashboard');

        } else {
            const mensagem = "* E-mail ou senha incorretos."
            res.render("login", { mensagem });
            
        }

    app.get('/dashboard', (req, res) => {

        res.render('dashboard', {
            mensagem: null
        });
});
    
});

app.post('/dadosEnviadosCadastro', (req, res) => {

    
    const confirmarSenha= req.body.confirmarSenha;
    const senha = req.body.senha;


        if(senha.length < 8) {

             const mensagem = "* A senha deve conter no mínimo 8 caracteres"
               return res.render("cadastro", { mensagem });

        } 
        
        if(senha!== confirmarSenha){
            const mensagem = "* As senhas não coincidem"
                return res.render("cadastro", { mensagem })
        }

        else {
           
            res.redirect('/dashboard');
        }
});

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
