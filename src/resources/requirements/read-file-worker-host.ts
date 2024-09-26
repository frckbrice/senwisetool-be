import {
    HttpException,
    HttpStatus,
    Injectable,
    OnApplicationBootstrap,
    OnApplicationShutdown,
} from '@nestjs/common'; // Importing necessary decorators and interfaces from NestJS
import { randomUUID } from 'crypto'; // Importing randomUUID function to generate unique IDs
import { join } from 'path'; // Importing join function to create file paths
import { filter, firstValueFrom, fromEvent, map, Observable } from 'rxjs'; // Importing RxJS operators and functions for reactive programming
import { Worker } from 'worker_threads'; // Importing Worker class to create and manage worker threads
import { cwd } from 'node:process';
import { LoggerService } from 'src/global/logger/logger.service';
import { existsSync, mkdirSync } from 'node:fs';

@Injectable()
export class ReadFileWorkerHost implements OnApplicationBootstrap, OnApplicationShutdown {

    private worker: Worker; // Worker instance for managing the worker thread
    private messages$: Observable<{ id: string; result: string }>; // Observable to handle messages from the worker thread

    private readonly logger = new LoggerService(ReadFileWorkerHost.name);
    private readonly currentDirectory = cwd() + '/src/global/utils/requirement-files/';

    // Lifecycle hook executed when the application starts
    onApplicationBootstrap() {
        // Initializing the worker thread with the specified script
        this.worker = new Worker(join(__dirname, 'read-file-worker'));
        // Creating an observable from the worker's message events
        this.messages$ = fromEvent(this.worker, 'message') as Observable<{
            id: string;
            result: string;
        }>;
    }

    // Lifecycle hook executed when the application shuts down
    async onApplicationShutdown() {
        // Terminating the worker thread
        this.worker.terminate();
    }


    // Method to send a task to the worker thread and get the result
    async getRequirementsFromPlan(plan_name: string, directory: string) {

        const uniqueId = randomUUID(); // Generating a unique ID for the task

        try {
            // Sending a message to the worker thread with the input number and unique ID
            const workerPostmessage = this.worker.postMessage({
                plan_name: plan_name,
                directory,
                id: uniqueId
            });

            // Returning a promise that resolves with the result of the files 
            const returnValue = firstValueFrom(
                // Convert the observable to a promise
                this.messages$.pipe(
                    // Filter messages to only include those with the matching unique ID
                    filter(({ id }) => id === uniqueId),
                    // Extract the result from the message
                    map(({ result }) => result),
                ),
            );
            if (!existsSync(join(__dirname, '..', 'data'))) {
                mkdirSync(join(__dirname, '..', 'data'));
            }
            return returnValue;
        } catch (error) {
            this.logger.error(
                `Error fetching requirements for this plan  \n\n ${error}`,
                ReadFileWorkerHost.name,
            );
            throw new HttpException('Error fetching comapnies', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}