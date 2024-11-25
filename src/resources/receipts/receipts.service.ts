import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { Prisma, User, Farmer, Receipt } from '@prisma/client';
import { LoggerService } from 'src/global/logger/logger.service';
import { ReceiptType } from './entities/receipt.entity';

import { FarmersService } from '../farmers/farmers.service';
import { InputJsonValue } from '@prisma/client/runtime/library';

type ReceiptTypeWithFarmerId = ReceiptType;
export type ReceiptTypeWithoutFarmerId = ReceiptTypeWithFarmerId & {
  farmer: {
    farmer_name: string;
    village: string;
    farmer_contact: string;
    farmer_ID_card_number: string;
    inspector_contact: string;
    location: string;
  }
};

@Injectable()
export class ReceiptService {
  private readonly logger = new LoggerService(ReceiptService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly farmerService: FarmersService
  ) { }



  async create(
    createReceiptDto: Prisma.ReceiptUncheckedCreateInput | ReceiptTypeWithoutFarmerId,
    user?: Partial<User>,
  ) {
    // avoid creating receipt twice
    console.log('\n\n receipt payload:', createReceiptDto);
    let farmerObject: Farmer, result: Receipt;
    try {

      // Automatically create farmer if not found in DB
      if (!createReceiptDto.farmer_id) {
        if (!('farmer' in createReceiptDto)) {
          throw new Error(
            `there is no farmer Id available and NO farmer details provided. Cannot create farmer and his receipt.`
          );
        }
        const { farmer, ...rest } = createReceiptDto;
        farmerObject = (await this.farmerService.create({
          farmer_ID_card_number: farmer?.farmer_ID_card_number,
          farmer_name: farmer?.farmer_name,
          farmer_contact: farmer?.farmer_contact,
          village: farmer?.village,
          inspector_name: createReceiptDto?.agent_name,
          inspector_contact: farmer?.inspector_contact,
          company_id: <string>user?.company_id,
          certification_year: "1970",
          council: farmer?.location,
          inspection_date: new Date(createReceiptDto?.date).toISOString(),
          pesticide_quantity: 0,
          pesticide_used: "",
          weed_application: "",
          weed_application_quantity: 0,
          farmer_photos: createReceiptDto?.salePhotoUrl
        }))?.data as Farmer;
        console.log('Farmer created:', farmerObject);
        // Create the receipt

        result = await this.prismaService.receipt.create({
          data: {
            agent_name: rest?.agent_name,
            farmer_id: farmerObject?.id,
            village: farmerObject?.village,
            market_id: createReceiptDto?.market_id, // Use market_id directly instead of nested relation
            agent_signature: rest?.agent_signature,
            currency: rest?.currency,
            farmer_signature: rest?.farmer_signature,
            humidity: rest?.humidity,
            net_weight: rest?.net_weight,
            product_name: rest?.product_name,
            price_per_kg: rest?.price_per_kg,
            refraction: rest?.refraction,
            total_price: rest?.total_price,
            weight: rest?.weight,
            gpsLocation: rest?.gpsLocation as InputJsonValue,
            salePhotoUrl: rest?.salePhotoUrl,
            date: rest?.date,
          },
        });
      } else {
        // Create the receipt directly if farmer_id exists
        result = await this.prismaService.receipt.create({
          data: {
            market_id: createReceiptDto?.market_id,
            agent_name: createReceiptDto?.agent_name,
            farmer_id: createReceiptDto?.farmer_id,
            village: createReceiptDto?.village,
            agent_signature: createReceiptDto?.agent_signature,
            currency: createReceiptDto?.currency,
            date: createReceiptDto?.date,
            farmer_signature: createReceiptDto?.farmer_signature,
            humidity: createReceiptDto?.humidity,
            net_weight: createReceiptDto?.net_weight,
            product_name: createReceiptDto?.product_name,
            price_per_kg: createReceiptDto?.price_per_kg,
            gpsLocation: createReceiptDto?.gpsLocation as InputJsonValue,
            refraction: createReceiptDto?.refraction,
            total_price: createReceiptDto?.total_price,
            weight: createReceiptDto?.weight,
            salePhotoUrl: createReceiptDto?.salePhotoUrl,
          },
        });
        console.log({ result });
      }

      if (result) {

        return {
          data: result,
          status: HttpStatus.CREATED,
          message: `receipt created successfully `,
        };
      }
      else
        return {
          data: null,
          status: HttpStatus.BAD_REQUEST,
          message: `Failed to create receipt`,
        };
    } catch (error) {
      console.error('Error while creating receipt:', error);

      if (error instanceof Prisma.PrismaClientValidationError) {
        this.logger.error(
          `Validation error: ${error.message}`,
          ReceiptService.name,
        );
        throw new InternalServerErrorException('Validation Error');
      } else {
        this.logger.error(
          `Unexpected error: ${error.message}`,
          ReceiptService.name,
        );
        throw new InternalServerErrorException('Unexpected Error');
      }

    }
  }

