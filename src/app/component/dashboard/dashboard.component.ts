import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { BudgetService, BudgetSummary } from '../../services/budget.service';
import { HttpClientModule } from '@angular/common/http';
import { IncomeService } from '../../services/income.service';
import { ExpenseService } from '../../services/expense.service';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, CommonModule, RouterModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  providers: [BudgetService]
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
        setTimeout(() => {
          this.createCharts();
        }, 100);
      },
      error: (err) => {
        this.error = 'Failed to load budget data';
        this.loading = false;
        console.error('Error loading budget data:', err);
      }
    });
  }

  createCharts(): void {
    this.createIncomeExpenseChart();
    this.createCategoryChart();
  }

  createIncomeExpenseChart(): void {
    const ctx = document.getElementById('budgetChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
          label: 'Budget Overview',
          data: [this.budgetSummary.totalIncome, this.budgetSummary.totalExpense],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  createCategoryChart(): void {
    const ctxCategory = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctxCategory) return;

    const expenseCategories = Object.keys(this.budgetSummary.expenseByCategory);
    const expenseValues = expenseCategories.map(cat => this.budgetSummary.expenseByCategory[cat]);

    if (expenseCategories.length === 0) return; // Prevent empty chart errors

    // 🎨 Generate unique colors for categories
    const generateColors = (count: number) => {
      return Array.from({ length: count }, (_, i) => `hsla(${i * 36}, 70%, 60%, 0.7)`);
    };

    new Chart(ctxCategory, {
      type: 'pie',
      data: {
        labels: expenseCategories,  // ✅ Ensures labels appear
        datasets: [{
          label: 'Expenses by Category',
          data: expenseValues,  // ✅ Maps category-wise expense correctly
          backgroundColor: generateColors(expenseCategories.length),
          borderColor: generateColors(expenseCategories.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Expenses by Category' }
        }
      }
    });
  }
}
