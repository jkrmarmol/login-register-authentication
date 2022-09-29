const bcrypt = require('bcrypt');

const comparePassword  = async (password, hash) => {
  try {
    const hashMatched = await bcrypt.compare(password, hash);
    return hashMatched;
  } catch (err) {
    console.log(err);
  }
  return false;
}

const resultBcrypt = async (password, hash) => {
  const result = await comparePassword(password, hash);
  return result;
}

const passwordHash = async (password, saltRounds) => {
  try { 
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    console.log(err)
  }
  return null;
}

const translateToBcrypt = async (password, saltRounds) => {
  const result = await passwordHash(password, saltRounds);
  return result;
}

module.exports = {
  resultBcrypt,
  translateToBcrypt
}