import "reflect-metadata"
import app from './app';
import { AppDataSource } from './config/data-sources';

async function main() {
  try {
    await AppDataSource.initialize()
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
    console.log('Database connection established successfully');
  } catch (error) {
    console.log(error)
  }
}

main();