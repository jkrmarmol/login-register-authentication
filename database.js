const database = [
  {
    id: 1,
    username: 'kurt',
    password: '$2a$12$qUsfQCSJKLol5erObE4UYuBccPZ6CdAELn1e2fzpcc1SqllzQPVhS',
    info: {
      name: 'Kurt Russelle Marmol',
      age: 19
    }
  },
  {
    id: 2,
    username: 'juan',
    password: '$2a$12$.02SmHE04uDg7uchHVTk3.GDsnyxi3FnH5r4M5/6IOPAincmhROCS',
    info: {
      name: 'Juan Luna',
      age: 18
    }
  },
  {
    id: 3,
    username: 'rizal',
    password: '$2a$12$9FPRuOOripjgy5nR2.IQjeeRqdkrLe6DdISJI17mxozlTFngU4pzW',
    info: {
      name: 'Jose Rizal',
      age: 21
    }
  }
]

// This function find username in database and return password
function findUsername(username) {
  const result = database.filter(e => e.username === username);
  return result.length === 0 ? 'user not found' : result;
}

function showInfos(id) {
  const result = database.filter(e => {
    return e.id === id;
  })
  return result;
}

module.exports = {
  database,
  findUsername,
  showInfos
}