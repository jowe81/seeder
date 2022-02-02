const { db } = require('./db');
const dbHelpers = require('./dbHelpers');

const fs = require('fs');


let columns;
let create;

columns = {
  "name": { type: 'name', length: 30},
};

create = `CREATE TABLE users (
  id SERIAL,
  name VARCHAR(50)
)`;
dbHelpers.writeSeedFile('users', columns, 2000);

columns = {
  "title": { type: 'words', length: 5 },
  "user_id": { type: 'integer', max:100},
};

dbHelpers.writeSeedFile('quizzes', columns, 200);

columns = {
  "question_id": { type: 'integer', max:200},
  "content" : {type: 'words', length: 3}
};

dbHelpers.writeSeedFile('options', columns, 1000);

