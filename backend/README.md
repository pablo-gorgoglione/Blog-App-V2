## Backend

Made with Express and TypeScript

### Features

- User CRUD
- Posts CRUD for admin
- Admin user management
- Admin post managment
- Comments on the posts
- Likes on the posts and comments
- Database seeder (user and posts)
- Two possible state for posts, published and notpublished.
- post pagination

What i used:

- JsonWebToken(JWT)
- asyncHandler
- custom errorHandler
- tests (jest, supertest)
- mongoose (ORM)
- bcrypt (used to hash the password)

With the files is a json to import a complete Postman collection.

It also includes endpoints test made with jest and supertest.

### How to use the Postman collection:

- first import to postman the .json
- send the User/register request
  > you can choose to change the isAdmin field, by default is true so it create an admin user
- send the login request
  > this will save the token to make the others request
- send the post Post request
  > this will save the post id into a collection variable

Then you can create comments, likes, change username data.

> sending GET /posts?page=1&limit=5 will set the post_id to the first post on the array of the response

> sending GET /users/ will set the user_id to the first user on the array of the response
