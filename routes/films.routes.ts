import express, {Request, Response, NextFunction} from 'express';
const router=express.Router();
export default router;
import axios, { AxiosResponse } from 'axios';
import Film from '../interfaces/interfaces'

router.get('/', async (_req: Request, _res: Response) => {
    try {
        const result: AxiosResponse = await axios.get('https://swapi.dev/api/films/');
        const films: [Film] = result.data;
        return _res.status(200).json({
            status: "success",
            message: "mamy to",
            data: films
        });
    } catch(error) {
        console.error(error)
        _res.status(500).json({
            status: "error",
            message: "Internal server error 500",
        });
    }
});

router.get('/:id', async (_req: Request, _res: Response) => {
    try {
        const id: string = _req.params.id;
        const result: AxiosResponse = await axios.get(`https://swapi.dev/api/films/${id}/`);
        const films: [Film] = result.data;
        return _res.status(200).json({
            status: "success",
            message: "mamy to",
            data: films
        });
    } catch(error) {
        console.error(error)
        _res.status(500).json({
            status: "error",
            message: "Internal server error 500",
        });
    }
});