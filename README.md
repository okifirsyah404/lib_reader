<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<p align="center">This project is a simple REST API built with NestJS, Prisma ORM, and PostgreSQL. It includes user authentication with JWT provided by Passport and CRUD operations for library management. This project purpose is for test internship to <a href="https://partner.dot.co.id/" target="_blank">Dot Partnership</a></p>

## 📐 Design Pattern

In this project, several design patterns are applied to improve the structure, flexibility, and maintainability of the code. These design patterns include:

### 📚 Modular Architecture

The project is divided into several modules, each with specific responsibilities. This approach makes code management easier, increases scalability, and allows new features to be added without disrupting other modules.

### 🗃️ Repository Pattern

The Repository Pattern separates data access logic from business logic. The repository is responsible for interacting with the database and provides methods for CRUD, making the code cleaner and more organized.

### 🎯 Dependency Injection

NestJS has a built-in Dependency Injection system that allows separating dependency creation from business logic. This makes unit testing easier, as well as increasing code flexibility and reusability.

### 📦 DTO (Data Transfer Object)

DTOs are used to define the structure of data sent or received by an API. This ensures data validation and integrity, and helps in the documentation and understanding of the data structures used.

### 🔑 Strategy Pattern

This pattern is used in authentication strategies using passport, making it easy to add or change authentication strategies without having to change the main logic of the application.

## 📖 Documentation

### 🍃 Swagger

