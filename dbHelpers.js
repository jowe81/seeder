//dbHelpers.js:
//  database and seeding helpers

const fs = require('fs');

/**
 * Return a comma seperated list of property names
 * @param {Object} object An object
 * @returns {String} Comma separated list of object's properties
 */
const propertiesToCSV = object => {
  const keysArr = Object.keys(object);
  return keysArr.join(',');
};

/**
 * Return a comma separated list of object values, with strings single-quoted
 * @param {Object} object An object
 * @returns {String} Comma separated list
 */
const valuesToCSV = object => {
  let result = '';
  const keys = Object.keys(object);
  const count = keys.length;
  for (let i = 0; i < count; i++) {
    const thisKey = object[keys[i]];
    if (typeof thisKey === 'string') {
      result += `'${thisKey}'`;
    } else {
      result += thisKey;
    }
    if (i < count - 1) {
      result += ',';
    }
  }
  return result;
};

/**
 * Return a list of the form "$1, $2, ... $n", with n placeholders
 * @param {number} n No of placeholders to concatenate
 * @returns {String} Comma separated list of placeholders
 */
const placeholdersToCSV = n => {
  const arr = [];
  for (let i = 1; i <= n; i++) {
    arr.push(`$${i}`);
  }
  return arr.join(',');
};

/**
 * Return an array with values from an object
 * @param {Object} object The object to collect the values from
 * @returns {Array} The values from object
 */
const valuesToArray = object => {
  const keysArr = Object.keys(object);
  return keysArr.map(v => object[v]);
};

/**
 * Remove empty properties of object, and convert number values to numbers
 * @param {Object} object The object to remove empty properties from
 */
const removeEmptyFields = object => {
  const keysArr = Object.keys(object);
  for (const key of keysArr) {
    const value = object[key];
    const parsedValue = Number(value);
    if (typeof value === 'boolean') {
      object[key] = value;
    } else if (parsedValue || value.trim() === '0') {
      //parsedValue is a number: negative, positive, or zero.
      //In case of zero, it resulted from entering the digit 0, not from a falsy string
      //-> convert property to number
      object[key] = parsedValue;
    } else if (!value) {
      //parsedValue was 0, and resulted from an empty string
      //-> delete property
      delete object[key];
    }
  }
};

/**
 * Generate INSERT query from object and return as plain text
 * @param {Object} object The keys and values to insert
 * @param {String} tableName The table to insert into
 * @returns string with INSERT query
 */
const getInsertQueryText = (object, tableName) => {
  return `INSERT INTO ${tableName} (${propertiesToCSV(object)}) VALUES (${valuesToCSV(object)});`;
};

/**
 * Build a postgres INSERT query from an object
 * @param {Object} object The keys and values to insert
 * @param {string} tableName The table to insert into
 * @returns {Object} A query object of the form {text:"...", values:[]}
 */
const getInsertQuery = (object, tableName, returnRecord = true) => {
  removeEmptyFields(object);
  let returning;
  returnRecord ? returning = " RETURNING *" : returning = "";
  const noFields = Object.keys(object).length;
  const query = {
    'text': `INSERT INTO ${tableName} (${propertiesToCSV(object)}) VALUES (${placeholdersToCSV(noFields)})${returning};`,
    'values': valuesToArray(object)
  };
  return query;
};

/**
 * Generate a seed file
 * @param {*} tableName Name of the table 
 * @param {*} columns Object with column information
 * @param {*} noRecords # of records to write to seed file
 * @param {*} path Where to save the file
 * @param {*} createStatement optional: create table statement to be inserted at the top
 * @returns 
 */
const writeSeedFile = (tableName, columns, noRecords = 200, path = './', createStatement) => {
  let data = '';
  if (createStatement) {
    data += createStatement;
  }
  for (let i = 0; i < noRecords; i++) {
    data += getSeedRecord(columns, tableName);
    data += '\n';
  }
  fs.writeFileSync(path + tableName + '.sql', data);
};

const DEFAULT_VARCHAR_LENGTH = 100;
const DEFAULT_MAX_VALUE = 1000;

const helpers = require('./helpers');

/**
 * Make a function that generates a random name
 * @returns A function that generates a random name
 */
const getNamesFactory = () => {
  const data = fs.readFileSync('./data/names').toString().split("\n");

  let records = data.length;
  let i = 0;

  const getName = () => {
    i < records - 1 ? i++ : i = 0;
    return data[i];
  };
  
  return getName;
};

const getName = getNamesFactory();

/**
 * Make a function that generates a string of one or more random words
 * @returns A function that generates a string of random words
 */
const getWordsFactory = () => {
  const data = fs.readFileSync('./data/words').toString().split("\n");

  let records = data.length;

  const getWords = (n = 1) => {
    const words = [];
    for (let i = 0; i < n; i++) {
      words.push(data[Math.round(Math.random() * records)]);
    }
    return words.join(' ');
  };
  
  return getWords;
};

const getWords = getWordsFactory();

/**
 * Generate an insert query with seed data for a given set of columns
 * @param {Array} columns Array of objects with the properties name and type
 * @param {String} tableName Name of the table to insert into
 */
const getSeedRecord = (columns, tableName) => {
  const data = {};
  for (const colname of Object.keys(columns)) {
    let value;
    switch (columns[colname].type.toLowerCase()) {
    case 'varchar':
      value = helpers.generateRandomString(columns[colname].length || DEFAULT_VARCHAR_LENGTH);
      break;
    case 'name':
      value = getName();
      break;
    case 'words':
      value = getWords(columns[colname].length || 1);
      break;
    case 'boolean':
      value = Math.random() > .5;
      break;
    case 'integer':
      value = Math.round(Math.random() * (columns[colname].max || DEFAULT_MAX_VALUE));
      break;
    case 'float':
      value = Math.random() * (columns[colname].max || DEFAULT_MAX_VALUE);
      break;
    case 'date':
      break;
    default:
      value = null;
    }
    data[colname] = value;
  }
  return getInsertQueryText(data, tableName);
};

module.exports = {
  getInsertQuery,
  getInsertQueryText,
  getSeedRecord,
  writeSeedFile,
};
