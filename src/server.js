import { config } from './configs/env.js';
import { connectDB } from './configs/db.js';
import app from './app.js';
import { initializeDefaultPermissions } from './utils/initializePermissions.js';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION: 💥 Shutting down...', err);
});

const startServer = async () => {
  try {
    await connectDB();
    // Initialize default permissions after DB connection
    await initializeDefaultPermissions();
    
    const PORT = config.port || 3000;
    app.listen(PORT, () => {
      console.log(`[ ready ] Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

//Unhandled promise rejection is handled here
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 shutting down...');
});
