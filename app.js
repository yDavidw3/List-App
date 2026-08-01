const express = require('express');
const app = express();
const port = 8081;

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('index', {

    });
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        
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


app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}`);
})
