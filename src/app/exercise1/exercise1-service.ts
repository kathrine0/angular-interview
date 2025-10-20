import { Injectable } from '@angular/core';
import { Subject, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  content: string;
  likes: number;
}

@Injectable({
  providedIn: 'root'
})
export class Exercise1Service {

  public users$ = new Subject<User[]>();

  constructor() { }

  // Simulate API call
  loadUsers() {
    setTimeout(() => {
      this.users$.next([
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'pending' },
        { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'active' }
      ]);
    }, 100);
  }
}
