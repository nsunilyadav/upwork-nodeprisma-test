# REST API Test for user and shopping preference

## Getting started

### 1. install dependencies

<details><summary> Clone the entire repo</summary>

Clone this repository:

```
git clone https://github.com/nsunilyadav/upwork-nodeprisma-test.git
```

Install npm dependencies:

```
cd upwork-nodeprisma-test
npm install
```

</details>

### 2. Create and seed the database

Run the following command to create your SQLite database file. This also creates the `User` and `ShoppingPreference` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

### 3. Start the REST API server

```
npm run dev
```

The server is now running on `http://localhost:800`. You can you see the API documentation [`http://localhost:8000/api-docs`]
