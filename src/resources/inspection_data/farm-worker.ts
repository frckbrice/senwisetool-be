import { parentPort } from 'worker_threads';
import { readFile } from "fs/promises";
import { join } from 'path';



const targetDirectory = join(__dirname, '..', 'data', 'data.json');
parentPort?.on('message', async ({ plan_name, directory, id }) => {
    let result: string;

    try {

    } catch (error) {
        console.error(`Error inside worker: ${error}`);
    }
});
