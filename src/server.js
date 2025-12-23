import { config } from './configs/env.js';
import { connectDB } from './configs/db.js';
import app from './app.js'

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION: 💥 Shutting down...', err);
});

connectDB();

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`[ ready ] Server running on port ${PORT}`);
});

//Unhandled promise rejection is handled here
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 shutting down...');
});
