const bcrypt = require('bcryptjs');

const plainPassword = 'admin123';
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hash gerado:', hash);
  process.exit(0);
});
