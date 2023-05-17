import express, {Request, Response, NextFunction} from 'express';
import axios, { AxiosResponse } from 'axios';
const router=express.Router();
export default router;

// router.get('/', (_req: Request, _res: Response) => {});

// router.get('/:id', (_req: Request, _res: Response) => {});

// router.get('/:id/file ', (_req: Request, _res: Response) => {});

router.post('/', (_req: Request, _res: Response) => {
    const body: string | number = _req.body.query;
    
    if(typeof(body)==='string') {
        _res.status(200).json({status: "success",query: body});
    } else {
        _res.status(200).send(`ID: ${body}`);
    }
});
// Kozak brachu😎😎