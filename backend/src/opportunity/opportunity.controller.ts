import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OpportunityService } from './opportunity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateOpportunityDto,
  UpdateOpportunityDto,
  CreatePositionDto,
  UpdatePositionDto,
  CreatePositionSkillRequirementDto,
  UpdatePositionSkillRequirementDto,
} from './dto/opportunity.dto';

@Controller('opportunities')
export class OpportunityController {
  constructor(private opportunityService: OpportunityService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOpportunity(@Req() req, @Body() dto: CreateOpportunityDto) {
    return this.opportunityService.createOpportunity(req.user.userId, dto);
  }

  @Get()
  async getOpportunities(
    @Query('jenis') jenis?: string,
    @Query('kategori') kategori?: string,
    @Query('kampus') kampus?: string,
    @Query('status') status?: string,
  ) {
    return this.opportunityService.getOpportunities({
      jenis,
      kategori,
      kampus,
      status,
    });
  }

  @Get(':id')
  async getOpportunity(@Param('id') id: string) {
    return this.opportunityService.getOpportunityById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateOpportunity(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    return this.opportunityService.updateOpportunity(req.user.userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOpportunity(@Req() req, @Param('id') id: string) {
    return this.opportunityService.deleteOpportunity(req.user.userId, id);
  }

  // Position endpoints
  @Post(':opportunityId/positions')
  @UseGuards(JwtAuthGuard)
  async createPosition(
    @Req() req,
    @Param('opportunityId') opportunityId: string,
    @Body() dto: CreatePositionDto,
  ) {
    return this.opportunityService.createPosition(req.user.userId, opportunityId, dto);
  }

  @Patch('positions/:positionId')
  @UseGuards(JwtAuthGuard)
  async updatePosition(
    @Req() req,
    @Param('positionId') positionId: string,
    @Body() dto: UpdatePositionDto,
  ) {
    return this.opportunityService.updatePosition(req.user.userId, positionId, dto);
  }

  @Delete('positions/:positionId')
  @UseGuards(JwtAuthGuard)
  async deletePosition(@Req() req, @Param('positionId') positionId: string) {
    return this.opportunityService.deletePosition(req.user.userId, positionId);
  }

  // Skill requirements endpoints
  @Post('positions/:positionId/requirements')
  @UseGuards(JwtAuthGuard)
  async createSkillRequirement(
    @Req() req,
    @Param('positionId') positionId: string,
    @Body() dto: CreatePositionSkillRequirementDto,
  ) {
    return this.opportunityService.createSkillRequirement(
      req.user.userId,
      positionId,
      dto,
    );
  }

  @Patch('requirements/:requirementId')
  @UseGuards(JwtAuthGuard)
  async updateSkillRequirement(
    @Req() req,
    @Param('requirementId') requirementId: string,
    @Body() dto: UpdatePositionSkillRequirementDto,
  ) {
    return this.opportunityService.updateSkillRequirement(
      req.user.userId,
      requirementId,
      dto,
    );
  }

  @Delete('requirements/:requirementId')
  @UseGuards(JwtAuthGuard)
  async deleteSkillRequirement(
    @Req() req,
    @Param('requirementId') requirementId: string,
  ) {
    return this.opportunityService.deleteSkillRequirement(
      req.user.userId,
      requirementId,
    );
  }

  // Matching endpoints
  @Get('positions/:positionId/matches')
  async getMatches(@Param('positionId') positionId: string) {
    return this.opportunityService.getMatchesForPosition(positionId);
  }
}
