# Full Stack Open phonebook app

Node API backend for the [Full Stack Open Course](https://fullstackopen.com/) 

## Usage

1. clone this repo
```
git clone https://github.com/tizam/phonebook.git
```
2. rename .env-example to .env
3. add MongoDB Connection String to .env
4. install dependecies by runing ```npm install```
5. run ```npm run watch```

## Routes

| Method | URI              | Desc                    |
| ------ | ---------------- | ----------------------- |
| GET    | /                | 'Hello World'           |
| GET    | /info            | number of entries in DB |
| GET    | /api/persons     | list all persons        |
| GET    | /api/persons/:id | get single person       |
| DELETE | /api/persons/:id | delete single person    |
| POST   | /api/persons     | add a person to DB      |
| PUT    | /api/persons/:id | update a person         |
|        |

