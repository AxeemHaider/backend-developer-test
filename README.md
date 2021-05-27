# backend-developer-test

REST API written in Typescript using Clean Architecture with some modifications

If you have any query please let me know we can discuss it. I comment code very well
so you can understand it easily. Still I can make a lot of improvements in this code
but this not a production level project. If you want improvement in any area I can do
that. Or if you want to made any changes I will do it immediately.

### UpWork profile

[https://www.upwork.com/freelancers/~01c39582606f6c1ae5](https://www.upwork.com/freelancers/~01c39582606f6c1ae5)

### Technologies used

- Node.js
- Typescript
- Express
- SQLite -> For project simplicity I'm using SQLite but it be easy migrate to MySQL/PostgreSQL
  just need to change the `ormconfig.json` that's it.
- TypeORM
- GitHub and GitHub actions for testing
- Mocha and Chai -> for testing
  I'm not using any library to create **mock** repository or something else for testing I just created the two custom **repo** which is used for testing. But I think it is best we use any library, if I have time I will improve the tests.

# Installation and Run

```shell
npm install

npm start
```

# EndPoints

If you want to know what the request body and what will be the response.
You can check the `dto` directory. `src/dto`

### GET /hello

public endpoint anyone can access, register and non-register user

### POST /register

Register new user

### POST /login

Login user.

### GET /users/me

Protected endpoint to get user information. You should have to pass `Bearer Token`

### POST /refresh/token

If access token is expired the endpoint will be used to create new access token
without login again.

This method can be implement in different ways according to use case.

There are two use cases are discussed.

1. User should have to login if he/she is inactive for number of days
2. User should have to re-login after specific number of days

In this method the first use case is implement. Only one refresh token
point to single unique access token when new access token is generated
a new refresh token also generated which is linked to this Access_token
Other use case can also be implemented easily instead of creating new refresh
token we can update the existing refresh token. If we don't not update the
refresh token then there are some security issues we can discuss it if you want

There are also various check apply on refresh token.
For example:

- if access token is not expire then there is no need to refresh it.
- If token is not valid throw exception
- Refresh token should have to point this access token. Single refresh token only points to single unique access token
- If user logged out you can not refresh your access token

### POST /logout

Logout the user, after logout you can not refresh the access token even if you have both
access token and refresh token
