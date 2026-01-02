const { sequelize } = require('./src/config/db');
require('./src/models');

async function resetDB() {
  try {
    console.log('Connecting to DB...');
    await sequelize.authenticate();
    console.log('Connected.');

    console.log('Dropping all tables and recreating (FORCE SYNC)...');
    await sequelize.sync({ force: true });
    
    console.log('Database reset successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Reset failed:', err);
    process.exit(1);
  }
}

resetDB();