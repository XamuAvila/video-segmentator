import express from 'express';
import dotenv from 'dotenv';
import initRoutes from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());

initRoutes(app)

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log("App listening on " + PORT)
})
