import express from 'express';
import multer from 'multer';
import { saveVideo } from '../controllers/video.controller.js';
const router = express.Router();

const upload = multer({ dest: './src/uploads' });

const initRoutes = (app)=>{
    router.post('/', [upload.single('video'), saveVideo])
    app.use(router);
}

export default initRoutes;