  async findAll(query: any, company_id: string) {
    // find all the receipt with the latest start date with its status and type
    const { page, perPage, market_id } = query;

    const where: any = {
      company_id,
      ...(market_id && { id: market_id }),
    };

    const queryOptions = {
      where,
      take: perPage ?? 20,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      orderBy: {
        created_at: 'desc' as const, // Explicitly use SortOrder type
      },
    };
    // find all the companies
    try {
      const [total, receipts] = await this.prismaService.$transaction([
        this.prismaService.receipt.count(),
        this.prismaService.receipt.findMany(queryOptions),
      ]);
      if (receipts.length)
        return {
          status: 200,
          message: 'receipts fetched successfully',
          data: receipts,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
      else
        return {
          status: 400,
          message: 'No receipts found',
          data: [],
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
    } catch (error) {
      this.logger.error(
        `Error fetching receipts \n\n ${error}`,
        ReceiptService.name,
      );
      throw new NotFoundException('Error fetching receipts');
    }
  }

  async findOne(receipt_id: string,) {
    try {
      const result = await this.prismaService.receipt.findUnique({
        where: {
          id: receipt_id,
        }
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `receipt fetched successfully`,
        };
      else
        return {
          data: null,
          status: 404,
          message: `NOT FOUND receipt with id: "${receipt_id}"`,
        };
    } catch (err) {
      this.logger.error("Can't find a receipt with id ", ReceiptService.name);
      throw new NotFoundException("Can't find a receipt with id " + receipt_id);
    }
  }

  async update(id: string, updateReceiptDto: Prisma.ReceiptUpdateInput) {

    // make sure the receipt exists
    const existingReceipt = await this.prismaService.receipt.findUnique({
      where: {
        id,
      }
    })

    if (!existingReceipt)
      throw new HttpException(`NO receipt with id: ${id}`, HttpStatus.BAD_REQUEST)

    try {
      const result = await this.prismaService.receipt.update({
        data: updateReceiptDto,
        where: {
          id,
        },
      });

      if (result)
        return {
          data: result,
          status: 204,
          message: `receipt updated successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to update receipt`,
        };
    } catch (err) {
      this.logger.error(
        "Can't update a receipt with id " + id,
        ReceiptService.name,
      );
      throw new InternalServerErrorException(
        "Can't update a receipt with id " + id,
      );
    }
  }

  async remove(receipt_id: string) {

    // make sure the receipt exists
    const existingReceipt = await this.prismaService.receipt.findUnique({
      where: {
        id: receipt_id,
      }
    })

    if (!existingReceipt)
      throw new HttpException(`NO receipt with id: ${receipt_id}`, HttpStatus.BAD_REQUEST)

    try {
      const result = await this.prismaService.receipt.delete({
        where: {
          id: receipt_id,
        },
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `receipt deleted successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to delete receipt`,
        };
    } catch (err) {
      this.logger.error(
        "Can't delete a receipt with receipt_id " + receipt_id,
        ReceiptService.name,
      );
      throw new InternalServerErrorException(
        "Can't delete a receipt with receipt_id " + receipt_id,
      );
    }
  }

  // get all companies
}