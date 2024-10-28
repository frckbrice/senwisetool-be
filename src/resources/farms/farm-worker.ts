import { parentPort } from 'worker_threads';

import { PrismaService } from 'src/adapters/config/prisma.service';
import { LoggerService } from 'src/global/logger/logger.service';
import { HttpException, HttpStatus } from '@nestjs/common';

const prisma = new PrismaService();
const logger = new LoggerService();

parentPort?.on('message', async ({ data, id }) => {

    // if (!data?.project_data?.project_data?.farmer_ID_card_number)
    //     throw new HttpException(`No Farmer ID card number Provided: `, HttpStatus.BAD_REQUEST);

    const farmer = await prisma.farmer.findUnique({
        where: {
            farmer_ID_card_number: '66474848488558',
            //  data?.project_data?.project_data?.farmer_ID_card_number ? data?.project_data?.project_data?.farmer_ID_card_number : '66474848488558',
            // id: "cm2rg7tpp0003jvueu96q8uko"
        }
    })
    console.log("\n\farm worker received this is farmer data: ", farmer);
    // construct the farmer object 

    const farmerObject = {
        location: data.project_data?.project_data?.location, // Json ?  @default("{}")  @db.JsonB
        farmer_id: farmer?.id ? farmer?.id : data?.project_data?.project_data?.farmer_ID_card_number,// String,

        village: data?.project_data?.project_data?.village,// String
        plantation_creation_date: data?.project_data?.project_data?.plantation_creation_date ? data?.project_data?.project_data?.plantation_creation_date : data?.collected_at,  //DateTime
        farm_image_url: data?.project_data?.project_data?.plantation_photos[0], // String
        estimate_area: !isNaN(data?.project_data?.project_data?.estimated_area) ? data?.project_data?.project_data?.estimated_area : 0, //Float

        plantation_photos: data?.project_data?.project_data?.plantation_photos // String[]
    }

    try {
        const result = await prisma.$transaction(async () => {
            // TODO: you may want to call directly the farmer service to delegate this task to.
            const newFarmData = await prisma.farm.create({
                data: {
                    location: farmerObject?.location,
                    farmer_id: <string>farmer?.id,
                    village: farmerObject?.village,
                    plantation_creation_date: farmerObject?.plantation_creation_date,
                    estimate_area: farmerObject?.estimate_area,
                    plantation_photos: farmerObject?.plantation_photos,
                    farm_image_url: ""
                }
            });

            // this is to get the historique  of the farms of a specific farmer.
            const farmCoordinates = {
                farm_id: newFarmData?.id,// String
                location: farmerObject?.location,// Json ?  @default("{}")  @db.JsonB

                coordinates: data.project_data?.project_data?.coordinates, //Json ?  @default("{}")  @db.JsonB
                collector_name: data.project_data?.project_data?.collector_name // String
            }

            const farmCoordinate = await prisma.farm_coordinates.create({
                data: farmCoordinates
            });

            return {
                farm: newFarmData,
                farmCoordinate
            }
        })


        parentPort?.postMessage({ result, id });

    } catch (error) {
        logger.error(`Error inside farm worker \n\n: ${error}`);
        throw new HttpException('Error inside farm worker', HttpStatus.INTERNAL_SERVER_ERROR);
    }
});
