const dbHelpers = require('./dbHelpers');

let columns;

//Make seed file for users table
columns = {
  "name": { type: 'name', length: 30},
};
dbHelpers.writeSeedFile('users', columns, 2000);

//Make seed file for quizzes table
columns = {
  "title": { type: 'words', length: 5 },
  "user_id": { type: 'integer', max:100},
};
dbHelpers.writeSeedFile('quizzes', columns, 200);

//Make seed file for options table
columns = {
  "question_id": { type: 'integer', max:200},
  "content" : {type: 'words', length: 3}
};
dbHelpers.writeSeedFile('options', columns, 1000);

