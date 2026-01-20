import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TransactionService } from '../../services/transaction';
import { Transaction } from '../../models/transaction.model';
import { PropertySelectorComponent } from '../property-selector/property-selector';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PropertySelectorComponent, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  selectedPropertyId: number = 0;
  timeRange: string = 'all'; // 'month', 'quarter', 'year', 'all'
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = []; // To store transactions after all filters
  totalIncome: number = 0;
  totalExpense: number = 0;
  netProfit: number = 0;

  // Chart Data
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { min: 0 }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: ['Financials'],
    datasets: [
      { data: [0], label: 'Income', backgroundColor: '#198754' },
      { data: [0], label: 'Expense', backgroundColor: '#dc3545' }
    ]
  };

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

  onTimeRangeChange(): void {
    this.filterTransactions();
  }

  filterTransactions(): void {
    let filtered = this.transactions;

    // Property Filter
    if (this.selectedPropertyId !== 0) {
      filtered = filtered.filter(t => t.propertyId === this.selectedPropertyId);
    }

    // Time Range Filter
    const now = new Date();
    filtered = filtered.filter(t => {
      const tDate = new Date(t.date);
      if (this.timeRange === 'all') return true;
      if (this.timeRange === 'month') {
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      }
      if (this.timeRange === 'quarter') {
        const currentQuarter = Math.floor((now.getMonth() + 3) / 3);
        const tQuarter = Math.floor((tDate.getMonth() + 3) / 3);
        return tQuarter === currentQuarter && tDate.getFullYear() === now.getFullYear();
      }
      if (this.timeRange === 'year') {
        return tDate.getFullYear() === now.getFullYear();
      }
      return true;
    });

    this.filteredTransactions = filtered;
    this.calculateTotals(filtered);
    this.updateChart(filtered);
  }

  calculateTotals(transactions: Transaction[]): void {
    this.totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    this.netProfit = this.totalIncome - this.totalExpense;
  }

  updateChart(transactions: Transaction[]): void {
    // Prepare data for the chart
    // We can show Income vs Expense for the selected range
    this.barChartData = {
      labels: ['Current Period'],
      datasets: [
        { data: [this.totalIncome], label: 'Income', backgroundColor: '#198754' },
        { data: [this.totalExpense], label: 'Expense', backgroundColor: '#dc3545' }
      ]
    };
  }
}