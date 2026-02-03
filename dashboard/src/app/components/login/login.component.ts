import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

@Component({
    standalone: true,
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [CommonModule, FormsModule] 
})
export class LoginComponent {
    email = '';
    password = '';
    error = '';   

    constructor (private auth: AuthService, private router: Router){}

    login() {
        this.auth.login(this.email, this.password).subscribe({
            next: () => this.router.navigate(['/tasks']),
            error: (err) => (this.error = "Invalid Credentials") 
        });
    }
}