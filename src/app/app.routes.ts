import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './component/login/login.component';

import { DashboardComponent } from './component/dashboard/dashboard.component';

import { AddIncomeComponent } from './component/add-income/add-income.component';
import { ExpensesComponent } from './component/expenses/expenses.component';



export const routes: Routes = [
    {path:'',component:HomeComponent },
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},

    { path: 'add-income', component: AddIncomeComponent },
    { path: 'expenses', component: ExpensesComponent },

    { path: 'dashboard', component: DashboardComponent }
    
    
    
];
