import { Controller, Get, Post, Put, Delete, Req, Param, Body, UseGuards, BadRequestException, Logger } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '@myorg/auth'
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '@myorg/data';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
    private logger = new Logger('TaskController');
    
    constructor(private taskService: TasksService) {}

    @Post()
    async create(@Req() req: any, @Body() dto: CreateTaskDto){
        try {
            if (!dto.title || !dto.category) {
                throw new BadRequestException('Title and category are required');
            }
            return await this.taskService.create(req.user, dto);
        } catch (error) {
            this.logger.error('Create task error:', error);
            throw error;
        }
    }

        @Put(':id')
        async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto){
            try {
                return await this.taskService.update(req.user, id, dto);
            } catch (error) {
                this.logger.error('Update task error:', error);
                throw error;
            }
        }

        @Delete(':id')
        async remove(@Req() req: any, @Param('id') id: string){
            try {
                return await this.taskService.remove(req.user, id);
            } catch (error) {
                this.logger.error('Delete task error:', error);
                throw error;
            }
        }

    @Get()
    async findAll(@Req() req: any){
        try {
            return await this.taskService.findAll(req.user);
        } catch (error) {
            this.logger.error('Find all tasks error:', error);
            throw error;
        }
    }

    @Put(':id')
    async update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
        try {
            return await this.taskService.update(req.user, id, dto);
        } catch (error) {
            this.logger.error('Update task error:', error);
            throw error;
        }
    }

    @Delete(":id")
    async delete(@Req() req: any, @Param('id') id: string){
        try {
            return await this.taskService.remove(req.user, id);
        } catch (error) {
            this.logger.error('Delete task error:', error);
            throw error;
        }
    }
}