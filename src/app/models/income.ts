export class Income {
    incomeId?: number;
    userId: number;
    amount: number;
    description?: string;
    date: Date;
    budget?: number;
  
    constructor(
      userId: number,
      amount: number,
      description: string,
      date: Date,
      budget: number
    ) {
      this.userId = userId;
      this.amount = amount;
      this.description = description;
      this.date = date;
      this.budget = budget;
    }
  }
  
