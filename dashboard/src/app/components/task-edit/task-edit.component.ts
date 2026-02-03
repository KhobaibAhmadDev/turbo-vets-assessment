import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '@myorg/data';
import { TaskService } from '../../services/task.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-task-edit',
    templateUrl: './task-edit.component.html',
    imports: [
        ReactiveFormsModule, 
        CommonModule         
    ]
})
export class TaskEditComponent implements OnInit {
  taskForm: FormGroup;
  taskId!: string;

  constructor(
    private fb: FormBuilder,
    private tasksService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      completed: [false]
    });
  }

  ngOnInit() {
    this.taskId = this.route.snapshot.params['id'];
    this.tasksService.getTasks().subscribe(tasks => {
      const task = tasks.find(t => t.id === this.taskId) as Task;
      this.taskForm.patchValue(task);
    });
  }

  updateTask() {
    if (this.taskForm.valid) {
      this.tasksService.updateTask(this.taskId, this.taskForm.value).subscribe(() => {
        this.router.navigate(['/tasks']);
      });
    }
  }
}
