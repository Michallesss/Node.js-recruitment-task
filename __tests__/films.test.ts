import supertest from "supertest";
import { app } from '../app';

describe('films', () => {
    describe('get all films', () => {
        it('should return 404', async () => {
            await supertest(app).get(`/films`).expect(200);
        });
    });
    
    describe('get one film', () => {
        describe('given the film does not exist', () => {
            it('should return 404', async () => {
                const filmId='im about to blow';
                
                await supertest(app).get(`/films/${filmId}`).expect(404);
            });
        });
        describe('given the film does exist', async () => {
            it('should return 200 (remember to have at least one test data)', async () => {
                const filmId=1;
    
                await supertest(app).get(`/films/${filmId}`).expect(200);
            });
        });
    });
});