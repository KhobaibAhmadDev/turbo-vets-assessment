import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs';
import { CreateTaskDto, Task, UpdateTaskDto } from '@myorg/data'

@Injectable({ providedIn: 'root'})
export class TaskServie {
    private apiUrl = 'http://localhost:3333/tasks';

    constructor(private http: HttpClient) {}

    getTasks(): Observable<Task[]>{
        return this.http.get<Task[]>(this.apiUrl)
    }

    createTask(dto: CreateTaskDto): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, dto);
    }

    updateTask(id: string, dto: UpdateTaskDto): Observable<Task>{
        return this.http.put<Task>(`${this.apiUrl}/${id}`, dto)
    }

    deleteTask(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
    }
}