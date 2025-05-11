import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { IncomeService } from './income.service';
import { ExpenseService } from './expense.service';

export interface BudgetItem {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface BudgetSummary {
  totalIncome: number;
  totalExpense: number;
  savings: number;
  incomeByCategory: { [key: string]: number };
  expenseByCategory: { [key: string]: number };
}

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  constructor(
    private incomeService: IncomeService,
    private expenseService: ExpenseService
  ) {}

  getBudgetSummary(): Observable<BudgetSummary> {
    return forkJoin({
      income: this.incomeService.getIncomeById(), // ✅ Assuming this requires an ID
      expenses: this.expenseService.getExpensesOfUser(), // ✅ Fetching all expenses instead of a single ID-based expense
    }).pipe(
      map((result) => {
        const incomeItem = result.income;
        const expenses = result.expenses || []; // Ensure expenses is always an array

        console.log('Income Data:', incomeItem);
        console.log('Expense Data:', expenses);

        const totalIncome = incomeItem ? incomeItem.amount : 0;
        const totalExpense = expenses.reduce(
          (sum, item) => sum + item.amount,
          0
        ); // Sum up all expenses

        const incomeByCategory: { [key: string]: number } = {};
        if (incomeItem) {
          const category = incomeItem.category || 'Uncategorized';
          incomeByCategory[category] = incomeItem.amount;
        }

        const expenseByCategory: { [key: string]: number } = {};
        expenses.forEach((expense) => {
          const category = expense.category || 'Uncategorized';
          expenseByCategory[category] =
            (expenseByCategory[category] || 0) + expense.amount;
        });

        return {
          totalIncome,
          totalExpense,
          savings: totalIncome - totalExpense,
          incomeByCategory,
          expenseByCategory,
        };
      })
    );
  }
}
