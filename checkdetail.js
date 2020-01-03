const connection = require('./databaseConnection');

module.exports = function checkDetail(req, res, data) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    const con = connection();
    res.writeHead(200, { 'Content-Type': data });

    const userDetails = JSON.parse(body);

    const { email, password } = userDetails;

    const user_password = password;

    let sql = `SELECT * FROM user_info WHERE email = '${email}'`;

    con.connect(err => {
      if (err) {
        console.log('Error Connecting to Database', err);
        return;
      }

      con.query(sql, (err, result) => {
        if (err) {
          console.log('Error inserting record', err);
          con.end();
          return;
        } else {
          if (result.length !== 0) {
            const { name, phone, email, password } = result[0];

            con.end();

            let user_data = {
              name,
              phone,
              email,
              err: ''
            };

            if (user_password === password) {
              return res.end(JSON.stringify(user_data));
            } else {
              const err = 'Incorrect Password';

              const data = { ...user_data, err };

              return res.end(JSON.stringify(data));
            }
          } else {
            let user_data = {
              name: '',
              phone: '',
              email: '',
              err: ''
            };

            const err = 'Incorrect Email/Password';
            return res.end(JSON.stringify({ ...user_data, err }));
          }
        }
      });
    });
  });
};
