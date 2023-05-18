import ffmpeg from 'fluent-ffmpeg';
import {exec} from 'node:child_process'
import fs from 'fs';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';


async function saveVideo(req, res, next){
    const tempPath = req.file.path;
    const dateNow = Date.now();
    const folderName = `${req.file.originalname.replace('.mp4', '')}_${dateNow}`;
    const finalFolderPath = path.join(import.meta.url, '..', '..', 'uploads', folderName).replace(/file:(\\+)/g, '').replaceAll('\\', '/');

    mkdirSync(finalFolderPath);

    const finalFilename = standartizeFileName(req.file.originalname, '.mp4', dateNow);

    const metadata = await extractMetadata(tempPath);

    const destFilePath =  `${finalFolderPath}/${finalFilename}`;

    await fs.copyFile(tempPath, destFilePath, ()=>{
        console.log('Done')
    });

    fs.unlinkSync(tempPath);

    await divideVideo(destFilePath, finalFilename, finalFolderPath)

    res.status(200).send('ok');
}

async function divideVideo(videoPath, finalFileName, finalFolderPath){
        const splittedPath = `${finalFolderPath}/splitted`;
        
        mkdirSync(splittedPath);

        const splitTime = '00:00:05';

        const outputPath = `${splittedPath}/${finalFileName}`;

        const shPath = './src/sh/divide.sh';

        const divideExecProcess = await exec(`bash ${shPath} ${videoPath} ${outputPath} ${splitTime}`);

        divideExecProcess.stdout.on('data', (data)=>{
            console.log(data)
        })

        divideExecProcess.on('close', ()=>{
            console.log('Divided successfully');
        })

        divideExecProcess.stderr.on('data', (err)=>{
            console.log(err);
        })
}

async function extractMetadata(videoPath){
    return new Promise((resolve, reject)=>{
        ffmpeg.ffprobe(videoPath, (err, metadata)=>{
            if(err){
                reject(err)
                return;
            }
            resolve(metadata)
        })
    })
}

function standartizeFileName(fileName, ext, dateNow){
    const fileWithoutExt = fileName.replace(ext, '');
    return `${fileWithoutExt}-${dateNow}__%03d.mp4`;
}

export {
    saveVideo
}
