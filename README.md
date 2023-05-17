# Node.js recruitment task <!-- https://www.geeksforgeeks.org/how-to-use-express-in-typescript/ -->

Your task is to create a project in Node.js using TypeScript. The project aims to test your knowledge on many levels in the field of back-end development. The compliance of the project with the task description, the way of using libraries, knowledge of good programming practices and code cleanliness will be assessed.

## 1. Create a repository
Create a public repository in any Git provider you like (eg GitHub, GitLab, Bitbucket) to which you will commit changes to your project. You will need this as you will send us the url of your project.

## 2. Initialize the project
The task is going to be simple, so we would like you not to use biolerplates. You will need the LTS version of Node.js. We encourage you to use TypeScript. We would like you to use Express and use the ORM library of your choice with PostgreSQL database. In the project you will create a REST API and you will have to consume external public API.

## 3. The task
Create an API service that will consist of the following endpoints:

| Method | URI                 |
|--------|---------------------|
| GET    | /films              |
| POST   | /favorites          |
| GET    | /favorites          |
| GET    | /favorites/:id      |
| GET    | /favorites/:id/file |

### GET /films
This endpoint will be responsible for reading the video list from the public API (https://swapi.dev). In response, it is to send the user a processed list of films containing the release date, title and identifier with which it will be possible to read individual items.

### POST /favorites
In the body of this request, the user can provide any number of movie IDs obtained with the previous query and any name for the list. As a result, an element describing the list is to be created in the database, the service is to read the details of each of these movies and save them in the database. Please note that items cannot be duplicated in the database. The information to save is the release dates, titles and the list of characters in the film. Characters are also allowed to appear in the database only once.

### GET /favorites
The result of this query is to be a list of all lists added with the previous request (ID in the database and previously given name). Creating a pagination and searching by name will be an additional advantage.

### GET /favorites/:id
This endpoint is supposed to take as a parameter the ID of the list in the database and return the details and elements of the favorite list (ID, name, movie list and character list for each movie).

### GET /favorites/:id/file
The last endpoint is supposed to send the favorites list details as an Excel file. The first column should contain a distinct list of characters appearing in the movies included in a given favorite list, the second column should contain the movie titles separated by a comma, but only those that are in the given favorite list.

## 4. For the ambitious
The following steps are not required, but will positively affect the recruitment process:

* Writing unit tests
* Running the project on any hosting (Netlify, Heroku or whatever, it can even be VPS)

## 5. That's it!
Send us a link and we'll meet to discuss your creation