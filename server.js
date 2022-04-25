const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const mysql = require('mysql');
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool  = mysql.createPool({
    connectionLimit    : 10,
    host               : 'localhost',
    user               : 'root',
    password           : '',
    database           : 'laravel',
    multipleStatements : true
})


app.get('/', (req, res) => { // Pegar todos os livros
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * from book', (err, rows) => {
            connection.release();
            if (!err) {
                res.json(rows);
            } else {
                res.json(err)
            }
        })
    })
})
app.get('/:id', (req, res) => { // Pegar um livro
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM book WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json(rows);
            } else {
                console.log(err)
            }
        })
    })
});
app.post('', (req, res) => { // Novo livro

    pool.getConnection((err, connection) => {
        if(err) throw err

        const params = req.body
        connection.query('INSERT INTO book SET ?', params, (err, rows, fields) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json(rows);
            } else {
                console.log(err)
            }
        })
    })
});
app.put('/:id', (req, res) => { // Atualizar um livro
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('UPDATE book SET title = ?, pages = ?, price = ?, id_user = ? WHERE id = ?',
            [req.body.title, req.body.pages, req.body.price, req.body.id_user, req.params.id], (err, rows) => {
            connection.release();

            if(!err) {
                res.json(rows);
            } else {
                res.json(err);
            }
        })
    })
});


app.delete('/:id', (req, res) => { // Deletar um livro

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM book WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() // return the connection to pool
            if (!err) {
                res.json(rows);
            } else {
                res.json(err);
            }
        })
    })
});




// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))