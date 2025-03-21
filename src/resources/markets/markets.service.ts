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
import { CampaignService } from '../campaigns/campaigns.service';
import { UUID } from 'sequelize';

@Injectable()
export class MarketsService {
  private readonly logger = new LoggerService(MarketsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly projectAssigneeService: ProjectAssigneeService,
    private campaignService: CampaignService
  ) { }


  async create({
    createMarketDto,
    user_id,
    company_id
  }: {
    createMarketDto: Prisma.MarketUncheckedCreateInput;
    user_id: string;
    company_id: string
  }) {

    //validate date so that end date should be greater than start date
    if (createMarketDto.start_date > createMarketDto.end_date)
      return {
        data: null,
        status: HttpStatus.BAD_REQUEST,
        message: `End date should be greater than or equal to start date`,
      };

    const { uuid: UID, code: market_code } = generateMapping(crypto.randomUUID());
    await this.projectAssigneeService.create({
      agentCode: market_code,
      projectCodes: [UID],
      company_id,
      project_type: "MARKET"
    })
    try {
      const result = await this.prismaService.market.create({
        data: {
          ...createMarketDto,
          code: UID,
          end_date: "1970-01-01T00:00:00+01:00",
        },
      });

      if (result)
        return {
          data: { ...result, code: market_code },
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

    const {
      status, type, page, perPage,
      search, campaign_id, agentCode } = query;

    const where: any = {};

    console.log({ company_id, campaign_id })

    if (status) {
      where['status'] = status;
    }

    if (type) {
      where['type'] = type;
    }

    if (campaign_id) {
      where['campaign_id'] = (campaign_id).slice(0, -1)
    }

    if (company_id) {
      where['company_id'] = company_id;
    }

    if (agentCode) {

      return await this.getTheAssignedMarket(agentCode, company_id)
    }

    if (search)
      where["search"] = search;

    const queryOptions = {
      where,
      take: perPage ?? 20,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      orderBy: {
        start_date: 'desc' as const,
      },

    };
    // find all the market with the latest start date with its status and type
    try {

      const [total, markets] = await this.prismaService.$transaction([
        this.prismaService.market.count({
          where
        }),
        this.prismaService.market.findMany(queryOptions),
      ]);

      // Get list of market uuid code
      if (markets.length) {
        const listOfUuidCodes: any[] = markets.map((m) => m.code)

        // Get all corresponding 4 digits codes for each market
        const assignedMarket = await this.projectAssigneeService.getAllTheAssigneesCodesFromAListOfProjectUuidsOfACompany(listOfUuidCodes, <string>company_id)

        // create a mapping for matching uuids
        const mappedList = assignedMarket?.data?.flatMap(assigne => assigne.projectCodes.filter(uuid => listOfUuidCodes.includes(uuid)).map(uuid => ({
          agentCode: assigne.agentCode,
          uuid: uuid
        })))

        // Assigne corresponding code to each market
        const marketResponse = mappedList?.reduce((acc, curr, index) => {
          if (acc.find(p => p.code === curr.uuid)) {
            const val = acc[index]
            acc = [...acc, { ...val, code: curr.agentCode }]
          }
          return acc
        }, markets)

        // this comes duplicated. So we need to filter. TODO: Find out what is the problem
        let marketResult = []
        if (marketResponse) {
          for (const item of marketResponse) {
            if (item.code?.length && item.code?.length <= 5) {
              marketResult.push(item)
            }
          }
        }

        return {
          status: 200,
          message: 'markets fetched successfully',
          // data: agentCode ? markets.map((m) => ({})) : [],
          data: marketResult,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20 - 1,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
      }
      else return {
        status: HttpStatus.NOT_FOUND,
        message: 'No markets found ',
        data: [],
        total,
        page: query.page ?? 0,
        perPage: query.perPage ?? 20,
        totalPages: Math.ceil(total / (query.perPage ?? 20)),
      };
    } catch (error) {
      this.logger.error(`Error fetching markets' \n\n, ${error}`, MarketsService.name);
      throw new NotFoundException('Error fetching markets');
    }
  }

  // Find all company's markets codes
  async findAllCompanyMarket(query: Partial<PaginationMarketQueryDto> | any, company_id: string) {
    const { campaign_id, type } = query

    try {
      const [total, markets] = await this.prismaService.$transaction([
        this.prismaService.market.count(),
        this.prismaService.market.findMany({
          where: {
            company_id,
            campaign_id
          }, select: {
            id: true,
            supplier: true,
            code: true,
            location: true,
          }
        })
      ])
      if (typeof markets != 'undefined' && markets.length) {
        const listOfUuidCodes: any[] = markets?.map((p) => p.code)
        const assignees = await this.projectAssigneeService.getAllTheAssigneesCodesFromAListOfProjectUuidsOfACompany(listOfUuidCodes, <string>company_id)

        // create aa mapping for matching uuids
        const mappedList = assignees?.data?.flatMap(assignee => assignee.projectCodes.filter(uuid => listOfUuidCodes.includes(uuid)).map((uuid) => ({
          agentCode: assignee.agentCode,
          uuid: uuid
        })))

        // assign corresponding code to eact market
        const projectResponse = mappedList?.reduce((acc, curr, index) => {
          if (acc.find(p => p.code === curr.uuid)) {
            const val = acc[index]
            acc = [...acc, { ...val, code: curr.agentCode }]
          }
          return acc
        }, markets);

        // send only projects with 4 digit code
        let result: any[] = []
        if (projectResponse) {
          for (const item of projectResponse) {
            if (item.code?.length && item.code.length < 5) {
              result.push(item)
            }
          }
        }

        return {
          status: 200,
          message: 'markets fetched successfully',
          data: result,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };

      } else return {
        status: 404,
        message: 'No projects found',
        data: [],
        total,
        page: query.page ?? 0,
        perPage: query.perPage ?? 20,
        totalPages: Math.ceil(total / (query.perPage ?? 20)),
      };

    } catch (error) {
      this.logger.error('Error fetching markets', MarketsService.name);
      throw new NotFoundException('Error fetching markets codes');
    }
  }

  async findOne(market_id: string) {

    // get current campain
    const currentCampaign = await this.campaignService.getCurrentCampaign();
    //  market_id.length <= 5 means the market_id is the code.


    try {
      const result = await this.prismaService.market.findFirst({
        where: {
          id: market_id,
          campaign_id: currentCampaign?.id as string
        },
        include: {
          transaction: true,
          receipts: true,
        },
        // select: {
        //   market_number: true,
        //   start_date: true,
        //   end_date: true,
        //   status: true,
        //   company_id: true,
        // },
        orderBy: {
          created_at: 'desc'
        }
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
    updateMarketDto,
  }: {
    id: string;
    updateMarketDto: Prisma.MarketUpdateInput;
  }) {

    // check if the market exists first
    const existingMarket = await this.findOne(id);
    if (!existingMarket)
      throw new HttpException(`There is No existing market with that Id `, HttpStatus.BAD_REQUEST);

    console.log("\n\n incoming updateMarketDto: ", updateMarketDto);

    try {
      const result = await this.prismaService.market.update({
        data: updateMarketDto,
        where: {
          id,
        },
      });

      console.log("\n\n updated market data: ", result);

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
        "Can't delete a market with market_id  " + market_id + '\n\n ' + err,
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
      const currentDate = new Date(Date.now()).toISOString();

      console.log("request market by agent code: " + agentCode);
      const listOfMarkets = await this.projectAssigneeService.findOne(agentCode);
      const marketUUID = listOfMarkets?.data?.[0];

      console.log({ marketUUID, company_id, status: CampaignStatus.OPEN, start_date: { gte: currentDate } })
      const data = await this.prismaService.market.findFirst({
        where: {
          AND: [
            { code: marketUUID }, // sselect market by uuid
            { company_id }, //select current user connected company market
            { status: CampaignStatus.OPEN }, // select open market.
            // { start_date: { gte: currentDate } }
          ]

        },
        include: {
          company: {
            select: {
              name: true,
              logo: true
            }
          }
        }
      });

      if (data)
        return {
          data: {
            company_id: data?.company_id,
            market_number: data?.id,
            start_date: data?.start_date,
            end_date: data?.end_date,
            status: data?.status,
            price_of_day: data?.price_of_theday,
            location: data?.location,
            type_of_market: data?.type_of_market,
            company_name: data?.company?.name,
            company_logo: data?.company?.logo,
            supplier: data?.supplier
          },
          status: 200,
          message: `market fetched successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to fetch market`,
        };
    } catch (error) {
      this.logger.error(` errror getting the market assigned to this agent code: ${agentCode}. error: ${error}`)
      throw new HttpException(`errror getting the market assigned to this agent code:`, HttpStatus.NOT_FOUND)
    }
  }

}
