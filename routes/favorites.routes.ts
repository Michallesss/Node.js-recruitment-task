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
    try { 
        const value: any = _req.body.value;
        let result: AxiosResponse | any;
        if(typeof value==='string') {
            const temp=await axios.get(`https://swapi.dev/api/films?search=${value}`);
            result=temp.data.results[0];
        } 
        else if(typeof value==='number') {
            const temp=await axios.get(`https://swapi.dev/api/films/${value}`);
            result=temp.data;
        }
        else return _res.status(400).json({
            status: "success",
            message: "bad request (body value must be string or number)"
        });

        const favoritesSelect=await client.query(`SELECT id FROM favorites WHERE id='${value}' OR title='${value}'`)
        .then((res) => res.rowCount);
        if(favoritesSelect<=0) {
            await client.query(`INSERT INTO favorites("id", "title", "releaseDate") VALUES (${result.episode_id}, '${result.title}', '${result.release_date}')`)
            await result.characters.forEach(async (character: any) => {
                const character_id=await character.split('/')[character.split('/').length-2];
                const charactersSelect=await client.query(`SELECT id FROM characters WHERE id=${character_id}`).then((res) => res.rowCount);
                if(charactersSelect<=0) {
                    await client.query(`INSERT INTO characters("id","link") VALUES (${character_id},${character})`);
                    await client.query(`INSERT INTO characters_favorites("favorites_id","characters_id") VALUES (${result.episode_id},${character_id})`);
                }
            });

            return _res.status(200).json({
                status: 'success',
                message: 'Saved to db'
            });
        } else {
            return _res.status(400).json({
                status: 'error',
                message: 'Film already exist in your favorites'
            });
        }
    } catch(error) {
        console.error(error)
        _res.status(404).json({
            status: "error",
            message: "Internal server error 500",
        });
    }
});