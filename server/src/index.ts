import http from 'http';
import path from 'path';
import cors from 'cors';
import express from 'express';

const pathToBuild: string =
    process.env.NODE_ENV === 'dev'
        ? path.join(__dirname, '..', '..', 'client', 'dist')
        : path.join(__dirname, '..', '..', '..', 'client', 'dist');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(pathToBuild));

const server = http.createServer(app);

const PORT = Number(process.env.PORT) || 4000;

server.listen(PORT, () => {
    console.log(`server listening on localhost:${PORT}`);
});


