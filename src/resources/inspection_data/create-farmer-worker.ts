import { parentPort } from 'worker_threads';

import { readFile } from "fs/promises";
import { join } from 'path';
import { PrismaService } from 'src/adapters/config/prisma.service';

const prisma = new PrismaService;

parentPort?.on('message', async ({ data, id }) => {


    try {

        const newFarmer = await prisma.farmer.create({
            data: data
        });

        if (typeof newFarmer != 'undefined') {
            const result = {
                data: newFarmer,
                message: "Farmer created successfully",
                status: 201
            }
            parentPort?.postMessage({ result, id });
        } else {
            const result = {
                data: null,
                message: "Failed to create farmer",
                status: 400
            }
            parentPort?.postMessage({ result, id });
        }


    } catch (error) {
        console.error(`Error inside worker: ${error}`);
    }
});
