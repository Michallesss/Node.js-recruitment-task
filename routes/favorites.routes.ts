import express, {Request, Response, NextFunction} from 'express';
const router=express.Router();
export default router;
import axios, { AxiosResponse } from 'axios';
import { QueryResult } from 'pg';
import client from '../app';


router.get('/', async (_req: Request, _res: Response) => { // TODO: make it works
    let [favoritesResult, favoritesError]: any=await client.query(`SELECT *, '' as characters FROM favorites`)
    .then((res: QueryResult) => [res.rows, null])
    .catch((err: Error) => [null, err]);
    if(favoritesError) return _res.status(500).json({
        "status":"error",
        "message":"500 internal server error",
    });
    if(!favoritesResult) return _res.status(404).json({
        "status":"error",
        "message":"404 not found",
    });
    
    await favoritesResult.forEach(async (fav: any, index: number) => {
        const [charactersResult, charactersError]: any=await client.query(`SELECT characters.link FROM characters JOIN characters_favorites ON characters_favorites.characters_id=characters.id JOIN favorites ON favorites.id=characters_favorites.favorites_id WHERE favorites.id=${fav.id}`)
        .then((res: QueryResult) => [res.rows, null])
        .catch((err: Error) => [null, err]);
        if(charactersError) return _res.status(500).json({
            "status":"error",
            "message":"500 internal server error",
        });
        if(!charactersResult) return _res.status(404).json({
            "status":"error",
            "message":"404 not found",
        });

        // fav['characters']=charactersResult; // ! DOESN'T UPDATEEEE 
        // favoritesResult[index]['characters']=charactersResult; // ? WHY IT DOESN'T UPDATE
        // await console.log(fav); // * test
    });
    
    // await console.log(favoritesResult); // * test
    return _res.status(200).json({
        "status": "success",
        "message": "mamy to",
        "date": favoritesResult,
    });
});

router.get('/:id', async (_req: Request, _res: Response) => {
    const [ favoritesResult, favoritesError ]: any=await client.query(`SELECT *, '' as characters FROM favorites WHERE id=${_req.params.id}`)
    .then((res) => [res.rows, null])
    .catch((err) => [null, err]);
    if(favoritesError) return _res.status(500).json({
        "status":"error",
        "message":"500 internal server error",
    });
    if(!favoritesResult) return _res.status(404).json({
        "status":"error",
        "message":"404 not found",
    });

    const [ charactersResult, charactersError ]: any=await client.query(`SELECT characters.link FROM characters JOIN characters_favorites ON characters_favorites.characters_id=characters.id JOIN favorites ON favorites.id=characters_favorites.favorites_id WHERE favorites.id=${_req.params.id}`)
    .then((res) => [res.rows, null])
    .catch((err) => [null, err]);
    if(charactersError) return _res.status(500).json({
        "status":"error",
        "message":"500 internal server error",
    });
    if(!charactersResult) return _res.status(404).json({
        "status":"error",
        "message":"404 not found",
    });

    return _res.status(200).json({
        status: "success",
        message: "mamy to",
        data: {
            film: favoritesResult,
            characters: charactersResult,
        },
    });
});

router.get('/:id/file ', async (_req: Request, _res: Response) => {
    const [ favoritesResult, favoritesError ]: any=await client.query(`SELECT *, '' as characters FROM favorites WHERE id=${_req.params.id}`)
    .then((res) => [res.rows, null])
    .catch((err) => [null, err]);
    if(favoritesError) return _res.status(500).json({
        "status":"error",
        "message":"500 internal server error",
    });
    if(!favoritesResult) return _res.status(404).json({
        "status":"error",
        "message":"404 not found",
    });

    const [ charactersResult, charactersError ]: any=await client.query(`SELECT characters.link FROM characters JOIN characters_favorites ON characters_favorites.characters_id=characters.id JOIN favorites ON favorites.id=characters_favorites.favorites_id WHERE favorites.id=${_req.params.id}`)
    .then((res) => [res.rows, null])
    .catch((err) => [null, err]);
    if(charactersError) return _res.status(500).json({
        "status":"error",
        "message":"500 internal server error",
    });
    if(!charactersResult) return _res.status(404).json({
        "status":"error",
        "message":"404 not found",
    });

    // TODO: make it excel file
});

router.post('/', async (_req: Request, _res: Response) => 
{
    const value: string | number=await _req.body.id || _req.body.movie;
    const film: AxiosResponse=await axios.get(`https://swapi.dev/api/films/${value}`);
    
    // ...
});