import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent {
    email = '';
    password = '';
    error = '';   

    constructor (private auth: AuthService, private router: Router){}

    login() {
        this.auth.login(this.email, this.password).subscribe({
            next: () => this.router.navigate(['/tasks']),
            error: (err) => (this.error = "Login failed") 
        });
    }
}