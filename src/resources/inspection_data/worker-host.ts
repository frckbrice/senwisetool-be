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
import { Prisma } from '@prisma/client';

@Injectable()
export class FieldWorkerHost implements OnApplicationBootstrap, OnApplicationShutdown {
    private logger = new LoggerService(FieldWorkerHost.name);

    private Farmerworker: Worker; // Worker instance for managing the worker thread
    // private Farmworker: Worker; // Worker instance for managing the worker thread
    // private Participantworker: Worker; // Worker instance for managing the worker thread
    // private AttendanceSheetworker: Worker; // Worker instance for managing the worker thread

    // private messages$: Observable<{ id: string; result: string }>; // Observable to handle messages from the worker thread
    // private messages1$: Observable<{ id: string; result: string }>;
    // private messages2$: Observable<{ id: string; result: string }>;
    private messages3$: Observable<{ id: string; result: string }>;

    // Lifecycle hook executed when the application starts
    onApplicationBootstrap() {
        // Initializing the worker thread with the specified script
        // this.Participantworker = new Worker(join(__dirname, 'participant_worker'));
        // // Creating an observable from the worker's message events
        // this.messages$ = fromEvent(this.Farmworker, 'message') as Observable<{
        //     id: string;
        //     result: string;
        // }>;
        // this.AttendanceSheetworker = new Worker(join(__dirname, 'attendance_sheet_worker'));
        // // Creating an observable from the worker's message events
        // this.messages1$ = fromEvent(this.Farmworker, 'message') as Observable<{
        //     id: string;
        //     result: string;
        // }>;
        // this.Farmworker = new Worker(join(__dirname, 'farm-worker'));
        // // Creating an observable from the worker's message events
        // this.messages2$ = fromEvent(this.Farmworker, 'message') as Observable<{
        //     id: string;
        //     result: string;
        // }>;
        this.Farmerworker = new Worker(join(__dirname, '..', 'farmers', 'farmer-worker'));
        // Creating an observable from the worker's message events
        this.messages3$ = fromEvent(this.Farmerworker, 'message') as Observable<{
            id: string;
            result: string;
        }>;
    }

    // Lifecycle hook executed when the application shuts down
    async onApplicationShutdown() {
        // Terminating the worker thread
        this.Farmerworker.terminate();
        // this.AttendanceSheetworker.terminate()
        // this.Farmworker.terminate();
        // this.Participantworker.terminate()
    }


    // Method to send a task to the worker thread and get the result
    async storeFarmerData(data: any) {

        const uniqueId = randomUUID(); // Generating a unique ID for the task

        try {
            // Sending a message to the worker thread with the input number and unique ID
            const workerPostmessage = this.Farmerworker.postMessage({
                data: JSON.parse(data),
                id: uniqueId
            });

            // Returning a promise that resolves with the result of the files 
            const returnValue = firstValueFrom(
                // Convert the observable to a promise
                this.messages3$.pipe(
                    // Filter messages to only include those with the matching unique ID
                    filter(({ id }) => id === uniqueId),
                    // Extract the result from the message
                    map(({ result }) => result),
                ),
            );

            return returnValue;
        } catch (error) {
            this.logger.error(
                `Error creating farmer data for inspection \n\n ${error}`,
                FieldWorkerHost.name,
            );
            throw new HttpException('Error creating farmer data for inspection', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // async storeFarmData(data: any) {

    //     const uniqueId = randomUUID(); // Generating a unique ID for the task

    //     try {
    //         // Sending a message to the worker thread with the input number and unique ID
    //         const workerPostmessage = this.Farmworker.postMessage({
    //             data: JSON.parse(data),
    //             id: uniqueId
    //         });

    //         // Returning a promise that resolves with the result of the files 
    //         const returnValue = firstValueFrom(
    //             // Convert the observable to a promise
    //             this.messages2$.pipe(
    //                 // Filter messages to only include those with the matching unique ID
    //                 filter(({ id }) => id === uniqueId),
    //                 // Extract the result from the message
    //                 map(({ result }) => result),
    //             ),
    //         );

    //         return returnValue;
    //     } catch (error) {
    //         this.logger.error(
    //             `Error creating farmer data  \n\n ${error}`,
    //             FieldWorkerHost.name,
    //         );
    //         throw new HttpException('Error creating farmer data', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // async storeTraingSessionData(data: any) {

    //     const uniqueId = randomUUID(); // Generating a unique ID for the task

    //     try {
    //         // Sending a message to the worker thread with the input number and unique ID
    //         const workerPostmessage = this.Farmworker.postMessage({
    //             data: data,
    //             id: uniqueId
    //         });

    //         // Returning a promise that resolves with the result of the files 
    //         const returnValue = firstValueFrom(
    //             // Convert the observable to a promise
    //             this.messages1$.pipe(
    //                 // Filter messages to only include those with the matching unique ID
    //                 filter(({ id }) => id === uniqueId),
    //                 // Extract the result from the message
    //                 map(({ result }) => result),
    //             ),
    //         );

    //         return returnValue;
    //     } catch (error) {
    //         this.logger.error(
    //             `Error creating farmer data  \n\n ${error}`,
    //             FieldWorkerHost.name,
    //         );
    //         throw new HttpException('Error creating farmer data', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // async storeParticipantToTrainingSession(data: any) {

    //     const uniqueId = randomUUID(); // Generating a unique ID for the task

    //     try {
    //         // Sending a message to the worker thread with the input number and unique ID
    //         const workerPostmessage = this.Farmworker.postMessage({
    //             data: data,
    //             id: uniqueId
    //         });

    //         // Returning a promise that resolves with the result of the files 
    //         const returnValue = firstValueFrom(
    //             // Convert the observable to a promise
    //             this.messages$.pipe(
    //                 // Filter messages to only include those with the matching unique ID
    //                 filter(({ id }) => id === uniqueId),
    //                 // Extract the result from the message
    //                 map(({ result }) => result),
    //             ),
    //         );

    //         return returnValue;
    //     } catch (error) {
    //         this.logger.error(
    //             `Error creating farmer data  \n\n ${error}`,
    //             FieldWorkerHost.name,
    //         );
    //         throw new HttpException('Error creating farmer data', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }
}