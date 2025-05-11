import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IncomeService } from '../../services/income.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-add-income',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.css'],
})
export class AddIncomeComponent implements OnInit {
  incomeForm!: FormGroup;
  budgetExceeded = false;
  budgetInvalid = false;
  // imagePath = 'assets/images/income-default.jpg'; // ✅ Default image
  imagePath = '19197498.jpg'; // ✅ Default image
  currentIncome = '-';
  currentBudget = '-';
  incomeId: number | null = null; // ✅ Keep income ID for updates
  savedIncomeData: any = null; // ✅ Stores API response for manual filling
  isFormDisabled = true; // ✅ Initially disable the form
  isUpdating = false; // ✅ Track when updating data

  constructor(private fb: FormBuilder, private incomeService: IncomeService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.trackBudgetChanges();
    this.loadIncome(); // ✅ Load income when the page loads
  }

  initializeForm(): void {
    this.incomeForm = this.fb.group({
      amount: [
        { value: null, disabled: this.isFormDisabled },
        [Validators.required, Validators.min(1)],
      ],
      description: [
        { value: '', disabled: this.isFormDisabled },
        Validators.required,
      ],
      date: [
        { value: new Date(), disabled: this.isFormDisabled },
        Validators.required,
      ],
      budget: [
        { value: null, disabled: this.isFormDisabled },
        [Validators.required, Validators.min(1)],
      ],
    });
  }

  trackBudgetChanges(): void {
    this.incomeForm.get('budget')?.valueChanges.subscribe((budget) => {
      const amount = this.incomeForm.get('amount')?.value;
      this.budgetExceeded = amount && budget > amount * 0.8;
      this.budgetInvalid = amount && budget > amount;
    });
  }

  loadIncome(): void {
    this.incomeService.getIncomeById().subscribe(
      (incomeData) => {
        if (incomeData) {
          console.log('Loaded Income:', incomeData);
          this.savedIncomeData = incomeData; // ✅ Store retrieved data separately
          this.incomeId = incomeData.incomeId ?? null; // ✅ Keep income ID
          this.currentIncome = incomeData.amount || '-';
          this.currentBudget = incomeData.budget || '-';
        }
      },
      (error) => {
        console.error('Error loading income:', error);
      }
    );
  }

  enableFormForUpdate(): void {
    this.isFormDisabled = false;
    this.isUpdating = true;
    this.incomeForm.enable(); // ✅ Enable all fields
    if (this.savedIncomeData) {
      this.incomeForm.patchValue(this.savedIncomeData); // ✅ Fill form with data
    }
  }

  updateIncomeData(): void {
    if (this.incomeId !== null) {
      // ✅ Ensure valid ID exists
      const updatedData = this.incomeForm.value;

      this.incomeService.updateIncome(this.incomeId, updatedData).subscribe(
        () => {
          alert('Income data updated successfully!');
          this.currentIncome = updatedData.amount || '-';
          this.currentBudget = updatedData.budget || '-';
          this.isFormDisabled = true; // ✅ Disable form after update
          this.isUpdating = false;
        },
        () => {
          alert('Failed to update income data.');
        }
      );
    } else {
      alert('No income record found to update.');
    }
  }
}
