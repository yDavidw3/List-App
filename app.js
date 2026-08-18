const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const port = 8081;

app.use(cookieParser());
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

const temas = {
    claro: {bg: '#f5eedd', text: '#212121', nome: 'Claro'},
    escuro: {bg: '#212121', text: '#e8e8e8', nome: 'Escuro'},
};

app.use((req, res, next) => {
    const nomeTema = req.cookies.tema || 'claro';
    const temaAtual = temas[nomeTema] || temas.claro;

    res.locals.tema = temaAtual;
    res.locals.nomeTema = temaAtual.nome;

    next();
});

app.post('/temas', (req, res) => {
    const temaEscolhido = req.body.tema;

    if (temas[temaEscolhido]) {
        res.cookie('tema', temaEscolhido, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });
    }

    res.redirect('/config');
});
app.get('/', (req, res) => {
    res.render('index', {

    });
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        
    });
});

app.get('/config', (req, res) => {
    res.render('config', {
        mensagem: null
    });
});

app.get('/sobre', (req, res) => {
    res.render('sobre', {
        mensagem: null
    });
});

app.get('/login', (req, res) => {

    res.render('login', {
        mensagem: null
        
    });
});

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

app.get('/cadastro', (req, res) => {

    res.render('cadastro', {
        mensagem: null
        
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

app.get('/sobrenos', (req, res) => {

    res.render('sobre', {
        mensagem: null
        
    });
});




app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}`);
})
