import app from './app';
import { testDbConnection } from './config/pg.config';

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`🚀 Server is running on localhost:${PORT}`)
    await testDbConnection();
});
