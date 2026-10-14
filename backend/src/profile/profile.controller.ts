import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto, CreatePortfolioLinkDto, UpdatePortfolioLinkDto } from './dto/profile.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('me')
  async getMyProfile(@Req() req) {
    return this.profileService.getProfile(req.user.userId);
  }

  @Patch('me')
  async updateMyProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(req.user.userId, dto);
  }

  @Get('me/portfolio')
  async getMyPortfolio(@Req() req) {
    return this.profileService.getPortfolioLinks(req.user.userId);
  }

  @Post('me/portfolio')
  async addPortfolioLink(@Req() req, @Body() dto: CreatePortfolioLinkDto) {
    return this.profileService.createPortfolioLink(req.user.userId, dto);
  }

  @Patch('me/portfolio/:id')
  async updatePortfolioLink(@Req() req, @Param('id') id: string, @Body() dto: UpdatePortfolioLinkDto) {
    return this.profileService.updatePortfolioLink(req.user.userId, id, dto);
  }

  @Delete('me/portfolio/:id')
  async deletePortfolioLink(@Req() req, @Param('id') id: string) {
    return this.profileService.deletePortfolioLink(req.user.userId, id);
  }
}
