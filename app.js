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

app.listen(port, () => {
    console.log(`O servidor está rodando na porta ${port}`);
})

