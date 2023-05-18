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

// router.get('/:id', (_req: Request, _res: Response) => {});

// router.get('/:id/file ', (_req: Request, _res: Response) => {});

router.post('/', async (_req: Request, _res: Response) => 
{
    const body: string | number = _req.body.query;
    try
    {
        let result: AxiosResponse | any = await axios.get(`https://swapi.dev/api/films/${body}`);
        result = result.data;
        let data: [number, string, string] = [result.episode_id,result.title,result.release_date];
        let query = await client.query(`SELECT id FROM favorites where id = (${body}::int) or title = (${body}::varchar)`).then(res => res.rows[0]);
        if(!query)
        {
            console.log(1)
            client.query(`insert into favorites("id", "title", "releaseDate") values(${data[0]}, "${data[1]}", "${data[2]}")`)
            console.log(2)
            _res.status(200).json({
                status: "success",
                query: body,
                result: data});
            console.log(3)
        }
        else
        {
            _res.status(400).json({
                status: "error",
                message: "bad request",
                query: body
            });
        }
    }
    catch(err)
    {
        _res.status(404).json({
            status: "error",
            message: "bad request",
            query: body
        });
    }
});

// Kozak brachu😎😎
//       /|\        
//      / | \       
//     /  |  \      
//    /   |   \     
//   /""""|""""\    
//  /     |     \   