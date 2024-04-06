
const sqlite3 = require('sqlite3').verbose(); // Import SQLite

function createDataSource() {
    const db = new sqlite3.Database('./database/otp_database.db', (err) => {
    if (err) {
      console.error('SQLite Connection Error:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
  
      db.run(`CREATE TABLE IF NOT EXISTS otp (
        email TEXT primary key,
        passw TEXT,
        otpExpiration DATETIME
      )`);
    }
  });
  return db;
}

function insert(db, email, hashPass, expirationDate) {
    db.run(`INSERT INTO otp (email, passw, otpExpiration) VALUES (?, ?, ?)`, [email, hashPass, expirationDate], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
}

function fetch(db, email, callback) {
    let sql = `SELECT email, passw, otpExpiration                   
               FROM otp
               WHERE email = ?`;

    db.get(sql, [email], (err, row) => {
    if (err) {
      return callback(err);
    }
    callback(null, row); // Pass null for error and row data
  });
}

function remove(db, email) {
    db.run(`Delete FROM otp where email = ?`, [email], function(err) {
        if(err) {
            return console.error(err.message);
        }
        console.log(`Row with email ${email} deleted`);
    })
}

function update(db, email, pass, expirationDate) {
    let data = [ pass, expirationDate, email ];
    let sql = `UPDATE otp
            SET passw = ?,
                otpExpiration = ?
            WHERE email = ?`;

    db.run(sql, data, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row updated: ${this.changes}`, [email]);
    });
}

function insertOrUpdate(db, email, hashPassw, expirationDate) {
    console.log('insertOrUpdate');
    fetch(db, email, (err, row) => {
        if (err) {
          console.error('Error fetching row:', err.message);
          return;
        }
      
        if (row) {
            console.log('Found row:', row);
            console.log('Update existing row: email=', email);
            update(db, email, hashPassw, expirationDate);
        } else {
            console.log('No row found with the given primary key.');
            console.log('Inserting new row: email=', email);
            insert(db, email, hashPassw, expirationDate);
        }
        
    });
}

module.exports.createDataSource = createDataSource;
module.exports.fetch = fetch;
module.exports.remove = remove;
module.exports.insertOrUpdate = insertOrUpdate;
