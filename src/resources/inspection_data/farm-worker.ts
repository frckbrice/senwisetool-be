import { parentPort } from 'worker_threads';




parentPort?.on('message', async ({ data, id }) => {


    try {

    } catch (error) {
        console.error(`Error inside worker: ${error}`);
    }
});
