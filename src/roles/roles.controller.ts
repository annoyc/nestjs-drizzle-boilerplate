import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleType, ZodRoleValidationPipe } from './dto/create-role.dto';

@ApiTags('角色管理')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Post()
  @ApiOperation({ summary: '创建角色' })
  @ApiResponse({ status: 200, description: '创建角色成功' })
  @ApiResponse({ status: 400, description: '数据验证失败' })
  create(@Body(new ZodRoleValidationPipe()) createPostDto: CreateRoleType) {
    return this.rolesService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有角色' })
  @ApiResponse({ status: 200, description: '成功获取所有角色' })
  findAll() {
    return this.rolesService.findAll();
  }

  // @Get(':id')
  // @ApiOperation({ summary: '获取指定帖子' })
  // @ApiResponse({ status: 200, description: '成功获取帖子信息' })
  // @ApiResponse({ status: 404, description: '帖子不存在' })
  // findOne(@Param('id') id: string) {
  //   return this.rolesService.findOne(+id);
  // }

  // @Delete(':id')
  // @ApiOperation({ summary: '删除帖子' })
  // @ApiResponse({ status: 200, description: '帖子删除成功' })
  // @ApiResponse({ status: 404, description: '帖子不存在' })
  // @ApiResponse({ status: 400, description: '删除帖子失败' })
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }
}
