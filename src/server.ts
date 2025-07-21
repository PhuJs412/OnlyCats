import { server } from './app';
import { testDbConnection } from './config/pg.config';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testDbConnection(); // Test DB trước khi khởi động server
    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();