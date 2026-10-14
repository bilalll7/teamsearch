import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddUserSkillDto, UpdateUserSkillDto } from './dto/skills.dto';

@Controller('skills')
export class SkillsController {
  constructor(private skillsService: SkillsService) {}

  @Get('categories')
  async getCategories() {
    return this.skillsService.getCategories();
  }

  @Get()
  async getSkills(@Query('kategori') kategoriId?: string, @Query('search') search?: string) {
    return this.skillsService.getSkills(kategoriId, search);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMySkills(@Req() req) {
    return this.skillsService.getUserSkills(req.user.userId);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async addSkill(@Req() req, @Body() dto: AddUserSkillDto) {
    return this.skillsService.addUserSkill(req.user.userId, dto);
  }

  @Patch('me/:id')
  @UseGuards(JwtAuthGuard)
  async updateSkill(@Req() req, @Param('id') id: string, @Body() dto: UpdateUserSkillDto) {
    return this.skillsService.updateUserSkill(req.user.userId, id, dto);
  }

  @Delete('me/:id')
  @UseGuards(JwtAuthGuard)
  async deleteSkill(@Req() req, @Param('id') id: string) {
    return this.skillsService.deleteUserSkill(req.user.userId, id);
  }
}
