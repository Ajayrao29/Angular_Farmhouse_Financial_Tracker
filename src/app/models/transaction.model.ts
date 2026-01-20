export interface Transaction {
  id?: number;
  propertyId: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
}