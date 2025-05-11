export class Expenses {
  expenseId?: number;
  userId?: number; // ✅ Added User ID reference
  amount: number;
  categoryName: string;
  description?: string;
  date: string;

  constructor(
    amount: number,
    categoryName: string,
    description?: string,
    date?: string,
    expenseId?: number,
    userId?: number
  ) {
    this.expenseId = expenseId;
    this.userId = userId;
    this.amount = amount;
    this.categoryName = categoryName;
    this.description = description || '';
    this.date = date || new Date().toISOString().split('T')[0]; // ✅ Defaults to today's date
  }
}
