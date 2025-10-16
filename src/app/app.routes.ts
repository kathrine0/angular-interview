import { Routes } from '@angular/router';
import { Exercise1Component } from './exercise1/exercise1';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/exercise1',
    pathMatch: 'full',
  },
  {
    path: 'exercise1',
    component: Exercise1Component,
  },
];
