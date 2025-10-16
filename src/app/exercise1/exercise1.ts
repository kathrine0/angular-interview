import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Exercise1Service, User, Post } from './exercise1-service';

// BAD: Component has multiple responsibilities - no separation of concerns
// - Data fetching logic
// - Business logic (filtering, sorting)
// - Presentation logic
// - No ngOnDestroy for cleanup
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

  // BAD: No proper typing, public fields everywhere
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  userPosts: Post[] = [];

  searchTerm = '';
  statusFilter = 'all';
  sortBy = 'name';
  isLoading = false;

  // BAD: Constructor doing work, nested subscriptions without cleanup
  constructor() {
    this.loadData();
  }

  // BAD: Nested subscriptions (subscription hell)
  loadData() {
    this.isLoading = true;
    this.exercise1Service.loadUsers();

    // BAD: No unsubscribe, nested subscriptions
    this.exercise1Service.users$.subscribe((users) => {
      this.users = users;
      this.filteredUsers = users;
      this.isLoading = false;

      // BAD: Nested subscription level 1
      if (users.length > 0) {
        this.selectedUser = users[0];
        this.exercise1Service.loadPostsForUser(users[0].id).subscribe((posts) => {
          this.userPosts = posts;
        });
      }
    });
  }

  // BAD: Business logic in component
  onSearchChange() {
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.applyStatusFilter();
    this.sortUsers();
  }

  // BAD: More business logic in component
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

  // BAD: Sorting logic in component
  sortUsers() {
    if (this.sortBy === 'name') {
      this.filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'email') {
      this.filteredUsers.sort((a, b) => a.email.localeCompare(b.email));
    } else if (this.sortBy === 'status') {
      this.filteredUsers.sort((a, b) => a.status.localeCompare(b.status));
    }
  }

  // BAD: Nested subscriptions when selecting user
  selectUser(user: User) {
    this.selectedUser = user;
    this.isLoading = true;

    // BAD: No unsubscribe
    this.exercise1Service.loadPostsForUser(user.id).subscribe((posts) => {
      this.userPosts = posts;
      this.isLoading = false;
    });
  }

  // BAD: Calculating derived state in method instead of using computed or pipe
  getActiveUsersCount(): number {
    return this.users.filter((u) => u.status === 'active').length;
  }
}
