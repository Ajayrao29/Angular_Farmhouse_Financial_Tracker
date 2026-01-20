import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../../services/transaction';
import { Transaction } from '../../models/transaction.model';
import { PropertySelectorComponent } from '../property-selector/property-selector';
import { TransactionFormComponent } from '../transaction-form/transaction-form';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PropertySelectorComponent, TransactionFormComponent],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css'
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  selectedPropertyId: number = 0;
  showForm: boolean = false;
  editingTransaction: Transaction | null = null;

  constructor(private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe(
      (data: Transaction[]) => {
        this.transactions = data;
        this.filterTransactions();
      }
    );
  }

  onPropertyChange(propertyId: number): void {
    this.selectedPropertyId = propertyId;
    this.filterTransactions();
  }

  filterTransactions(): void {
    if (this.selectedPropertyId === 0) {
      this.filteredTransactions = this.transactions;
    } else {
      this.filteredTransactions = this.transactions.filter(
        t => t.propertyId === this.selectedPropertyId
      );
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.editingTransaction = null;
    }
  }

  editTransaction(transaction: Transaction): void {
    this.editingTransaction = { ...transaction };
    this.showForm = true;
  }

  deleteTransaction(id: number | undefined): void {
    if (id && confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe(
        () => {
          this.loadTransactions();
        }
      );
    }
  }

  onTransactionSaved(): void {
    this.showForm = false;
    this.editingTransaction = null;
    this.loadTransactions();
  }
}