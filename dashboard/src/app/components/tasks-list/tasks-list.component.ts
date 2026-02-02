import { Component, OnInit } from '@angular/core'
import { Task } from '@myorg/data'
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'app-tasks-list',
    templateUrl: './tasks-list.component.html'
})
export class TasksListComponent implements OnInit {
    tasks: Task[] = [];

    constructor(private taskSerivce: TaskService) {}

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks() {
        this.taskSerivce.getTasks().subscribe(tasks => (this.tasks = tasks))
    }

    toggleComplete(task: Task) {
        this.taskSerivce.updateTask(task.id, { completed: !task.completed }).subscribe(() => this.loadTasks());
    }

    deleteTask(task: Task){
        this.taskSerivce.deleteTask(task.id).subscribe(() => this.loadTasks())
    }
}