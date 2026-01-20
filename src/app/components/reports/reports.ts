import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../../services/transaction';
import { Transaction } from '../../models/transaction.model';
import { PropertySelectorComponent } from '../property-selector/property-selector';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PropertySelectorComponent],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {
  selectedPropertyId: number = 0;
  selectedPeriod: string = 'monthly';
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  
  totalIncome: number = 0;
  totalExpense: number = 0;
  netProfit: number = 0;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe(
      (data: Transaction[]) => {
        this.transactions = data;
        this.applyFilters();
      }
    );
  }

  onPropertyChange(propertyId: number): void {
    this.selectedPropertyId = propertyId;
    this.applyFilters();
  }

  onPeriodChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.transactions;

    // Filter by property
    if (this.selectedPropertyId !== 0) {
      filtered = filtered.filter(t => t.propertyId === this.selectedPropertyId);
    }

    // Filter by period
    const now = new Date();
    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.date);
      
      switch (this.selectedPeriod) {
        case 'monthly':
          return transactionDate.getMonth() === now.getMonth() &&
                 transactionDate.getFullYear() === now.getFullYear();
        case 'quarterly':
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const transactionQuarter = Math.floor(transactionDate.getMonth() / 3);
          return transactionQuarter === currentQuarter &&
                 transactionDate.getFullYear() === now.getFullYear();
        case 'yearly':
          return transactionDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });

    this.filteredTransactions = filtered;
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.totalIncome = this.filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.totalExpense = this.filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.netProfit = this.totalIncome - this.totalExpense;
  }

  exportReport(): void {
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${this.selectedPeriod}-${Date.now()}.csv`;
    link.click();
  }

  generateCSV(): string {
    let csv = 'Date,Type,Category,Amount,Description\n';
    
    this.filteredTransactions.forEach(t => {
      csv += `${t.date},${t.type},${t.category},${t.amount},"${t.description}"\n`;
    });
    
    return csv;
  }
}