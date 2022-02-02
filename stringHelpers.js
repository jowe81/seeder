//helpers.js: server-side helper functions

//const constants = require("./constants");

//Returns a string with a range of ASCII characters
const getCharacterRange = (offset, range) => {
  let i;
  let chars = "";
  for (i = offset; i < offset + range; i++) {
    chars += String.fromCharCode(i);
  }
  return chars;
};

//Returns a single random alphanumeric character
const generateRandomCharacter = () => {
  //Assemble all digits, uppercase- and lowercase characters into a single string
  let allChars = getCharacterRange(48,10) + getCharacterRange(65, 26) + getCharacterRange(97, 26);
  //Return character from a random position in the string
  const pos = Math.floor(Math.random() * allChars.length);
  return allChars[pos];
};

//Returns a string of \w characters of specified length
const generateRandomString = (length = 6) => {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += generateRandomCharacter();
  }
  return str;
};

//Basic email string validity check (returns true or false)
const isValidEmail = (email) => {
  //Requires:
  // - a sequence of one or more of: alphanumeric characters, hyphen, underscore (username)
  // - the @ sign
  // - one or more of: a sequence of alphanum chars, hyphens followed by a dot (domain names)
  // - a dot followed by at least 2 letters (TLD)
  const rgx = new RegExp(/^[\w-_.]+@([a-z0-9-]+\.)+[a-z]{2,}/i);
  return rgx.test(email);
};

//Return true if user with email email exists in users
const emailExists = (users, email) => {
  for (const userID in users) {
    if (users[userID].email && users[userID].email === email) {
      return true;
    }
  }
  return false;
};

//Returns the string if there's a valid URL at the beginning of the url string; false if not
//Rudimentary tests only (with Regex crafted from scratch)
const verifyURL = (url) => {
  const trimmedURL = url.trim();
  // Requires:
  // - protocol with 3 or 4 characters followed by ://
  // - one or more iterations of xxxx. (also allowing digits and hyphens; in any order for sake of simplicity)
  // - a TLD (two or more letters)
  // - zero or more path components, consisting of a slash followed by letters or digits (also allowing -, _, .)
  // - if protocol is missing or invalid, it will return http:// as the protocol
  // Does not check a potentially present querystring
  const rgx = new RegExp(/(?<protocol>^[a-z]{3,4}:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[\w-.]+)*/i);
  const match = rgx.exec(trimmedURL);
  if (match) {
    const protocol = match.groups.protocol;
    //If protocol was present, return match as is, or else send http:// followed by the input starting from the match
    return protocol ? match['input'] : "http://" + match['input'].substr(match['input'].indexOf(match[0]));
  }
  return false;
};


module.exports = {
  generateRandomString,
  isValidEmail,
  emailExists,
  verifyURL,
};