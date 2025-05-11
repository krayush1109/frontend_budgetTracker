// import { Component } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { NavbarComponent } from '../navbar/navbar.component';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-dashboard',
//   imports: [NavbarComponent,CommonModule,RouterModule],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.css'
// })
// export class DashboardComponent {
//   // constructor(private router: Router) {}

//   // navigateTo(page: string) {
//   //   this.router.navigate([`/${page}`]);
//   // }

//   // logout() {
//   //   // Implement your logout logic here
//   //   console.log('Logged out');
//   // }
// }


import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { BudgetService, BudgetSummary } from '../../services/budget.service';
import { HttpClientModule } from '@angular/common/http';
import { IncomeService } from '../../services/income.service';
import { ExpenseService } from '../../services/expense.service';
// Chart.js is not a direct dependency in Angular, 
// so we need to ensure it's properly imported
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  providers: [BudgetService] // Add BudgetService to component providers
})
export class DashboardComponent implements OnInit {
  budgetSummary: BudgetSummary = {
    totalIncome: 0,
    totalExpense: 0,
    savings: 0,
    incomeByCategory: {},
    expenseByCategory: {}
  };
  
  loading = true;
  error = '';

  constructor(
    private budgetService: BudgetService,
    private incomeService: IncomeService,
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBudgetData();
  }

  loadBudgetData(): void {
    this.budgetService.getBudgetSummary().subscribe({
      next: (data) => {
        this.budgetSummary = data;
        this.loading = false;
        // Create chart after data is loaded
        setTimeout(() => {
          this.createChart();
        }, 100);
      },
      error: (err) => {
        this.error = 'Failed to load budget data';
        this.loading = false;
        console.error('Error loading budget data:', err);
      }
    });
  }

  createChart(): void {
    const ctx = document.getElementById('budgetChart') as HTMLCanvasElement;
    
    if (!ctx) {
      console.error('Cannot find chart canvas element');
      return;
    }

    // Basic bar chart for income vs expenses
    const mainChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          label: 'Budget Overview',
          data: [this.budgetSummary.totalIncome, this.budgetSummary.totalExpense],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',  // Green for income
            'rgba(255, 99, 132, 0.6)'   // Red for expenses
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Create category charts if you have categories
    if (Object.keys(this.budgetSummary.incomeByCategory).length > 0) {
      this.createCategoryChart();
    }
  }

  createCategoryChart(): void {
    const ctxCategory = document.getElementById('categoryChart') as HTMLCanvasElement;
    
    if (!ctxCategory) {
      console.error('Cannot find category chart canvas element');
      return;
    }

    // Get categories and their values
    const incomeCategories = Object.keys(this.budgetSummary.incomeByCategory);
    const incomeValues = incomeCategories.map(cat => this.budgetSummary.incomeByCategory[cat]);
    
    const expenseCategories = Object.keys(this.budgetSummary.expenseByCategory);
    const expenseValues = expenseCategories.map(cat => this.budgetSummary.expenseByCategory[cat]);

    // Generate colors for categories
    const generateColors = (count: number, alpha: number) => {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const hue = (i * 137) % 360; // Golden angle approximation for even distribution
        colors.push(`hsla(${hue}, 70%, 60%, ${alpha})`);
      }
      return colors;
    };

    // Create pie chart for expense categories
    new Chart(ctxCategory, {
      type: 'pie',
      data: {
        labels: expenseCategories,
        datasets: [{
          label: 'Expenses by Category',
          data: expenseValues,
          backgroundColor: generateColors(expenseCategories.length, 0.7),
          borderColor: generateColors(expenseCategories.length, 1),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15
            }
          },
          title: {
            display: true,
            text: 'Expenses by Category'
          }
        }
      }
    });
  }
}