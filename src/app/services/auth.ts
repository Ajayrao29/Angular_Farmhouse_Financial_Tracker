import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, of, catchError } from 'rxjs';

export interface User {
    id?: string;
    name: string;
    email: string;
    password?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3002/users';
    // Signal to track if user is logged in
    currentUser = signal<User | null>(null);

    constructor(private http: HttpClient, private router: Router) {
        // Check local storage on init
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser.set(JSON.parse(storedUser));
        }
    }

    login(email: string, password: string): Observable<boolean> {
        return this.http.get<User[]>(this.apiUrl, {
            params: {
                email: email,
                password: password
            }
        }).pipe(
            map(users => {
                if (users.length > 0) {
                    const user = users[0];
                    this.setCurrentUser(user);
                    return true;
                }
                return false;
            }),
            catchError(() => of(false))
        );
    }

    register(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user).pipe(
            tap(createdUser => {
                this.setCurrentUser(createdUser);
            })
        );
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser.set(null);
        this.router.navigate(['/login']);
    }

    private setCurrentUser(user: User) {
        // Don't store password involved in real app, simply storing here for mock
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser.set(user);
    }

    isLoggedIn(): boolean {
        return !!this.currentUser();
    }
}
