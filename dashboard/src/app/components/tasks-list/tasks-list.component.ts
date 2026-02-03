import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { Task, CreateTaskDto } from '@myorg/data'
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tasks-list',
    templateUrl: './tasks-list.component.html',
    standalone: false
})
export class TasksListComponent implements OnInit {
    tasks: Task[] = [];
    filteredTasks: Task[] = [];
    newTaskTitle = '';
    newTaskCategory = 'Work';
    categories = ['Work', 'Personal', 'Shopping', 'Health'];
    selectedFilter = 'all';
    loading = false;
    error: string | null = null;

    constructor(
        private taskService: TaskService,
        private cdr: ChangeDetectorRef,
        private auth: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks() {
        this.loading = true;
        this.error = null;
        this.taskService.getTasks().subscribe({
            next: (tasks) => {
                this.tasks = tasks;
                this.applyFilter();
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.error = 'Failed to load tasks';
                console.error(err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    createTask() {
        if (!this.newTaskTitle.trim()) {
            this.error = 'Task title is required';
            return;
        }

        const dto: CreateTaskDto = {
            title: this.newTaskTitle,
            category: this.newTaskCategory,
        };

        this.loading = true;
        this.taskService.createTask(dto).subscribe({
            next: (created) => {
                this.newTaskTitle = '';
                this.newTaskCategory = 'Work';
                this.error = null;
                if (created && (created as any).id) {
                    this.tasks.unshift(created as Task);
                    this.applyFilter();
                    this.loading = false;
                    this.cdr.detectChanges();
                    return;
                }
                this.loadTasks();
            },
            error: (err) => {
                this.error = 'Failed to create task';
                console.error(err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    applyFilter() {
        switch (this.selectedFilter) {
            case 'completed':
                this.filteredTasks = this.tasks.filter(t => t.completed);
                break;
            case 'pending':
                this.filteredTasks = this.tasks.filter(t => !t.completed);
                break;
            default:
                this.filteredTasks = [...this.tasks];
        }
        this.cdr.detectChanges();
    }

    toggleComplete(task: Task) {
        this.loading = true;
        this.taskService.updateTask(task.id, { completed: !task.completed }).subscribe({
            next: () => {
                this.loadTasks();
            },
            error: (err) => {
                this.error = 'Failed to update task';
                console.error(err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    deleteTask(task: Task) {
        if (confirm(`Delete "${task.title}"?`)) {
            this.loading = true;
            this.taskService.deleteTask(task.id).subscribe({
                next: () => this.loadTasks(),
                error: (err) => {
                    this.error = 'Failed to delete task';
                    console.error(err);
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });
        }
    }

    getCategoryBadgeColor(category: string): string {
        const colors: { [key: string]: string } = {
            Work: 'bg-blue-100 text-blue-800',
            Personal: 'bg-purple-100 text-purple-800',
            Shopping: 'bg-green-100 text-green-800',
            Health: 'bg-red-100 text-red-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}