Swagger documentation can be viewed after running the app with accessing [docs](http://localhost:3000/docs) or accessing /docs endpoint when you using custom port.

### 📮 Postman Collection

Postman collection can be downloaded from [here](/postman/lib-explorer.postman_collection.json).

## 🚀 Setup

Install required dependency

```bash
$ npm install
```

Copy environment project. Then add configurtion into .env

```bash
$ cp .env.example .env
```

Migrate the database

```bash
$ npm run db:migrate
```

## 🏃 Running the app

Development

```bash
$ npm run start
```

Development - watch

```bash
$ npm run start:dev
```

Production

```bash
$ npm run start:prod
```

## 🧪 Test

Unit Test

```bash
$ npm run test
```

E2E Test

```bash
$ npm run test:e2e
```

Test Coverage

```bash
$ npm run test:cov
```

## 📃 Test Result

### ⚛️ Unit Test

```bash

> lib_reader@0.0.1 test
> jest --config ./jest.config.json

 PASS  src/app/book/repository/book.repository.spec.ts (8.551 s)
 PASS  src/app/auth/repository/auth.repository.spec.ts (8.657 s)
 PASS  src/data/database/service/database.service.spec.ts (8.73 s)
 PASS  src/app/author/service/author.service.spec.ts (8.784 s)
 PASS  src/app/author/repository/author.repository.spec.ts (8.991 s)
 PASS  src/app/book/service/book.service.spec.ts (9.02 s)
 PASS  src/app/auth/service/auth.service.spec.ts (9.343 s)
 PASS  src/app/auth/controller/auth.controller.spec.ts (9.466 s)
 PASS  src/app/book/controller/book.controller.spec.ts (9.7 s)
 PASS  src/app/author/controller/author.controller.spec.ts (9.768 s)

Test Suites: 10 passed, 10 total
Tests:       142 passed, 142 total
Snapshots:   0 total
Time:        10.35 s
Ran all test suites.

```

### 🚩 E2E Test

```bash

> lib_reader@0.0.1 test:e2e
> jest --config ./test/jest-e2e.json

 PASS  test/app.e2e-spec.ts (5.484 s)
 PASS  test/auth.e2e-spec.ts (13.119 s)
 PASS  test/book.e2e-spec.ts (35.356 s)
 PASS  test/author.e2e-spec.ts (36.985 s)

Test Suites: 4 passed, 4 total
Tests:       75 passed, 75 total
Snapshots:   0 total
Time:        37.376 s
Ran all test suites.

```

### Test Coverage

```bash

> lib_reader@0.0.1 test:cov
> jest --coverage --config ./jest-cov.config.json

 PASS  src/app/author/service/author.service.spec.ts (9.939 s)
 PASS  src/app/book/service/book.service.spec.ts (9.974 s)
 PASS  src/app/auth/repository/auth.repository.spec.ts (10.058 s)
 PASS  src/app/author/repository/author.repository.spec.ts (10.137 s)
 PASS  src/app/auth/service/auth.service.spec.ts (10.44 s)
 PASS  src/data/database/service/database.service.spec.ts
 PASS  src/app/book/repository/book.repository.spec.ts
 PASS  src/app/auth/controller/auth.controller.spec.ts (10.955 s)
 PASS  src/app/book/controller/book.controller.spec.ts (11.639 s)
 PASS  src/app/author/controller/author.controller.spec.ts (11.801 s)
 PASS  test/app.e2e-spec.ts
 PASS  test/auth.e2e-spec.ts (17.515 s)
 PASS  test/book.e2e-spec.ts (38.687 s)
 PASS  test/author.e2e-spec.ts (41.905 s)
------------------------------|---------|----------|---------|---------|-------------------
File                          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------------|---------|----------|---------|---------|-------------------
All files                     |   96.89 |       80 |   92.38 |   96.58 |                   
 src/app                      |     100 |      100 |     100 |     100 |                   
  app.controller.ts           |     100 |      100 |     100 |     100 |                   
 src/app/__mock__             |     100 |      100 |     100 |     100 |                   
  app.module.mock.ts          |     100 |      100 |     100 |     100 |                   
 src/app/auth                 |     100 |      100 |     100 |     100 |                   
  auth.module.ts              |     100 |      100 |     100 |     100 |                   
 src/app/auth/__mock__        |     100 |      100 |     100 |     100 |                   
  auth.repository.mock.ts     |     100 |      100 |     100 |     100 |                   
  auth.service.mock.ts        |     100 |      100 |     100 |     100 |                   
 src/app/auth/controller      |     100 |      100 |     100 |     100 |                   
  auth.controller.ts          |     100 |      100 |     100 |     100 |                   
 src/app/auth/dto             |     100 |      100 |     100 |     100 |                   
  sign-in.dto.ts              |     100 |      100 |     100 |     100 |                   
  sign-up.dto.ts              |     100 |      100 |     100 |     100 |                   
 src/app/auth/repository      |     100 |      100 |     100 |     100 |                   
  auth.repository.ts          |     100 |      100 |     100 |     100 |                   
 src/app/auth/service         |     100 |      100 |     100 |     100 |                   
  auth.service.ts             |     100 |      100 |     100 |     100 |                   
 src/app/author               |     100 |      100 |     100 |     100 | 
  author.module.ts            |     100 |      100 |     100 |     100 | 
 src/app/author/__mock__      |     100 |      100 |     100 |     100 | 
  author.repository.mock.ts   |     100 |      100 |     100 |     100 | 
  author.service.mock.ts      |     100 |      100 |     100 |     100 | 
 src/app/author/controller    |     100 |      100 |     100 |     100 | 
  author.controller.ts        |     100 |      100 |     100 |     100 | 
 src/app/author/docs          |     100 |      100 |     100 |     100 | 
  author-docs.ts              |     100 |      100 |     100 |     100 | 
 src/app/author/dto           |     100 |      100 |     100 |     100 | 
  author-query.dto.ts         |     100 |      100 |     100 |     100 | 
  create-author.dto.ts        |     100 |      100 |     100 |     100 | 
  delete-author-query.dto.ts  |     100 |      100 |     100 |     100 | 
  update-author.dto.ts        |     100 |      100 |     100 |     100 | 
 src/app/author/repository    |     100 |    83.33 |     100 |     100 | 
  author.repository.ts        |     100 |    83.33 |     100 |     100 | 21,28
 src/app/author/service       |   96.77 |      100 |    92.3 |   96.55 | 
  author.service.ts           |   96.77 |      100 |    92.3 |   96.55 | 115
 src/app/book                 |     100 |      100 |     100 |     100 | 
  book.module.ts              |     100 |      100 |     100 |     100 | 
 src/app/book/__mock__        |     100 |      100 |     100 |     100 | 
  book.repository.mock.ts     |     100 |      100 |     100 |     100 | 
  book.service.mock.ts        |     100 |      100 |     100 |     100 | 
 src/app/book/controller      |     100 |      100 |     100 |     100 | 
  book.controller.ts          |     100 |      100 |     100 |     100 | 
 src/app/book/dto             |     100 |      100 |     100 |     100 | 
  book-query.dto.ts           |     100 |      100 |     100 |     100 | 
  create-book.dto.ts          |     100 |      100 |     100 |     100 | 
  update-book.dto.ts          |     100 |      100 |     100 |     100 | 
 src/app/book/repository      |     100 |    83.33 |     100 |     100 | 
  book.repository.ts          |     100 |    83.33 |     100 |     100 | 21,28,147        
 src/app/book/service         |   97.72 |      100 |   93.33 |   97.61 | 
  book.service.ts             |   97.72 |      100 |   93.33 |   97.61 | 143
 src/common/docs              |     100 |      100 |     100 |     100 | 
  docs-example.ts             |     100 |      100 |     100 |     100 | 
  docs-tag.ts                 |     100 |      100 |     100 |     100 | 
 src/common/dto               |    98.3 |      100 |   88.88 |    98.3 |                   
  auth.dto.ts                 |     100 |      100 |     100 |     100 | 
  author.dto.ts               |   93.33 |      100 |   66.66 |   93.33 | 52
  book.dto.ts                 |     100 |      100 |     100 |     100 | 
  pagination.dto.ts           |     100 |      100 |     100 |     100 | 
 src/common/guards            |     100 |      100 |     100 |     100 | 
  jwt-auth.guard.ts           |     100 |      100 |     100 |     100 | 
 src/common/passport/strategy |   92.85 |        0 |     100 |   91.66 | 
  jwt.strategy.ts             |   92.85 |        0 |     100 |   91.66 | 22
 src/common/res/di            |     100 |      100 |     100 |     100 | 
  di-key.ts                   |     100 |      100 |     100 |     100 | 
 src/config                   |     100 |       50 |     100 |     100 | 
  app.config.ts               |     100 |       50 |     100 |     100 | 13-17
 src/data/database            |      90 |      100 |   66.66 |    87.5 | 
  database.module.ts          |      90 |      100 |   66.66 |    87.5 | 13
 src/data/database/__mock__   |     100 |      100 |     100 |     100 | 
  database.mock.ts            |     100 |      100 |     100 |     100 | 
 src/data/database/service    |     100 |      100 |     100 |     100 | 
  database.service.ts         |     100 |      100 |     100 |     100 | 
 src/data/selector            |     100 |      100 |     100 |     100 | 
  prisma-selector.ts          |     100 |      100 |     100 |     100 | 
 src/utils/exception          |    61.9 |    66.66 |   33.33 |   57.89 | 
  http-exception.ts           |    61.9 |    66.66 |   33.33 |   57.89 | 28-34,38-46,50-58
 src/utils/extension          |      60 |      100 |   33.33 |      60 | 
  string.ext.ts               |      60 |      100 |   33.33 |      60 | 2-3
 src/validation               |     100 |       50 |     100 |     100 | 
  validation.factory.ts       |     100 |       50 |     100 |     100 | 15
 test/helper                  |     100 |      100 |     100 |     100 | 
  app-tester-provider.ts      |     100 |      100 |     100 |     100 | 
------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 14 passed, 14 total
Tests:       217 passed, 217 total
Snapshots:   0 total
Time:        42.674 s
Ran all test suites.

```

## 💻 Authors Link

- [Github](https://github.com/okifirsyah404/)
- [Linkedin](https://www.linkedin.com/in/oki-firdaus-syah-putra-738308206/)

## 😻 Thanks To NestJS Creator

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

Nest is [MIT licensed](LICENSE).
