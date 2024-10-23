import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { CampaignStatus, Prisma, } from '@prisma/client';
import { PaginationMarketQueryDto } from './dto/paginate-markets.dto';
import { LoggerService } from 'src/global/logger/logger.service';
import { generateMapping } from '../projects/create-code-project-mapping';
import { ProjectAssigneeService } from '../project-assignee/project-assignee.service';

@Injectable()
export class MarketsService {
  private readonly logger = new LoggerService(MarketsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectAssigneeService: ProjectAssigneeService
  ) { }


  async create({
    createMarketDto,
    user_id,
  }: {
    createMarketDto: Prisma.MarketCreateInput;
    user_id: string;
  }) {

    // validate date so that end date should be greater than start date
    if (createMarketDto.start_date > createMarketDto.end_date)
      return {
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: `End date should be greater than or equal to start date`,
      };

    const { uuid: UID, code: projectCode } = generateMapping(crypto.randomUUID());

    try {
      const result = await this.prismaService.$transaction(async (tx) => {
        const result = await tx.market.create({
          data: {
            ...createMarketDto,
            code: UID
          },
        });

        // set the market audit to know who is in charge of the market
        // await tx.market_audit.create({
        //   data: {
        //     market_id: result.id,
        //     user_id: user_id,
        //   },
        // });

        return result;
      });

      if (result)
        return {
          data: { ...result, code: projectCode },
          status: 201,
          message: `market created successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to create market`,
        };
    } catch (error) {
      this.logger.error(
        `Error while creating market ${error}`,
        MarketsService.name,
      );
      throw new InternalServerErrorException(`Error while creating market`);
    }
  }

  async findAll(query: Partial<PaginationMarketQueryDto>, company_id: string) {
    const { status, type, page, perPage, search, campaign_id, agentCode } = query;
    const where = Object.create({});
    let Query = Object.create({ where });

    if (status) {
      where['status'] = status;
    }

    if (type) {
      where['type'] = type;
    }

    if (campaign_id) {
      where['campaign_id'] = campaign_id;
    }

    if (company_id) {
      where['company_id'] = company_id;
    }
    if (agentCode) {
      return await this.getTheAssignedMarket(agentCode, company_id)

    }

    if (search)
      where["search"] = search
    Query = {
      ...Query,
      take: perPage ?? 20,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      orderBy: {
        start_date: 'desc',
      },
    };
    // find all the market with the latest start date with its status and type
    try {
      console.log('fetching markets')
      const [total, markets] = await this.prismaService.$transaction([
        this.prismaService.market.count(),
        this.prismaService.market.findMany({
          ...Query,
          include: {
            transaction: true,
            receipts: true
          }
        }),
      ]);
      if (markets.length)
        return {
          status: 200,
          message: 'markets fetched successfully',
          // data: agentCode ? markets.map((m) => ({})) : [],
          data: markets,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
      else
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'No markets found ',
          data: [],
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
    } catch (error) {
      this.logger.error('Error fetching markets', MarketsService.name);
      throw new NotFoundException('Error fetching markets');
    }
  }

  async findOne(market_id: string) {

    try {
      const result = await this.prismaService.market.findUnique({
        where: {
          id: market_id
        },
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `market fetched successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to fetch market`,
        };
    } catch (err) {
      this.logger.error(
        `Can't find a market with market_id ${market_id} \n\n ${err}`,
        MarketsService.name,
      );
      throw new NotFoundException(
        "Can't find a market with market_id " + market_id,
      );
    }
  }

  async update({
    id,
    user_id,
    updateMarketDto,
  }: {
    id: string;
    user_id: string;
    updateMarketDto: Prisma.MarketUpdateInput;
  }) {

    // check if the market exists first
    const existingMarket = await this.findOne(id);
    if (typeof existingMarket == 'undefined')
      throw new HttpException(` No market with that Id`, HttpStatus.BAD_REQUEST);


    try {
      const result = await this.prismaService.market.update({
        data: updateMarketDto,
        where: {
          id,
        },
      });

      if (result)
        return {
          data: result,
          status: HttpStatus.OK, // the resource is return to be used by the client
          message: `market updated successfully`,
        };
      else
        return {
          data: null,
          status: HttpStatus.BAD_REQUEST,
          message: `Failed to update market`,
        };
    } catch (err) {
      this.logger.error(
        `Can't update a market with id  ${id} \n\n ${err}`,
        MarketsService.name,
      );
      throw new InternalServerErrorException(
        "Can't update a market with id " + id,
      );
    }
  }


  // update a single market
  async remove({ market_id, user_id }: { market_id: string, user_id: string }) {
    try {
      const result = await this.prismaService.market.delete({
        where: {
          id: market_id,
        }
      });

      if (result)
        return {
          data: null,
          status: HttpStatus.NO_CONTENT,
          message: `market deleted successfully`,
        };
      else
        return {
          data: null,
          status: HttpStatus.BAD_REQUEST,
          message: `Failed to delete market`,
        };
    } catch (err) {
      this.logger.error(
        "Can't delete a market with market_id " + market_id + '\n\n ' + err,
        MarketsService.name,
      );
      throw new InternalServerErrorException(
        "Can't delete a market with market_id " + market_id,
      );
    }
  }

  // get the assigned market 
  async getTheAssignedMarket(agentCode: string, company_id: string) {
    try {
      const currentData = new Date(Date.now()).toISOString();
      console.log("request market by agent code: " + agentCode);
      const listOfMarkets = await this.projectAssigneeService.findOne(agentCode);
      const marketUUID = listOfMarkets?.data?.[0];
      console.log("corresponding agent code UUID: " + marketUUID);
      return await this.prismaService.market.findFirst({
        where: {
          AND: [
            { code: marketUUID },
            { company_id },
            { status: CampaignStatus.OPEN }, // selct open market.
            { start_date: { gte: currentData } }
          ]
        },
        select: {
          id: true,
          start_date: true,
          end_date: true,
          status: true,
          company_id: true,
        }
      })
    } catch (error) {
      this.logger.error(` errror getting the market assigned to this agent code: ${agentCode}. error: ${error}`)
      throw new HttpException(`errror getting the market assigned to this agent code:`, HttpStatus.NOT_FOUND)
    }
  }

}
