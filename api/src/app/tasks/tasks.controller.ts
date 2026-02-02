import { Controller, Get, Post, Put, Delete, Req, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '@myorg/auth'
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from '@myorg/data';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
    constructor(private taskService: TasksService) {}

    @Post()
    create(@Req() req: any, @Body() dto: CreateTaskDto){
        return this.taskService.create(req.user, dto)
    }

    @Get()
    findAll(@Req() req: any){
        return this.taskService.findAll(req.user)
    }

    @Put(':id')
    update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.taskService.update(req.user, id, dto)
    }

    @Delete(":id")
    delete(@Req() req: any, @Param('id') id: string){
        return this.taskService.remove(req.user, id)
    }
}