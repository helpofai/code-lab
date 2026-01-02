const { User } = require('./src/models');
const { connectDB } = require('./src/config/db');

async function setAdmin(email) {
  await connectDB();
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found. Please register first.');
      process.exit(1);
    }
    await user.update({ role: 'admin', isVerified: true });
    console.log(`User ${user.username} is now an admin and verified.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

const email = process.argv[2];
if (!email) {
    console.log('Please provide an email');
    process.exit(1);
}
setAdmin(email);
