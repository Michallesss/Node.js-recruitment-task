import express, {Request, Response, NextFunction} from 'express';
const router=express.Router();
export default router;
import axios, { AxiosResponse } from 'axios';
import { QueryResult } from 'pg';
import { client } from '../app';
import xlsx from 'xlsx';


router.get('/', async (_req: Request, _res: Response) => {
    try {
        let [favoritesResult, favoritesError]: any=await client.query(`SELECT *, '' as characters FROM favorites`)
        .then((res: QueryResult) => [res.rows, null])
        .catch((err: Error) => [null, err]);
        if(favoritesError) return _res.status(500).json({
            status:"error",
            message:"500 internal server error",
        });
        if(!favoritesResult) return _res.status(404).json({
            status:"error",
            message:"404 not found",
        });
        
        const updatedFavoritesResult = [];
        for (const fav of favoritesResult) {
            const [charactersResult, charactersError] = await client.query(`SELECT characters.link FROM characters JOIN characters_favorites ON characters_favorites.characters_id=characters.id JOIN favorites ON favorites.id=characters_favorites.favorites_id WHERE favorites.id=${fav.id}`)
            .then((res: QueryResult) => [res.rows, null])
            .catch((err: Error) => [null, err]);
            
            if(charactersError) return _res.status(500).json({
                status: "error",
                message: "500 internal server error",
            });
    
            if(!charactersResult) return _res.status(404).json({
                status: "error",
                message: "404 not found",
            });

            fav['characters']=charactersResult;
            updatedFavoritesResult.push(fav);
        }
        
        return _res.status(200).json({
            status: "success",
            message: "mamy to",
            data: updatedFavoritesResult,
        });
        
        // console.log(favoritesResult); // * test
        // return _res.status(200).json({
        //     status: "success",
        //     message: "mamy to",
        //     data: favoritesResult,
        // });
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
        const [ favoritesResult, favoritesError ]: any=await client.query(`SELECT *, '' as characters FROM favorites WHERE id=${_req.params.id}`)
        .then((res) => [res.rows, null])
        .catch((err) => [null, err]);
        if(favoritesError) return _res.status(500).json({
            status:"error",
            message:"500 internal server error",
        });
        if(!favoritesResult) return _res.status(404).json({
            status:"error",
            message:"404 not found",
        });
    
        const [ charactersResult, charactersError ]: any=await client.query(`SELECT characters.link FROM characters JOIN characters_favorites ON characters_favorites.characters_id=characters.id JOIN favorites ON favorites.id=characters_favorites.favorites_id WHERE favorites.id=${_req.params.id}`)
        .then((res) => [res.rows, null])
        .catch((err) => [null, err]);
        if(charactersError) return _res.status(500).json({
            status:"error",
            message:"500 internal server error",
        });
        if(!charactersResult) return _res.status(404).json({
            status:"error",
            message:"404 not found",
        });
    
        return _res.status(200).json({
            status: "success",
            message: "mamy to",
            data: {
                film: favoritesResult,
                characters: charactersResult,
            },
        });
    } catch(error) {
        console.error(error)
        _res.status(500).json({
            status: "error",
            message: "Internal server error 500",
        });
    }
});

router.get('/:id/file', async (_req: Request, _res: Response) => {
    try {
        const [ favoritesResult, favoritesError ]: any=await client.query(`SELECT * FROM favorites WHERE id=${_req.params.id}`)
        .then((res) => [res.rows, null])
        .catch((err) => [null, err]);
        if(favoritesError) return _res.status(500).json({
            status:"error",
            message:"500 internal server error",
        });
        if(!favoritesResult) return _res.status(404).json({
            status:"error",
            message:"404 not found",
        });
    
        const [ charactersResult, charactersError ]: any=await client.query(`SELECT characters.link FROM characters JOIN characters_favorites ON characters_favorites.characters_id=characters.id JOIN favorites ON favorites.id=characters_favorites.favorites_id WHERE favorites.id=${_req.params.id}`)
        .then((res) => [res.rows, null])
        .catch((err) => [null, err]);
        if(charactersError) return _res.status(500).json({
            status:"error",
            message:"500 internal server error",
        });
        if(!charactersResult) return _res.status(404).json({
            status:"error",
            message:"404 not found",
        });

        const data=[
            favoritesResult,
            charactersResult,
        ];

        const worksheet=xlsx.utils.json_to_sheet(data);
        const workBook=xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(workBook,worksheet,'favorites');
        const buffer = await xlsx.write(workBook, {
            bookType:'xlsx',
            type:'buffer'
        });

        const binary = await xlsx.write(workBook, {
            bookType:'xlsx',
            type:'binary'
        });

        xlsx.writeFile(workBook,'favorites.xlsx');

        return _res.status(200).json({
            status: "success",
            message: "Excel file exported",
        });
    } catch(error) {
        console.error(error)
        _res.status(500).json({
            status: "error",
            message: "Internal server error 500",
        });
    }
});


router.post('/', async (_req: Request, _res: Response) => {
    const value: string | number = _req.body.query;
    try
    {
        let result: AxiosResponse | any;
        typeof(_req.body.query) === 'string' ? result = await axios.get(`https://swapi.dev/api/films?search=${value}`) : result = await axios.get(`https://swapi.dev/api/films/${value}`);
        typeof(_req.body.query) === 'string' ? result = result.data.results[0] : result = result.data;
        let data: [number, string, string] = [result.episode_id,result.title,result.release_date];
        let query = await client.query(`SELECT id FROM favorites where id = (${data[0]}::int)`).then(res => res.rows[0]);
        if(query === undefined)
        {
            client.query(`insert into favorites("id", "title", "releaseDate") values(${data[0]}, '${data[1]}', '${data[2]}');`)
            _res.status(200).json({
                status: "success | list was sent to the database",
                query: value,
                result: data
            });
        }
        else
        {
            _res.status(400).json({
                status: "error",
                message: "bad request | list already in the database",
                query: value
            });
        }
    }
    catch(err)
    {
        console.error(err)
        _res.status(404).json({
            status: "error",
            message: "not found | list does not exists",
        });
    }
});