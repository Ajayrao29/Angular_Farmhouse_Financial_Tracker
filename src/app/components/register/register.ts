import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class RegisterComponent {
    registerForm: FormGroup;
    errorMessage: string = '';
    isLoading = false;

    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    constructor() {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { 'mismatch': true };
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';
            const { name, email, password } = this.registerForm.value;

            this.authService.register({ name, email, password }).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/dashboard']);
                },
                error: () => {
                    this.isLoading = false;
                    this.errorMessage = 'Registration failed. Please try again.';
                }
            });
        } else {
            this.registerForm.markAllAsTouched();
        }
    }
}
