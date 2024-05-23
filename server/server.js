import 'dotenv/config'
import express from 'express';
import cors from 'cors'
import mysql from 'mysql2'

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res)=>{
    res.json("Hello...");
})

app.listen(PORT, ()=>{console.log(`Server running at http://loalhost:${PORT}`)});