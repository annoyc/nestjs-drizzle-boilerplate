import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';

import {
  UpdatePostDto,
  ZodUpdatePostValidationPipe,
} from './dto/update-post.dto';
import { CreatePostDto, ZodPostValidationPipe } from './dto/create-post.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '创建帖子' })
  @ApiResponse({ status: 200, description: '帖子创建成功' })
  @ApiResponse({ status: 400, description: '数据验证失败' })
  create(@Body(new ZodPostValidationPipe()) createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有帖子' })
  @ApiResponse({ status: 200, description: '成功获取所有帖子' })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定帖子' })
  @ApiResponse({ status: 200, description: '成功获取帖子信息' })
  @ApiResponse({ status: 404, description: '帖子不存在' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新帖子' })
  @ApiResponse({ status: 200, description: '帖子更新成功' })
  @ApiResponse({ status: 400, description: '数据验证失败' })
  @ApiResponse({ status: 404, description: '帖子不存在' })
  update(
    @Param('id') id: string,
    @Body(new ZodUpdatePostValidationPipe()) updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除帖子' })
  @ApiResponse({ status: 200, description: '帖子删除成功' })
  @ApiResponse({ status: 404, description: '帖子不存在' })
  @ApiResponse({ status: 400, description: '删除帖子失败' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
