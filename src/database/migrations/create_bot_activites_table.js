const { conection } = require('../db');

async function createBotActivitiesTable() {
  try {
    await conection.promise().query(`
      CREATE TABLE IF NOT EXISTS bot_activities (
        id INT PRIMARY KEY AUTO_INCREMENT,
        auction_id INT NOT NULL,
        bot_count INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (auction_id) REFERENCES subastas(id)
      )
    `);
    console.log('Bot activities table created successfully');
  } catch (error) {
    console.error('Error creating bot activities table:', error);
  }
}

module.exports = createBotActivitiesTable;