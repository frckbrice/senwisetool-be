import { parentPort } from 'worker_threads';
import { PlanFactory } from "./read-company-files";
import { readFile } from "fs/promises";
import { join } from 'path';
import { existsSync, mkdirSync } from 'node:fs';

const planFactory = new PlanFactory();
const targetDirectory = join(__dirname, '..', 'data', 'data.json');
parentPort?.on('message', async ({ plan_name, directory, id }) => {
    let result: string;

    try {
        const planObject = planFactory.getPlanRequirements(
            plan_name,
            directory
        );
        console.log("fetching all Reqs from worker : ", plan_name, directory, id);
        // read current files content and write in the target file for later reading.
        await planObject?.getRequirementData();

        // read from the  target file after have been filled by the above function.
        await readFile(targetDirectory, { encoding: 'utf8' }).catch(err => {
            console.error(err);
        });

        /* this loop is a workaround for the fact that the above function is asynchronous.
            so, the reading directly is creating error on first attempt and succeed in second.
            to avoid that, fleeping in read we create this second reading.
         */
        for (let i = 0; i < 2; i++) {
            const fileContent = await readFile(targetDirectory, { encoding: 'utf8' });
            if (typeof fileContent != "undefined") {
                result = JSON.stringify([fileContent]);
                // Send the result back to the main thread
                parentPort?.postMessage({ result, id });
            }
        }

    } catch (error) {
        console.error(`Error inside worker: ${error}`);
    }
});
