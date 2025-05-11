import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { Expenses } from '../../models/expenses';
import { NavbarComponent } from '../navbar/navbar.component';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, FormsModule],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit {
  expenseForm!: FormGroup;
  expenses: Expenses[] = [];
  predefinedCategories = ['Food', 'Transport', 'Shopping', 'Bills'];
  newCategory = '';
  selectedCategory = '';

  constructor(private fb: FormBuilder, private expensesService: ExpenseService) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      categoryName: ['', Validators.required],
      description: [''],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      newCategory: [''],
    });

    // Fetch expenses from backend on component load
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expensesService.getExpensesOfUser().subscribe(
      (data) => {
        this.expenses = data;
        console.log(data);
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  addExpense(): void {
    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;
      
      this.expensesService.createExpense(expenseData).subscribe(
        (response) => {
          console.log('Expense added:', response);
          alert('Expense added successfully!');
          this.loadExpenses(); // Refresh the list after adding
          this.expenseForm.reset();
        },
        (error) => {
          console.error('Error adding expense:', error);
          alert('Failed to add expense. Try again.');
        }
      );
    }
  }

  deleteExpense(id: number): void {
    this.expensesService.deleteExpense(id).subscribe(
      () => {
        console.log('Expense deleted successfully');
        alert('Expense deleted successfully!');
        this.loadExpenses(); // Refresh list after deletion
      },
      (error) => {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Try again.');
      }
    );
  }

  addCategory(): void {
    const category = this.expenseForm.get('newCategory')?.value?.trim();
    if (category && !this.predefinedCategories.includes(category)) {
      this.predefinedCategories.push(category);
      this.expenseForm.get('newCategory')?.setValue(''); // Clears the input field
    }
  }

  // ✅ Updated Filtering Logic
  get filteredExpenses(): Expenses[] {
    if (!this.selectedCategory || this.selectedCategory === '') {
      return this.expenses; // Show all expenses if no category is selected
    }
    return this.expenses.filter(expense => expense.categoryName === this.selectedCategory);
  }
}