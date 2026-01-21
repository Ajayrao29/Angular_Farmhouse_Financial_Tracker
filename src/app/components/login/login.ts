import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage: string = '';
    isLoading = false;

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            const { email, password } = this.loginForm.value;

            this.authService.login(email, password).subscribe({
                next: (success) => {
                    this.isLoading = false;
                    if (success) {
                        this.router.navigate(['/dashboard']);
                    } else {
                        this.errorMessage = 'Invalid email or password';
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.errorMessage = 'An error occurred during login. Make sure the server is running.';
                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}
