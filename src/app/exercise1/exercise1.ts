import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { delay, of } from 'rxjs';
import { Exercise1Service, Post, User } from './exercise1-service';

@Component({
  selector: 'app-exercise1',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './exercise1.html',
  styleUrl: './exercise1.scss',
})
export class Exercise1Component {
  private exercise1Service = inject(Exercise1Service);

  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  userPosts: Post[] = [];

  searchTerm = '';
  statusFilter = 'all';
  sortBy = 'name';
  isLoading = false;

  constructor() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.exercise1Service.loadUsers();

    this.exercise1Service.users$.subscribe((users) => {
      this.users = users;
      this.filteredUsers = users;
      this.isLoading = false;

      if (users.length > 0) {
        this.selectedUser = users[0];
        this.loadPostsForUser(users[0].id).subscribe((posts) => {
          this.userPosts = posts;
        });
      }
    });
  }

  loadPostsForUser(userId: number) {
    return of([
      { id: 1, userId: userId, title: 'First Post', content: 'Content here', likes: 10 },
      { id: 2, userId: userId, title: 'Second Post', content: 'More content', likes: 25 },
      { id: 3, userId: userId, title: 'Third Post', content: 'Even more content', likes: 5 },
    ]).pipe(delay(100));
  }

  onSearchChange() {
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.applyStatusFilter();
    this.sortUsers();
  }

  onStatusFilterChange() {
    this.applyStatusFilter();
    this.sortUsers();
  }

  applyStatusFilter() {
    if (this.statusFilter !== 'all') {
      this.filteredUsers = this.filteredUsers.filter((user) => user.status === this.statusFilter);
    } else {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  sortUsers() {
    if (this.sortBy === 'name') {
      this.filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'email') {
      this.filteredUsers.sort((a, b) => a.email.localeCompare(b.email));
    } else if (this.sortBy === 'status') {
      this.filteredUsers.sort((a, b) => a.status.localeCompare(b.status));
    }
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.isLoading = true;

    this.exercise1Service.loadPostsForUser(user.id).subscribe((posts) => {
      this.userPosts = posts;
      this.isLoading = false;
    });
  }

  getActiveUsersCount(): number {
    return this.users.filter((u) => u.status === 'active').length;
  }
}
