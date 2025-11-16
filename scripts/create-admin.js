const bcrypt = require('bcryptjs');
const password = 'K1324rst*1';
bcrypt.hash(password, 10).then(hash => {
  console.log('Password Hash:', hash);
  console.log('\nSQL Command:');
  console.log(`INSERT INTO admins (email, password, name, role, is_active) VALUES ('hello@nowiht.com', '${hash}', 'Admin', 'super_admin', true);`);
});