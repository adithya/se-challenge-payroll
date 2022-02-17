import { createConnection } from 'typeorm';
import 'reflect-metadata';
import { DB_CONNECTION, PORT } from './constants';
import { app } from './app';

createConnection(DB_CONNECTION)
  .then((connection) => {
    app.listen(PORT, () => console.log(`Express is listening at http://localhost:${process.env.EXTERNAL_PORT ? process.env.EXTERNAL_PORT : PORT}`));
  }).catch((error) => {
    console.log(error);
  });

export {};
