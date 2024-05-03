const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const whitelist = require("./whitelist")
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const dbPool = mysql.createPool(dbConfig);

function handlePoolError(pool, name) {
    pool.on('error', (err) => {
        console.error(`Error in ${name}: ${err}`);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_PACKETS_OUT_OF_ORDER') {
            console.log(`Attempting to reconnect to ${name}...`);
        } else {
            throw err;
        }
    });
};

handlePoolError(dbPool, 'db');

function executeQuery(query, values, callback) {
    dbPool.getConnection((err, connection) => {
        if(err) {
            return callback(err, null)
        }
        connection.query(query, values, (err, results) => {
            connection.release();
            callback(err, results);
        });
    });
}


app.get('/vms', whitelist);
app.post('/vms/create');
app.delete('/vms/delete/:id', whitelist)

app.get('/vms', (req, res) => {
    const sql = "SELECT * FROM vm;";
    executeQuery(sql, [], (err, data) => {
        if(err) return res.status(500).json("Error retrieving vm data.");
        return res.status(200).json(data);
    })
})

app.post('/vms/create', (req, res) => {
    const { name, operating_system, purpose, additional_notes } = req.body;
    const values = [name, operating_system, purpose, additional_notes];
    const sql = "INSERT INTO vm (name, operating_system, purpose, additional_notes) VALUES (?, ?, ?, ?);";
    executeQuery(sql, values, (err, data) => {
        if(err) return res.status(500).json("Error creating vm.");
        return res.status(200).json("VM created successfully.");
    
    })
})

app.delete('/vms/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM vm WHERE id = ?;";
    executeQuery(sql, [id], (err, data) => {
        if(err) return res.status(500).json("Error deleting vm.");
        return res.status(200).json("VM deleted successfully.");
    })
})


app.listen(port, () => {
    console.log("listening on port " + port + ".");
});

