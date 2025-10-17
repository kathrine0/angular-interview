import { Routes } from '@angular/router';
import { Exercise1Component } from './exercise1/exercise1';
import { Exercise2FormsComponent } from './exercise2-forms/exercise2-forms';
import { Exercise3DIComponent } from './exercise3-di/exercise3-di';

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
  {
    path: 'exercise2-forms',
    component: Exercise2FormsComponent,
  },
  {
    path: 'exercise3-di',
    component: Exercise3DIComponent,
  },
];
