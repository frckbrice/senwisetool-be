import { parentPort } from 'worker_threads';

import { PrismaService } from 'src/adapters/config/prisma.service';
import { LoggerService } from 'src/global/logger/logger.service';
import { HttpException, HttpStatus } from '@nestjs/common';

const prisma = new PrismaService();
const logger = new LoggerService();

parentPort?.on('message', async ({ data, id }) => {


    console.log("\n\attendance-sheet  worker received data: ", data);
    // construct the farmer object 

    const attendance_sheet = {
        date: data?.project_data?.date,
        title: data?.project_data?.tilte,
        modules: data?.project_data?.modules,
        trainers: data?.project_data?.trainers,
        location: data?.project_data?.village,
        report_url: data?.project_data?.report_url,
        photos: data?.project_data?.photos,

        training_id: data?.project_data?.training_id,
    }

    const participantsObj = data?.project_data?.participants

    try {
        const result = await prisma.$transaction(async (tx) => {
            const attendanceData = await tx.attendance_sheet.create({
                data: attendance_sheet
            });

            const participants = await tx.attendance_sheet.createMany({
                data: participantsObj
            });

            return {
                attendanceData,
                participants
            }
        })

        parentPort?.postMessage({ result, id });

    } catch (error) {
        logger.error(`Error inside  attendance-sheet worker \n\n: ${error}`);
        throw new HttpException('Error inside attendance-sheet worker', HttpStatus.INTERNAL_SERVER_ERROR);
    }
});
