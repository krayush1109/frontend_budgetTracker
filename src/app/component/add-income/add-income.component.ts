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
  imagePath = '19197498.jpg'; // ✅ Default image
  currentIncome = '-';
  currentBudget = '-';
  incomeId: number | null = null; // ✅ Keep income ID for updates
  savedIncomeData: any = null; // ✅ Stores API response for manual filling
  isFormDisabled = false; // ✅ Enable form initially
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
        { value: null, disabled: false },
        [Validators.required, Validators.min(1)],
      ],
      description: [{ value: '', disabled: false }, Validators.required],
      date: [{ value: new Date(), disabled: false }, Validators.required],
      budget: [
        { value: null, disabled: false },
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

          // ✅ Disable form only if an existing income record is found
          if (this.incomeId !== null) {
            this.isFormDisabled = true;
            this.incomeForm.disable();
          }
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

  saveOrUpdateIncomeData(): void {
    const incomeData = this.incomeForm.value;

    if (this.incomeId !== null) {
      // ✅ Update existing income record
      this.incomeService.updateIncome(this.incomeId, incomeData).subscribe(
        () => {
          alert('Income data updated successfully!');
          this.currentIncome = incomeData.amount || '-';
          this.currentBudget = incomeData.budget || '-';
          this.isFormDisabled = true; // ✅ Disable form after update
          this.isUpdating = false;

          // ✅ Reset form fields after update
          this.incomeForm.reset();
        },
        () => {
          alert('Failed to update income data.');
        }
      );
    } else {
      // ✅ Save new income record for first-time users
      this.incomeService.addIncome(incomeData).subscribe(
        (response) => {
          alert('Income data saved successfully!');
          this.incomeId = response.incomeId; // ✅ Store new ID for future updates
          this.currentIncome = incomeData.amount || '-';
          this.currentBudget = incomeData.budget || '-';
          this.isFormDisabled = true; // ✅ Disable form after saving

          // ✅ Reset form fields after update
          this.incomeForm.reset();
        },
        () => {
          alert('Failed to save income data.');
        }
      );
    }
  }
}
