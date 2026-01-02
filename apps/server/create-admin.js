const { User } = require('./src/models');
const { connectDB } = require('./src/config/db');

async function createAdmin() {
  await connectDB();
  try {
    const email = 'com.helpofai@gmail.com';
    await User.destroy({ where: { email } });
    const user = await User.create({
        username: 'admin',
        email: email,
        password: 'adminpassword', // bcrypt hook will hash it
        role: 'admin',
        isVerified: true
    });
    console.log(`Admin user created: ${user.username}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
