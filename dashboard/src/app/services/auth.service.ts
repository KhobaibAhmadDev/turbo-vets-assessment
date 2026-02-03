import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
    accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService{
    private apiUrl = 'http://localhost:3000';
    private tokenSubject = new BehaviorSubject<string | null>(null);

    constructor(private http: HttpClient) {
        const token = localStorage.getItem('token');
        this.tokenSubject.next(token);
    }

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/api/auth/login`, {email, password}).pipe(
            tap(res => {
                localStorage.setItem('token', res.accessToken);
                this.tokenSubject.next(res.accessToken);
            })
        );
    }

    logout(){
        localStorage.removeItem('token');
        this.tokenSubject.next(null);
    }

    get token() {
        return this.tokenSubject.value;
    }

    isLoggedIn(): boolean {
        return !!this.token;
    }
}