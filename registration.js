const Generator = require('./idGenerator');
const connection = require('./databaseConnection');
const sendEmail = require('./sendMail');

const generate = new Generator();

module.exports = function registration(req, res, data) {
  let body = '';
  req.on('data', payload => {
    body += payload;
  });

  req.on('end', () => {
    const con = connection();
    res.writeHead(200, { 'Content-Type': data });
    const genetrated_id = generate.generate();

    const parse_body = JSON.parse(body);
    const userDetails = { ...parse_body, genetrated_id };

    const { name, phone, email, genetrated_id: id } = userDetails;

    /* Disable sending mail to register user */
    //sendEmail(name, email, id);

    let sql = `INSERT INTO user_info (name, phone, email, password) VALUES('${name}', '${phone}', '${email}', '${id}')`;

    con.connect(err => {
      if (err) {
        console.log('Error Connecting to Database', err);
        con.end();
        return;
      }

      console.log('Connection established');
      con.query(sql, (err, result) => {
        if (err) {
          console.log('Error inserting record', err);
          return;
        }

        console.log('1 record inserted');
      });

      con.end();
    });

    return res.end(body);
  });
};
