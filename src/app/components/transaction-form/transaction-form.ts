import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transaction';
import { PropertyService } from '../../services/property';
import { Transaction } from '../../models/transaction.model';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.css']
})
export class TransactionFormComponent implements OnInit {
  @Input() transaction: Transaction | null = null;
  @Output() transactionSaved = new EventEmitter<void>();

  transactionForm!: FormGroup;
  properties: Property[] = [];
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private propertyService: PropertyService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadProperties();
    
    if (this.transaction) {
      this.isEditMode = true;
      this.populateForm();
    }
  }

  initializeForm(): void {
    this.transactionForm = this.fb.group({
      propertyId: ['', Validators.required],
      type: ['income', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  loadProperties(): void {
    this.propertyService.getProperties().subscribe(
      (data: Property[]) => {
        this.properties = data;
      }
    );
  }

  populateForm(): void {
    if (this.transaction) {
      this.transactionForm.patchValue(this.transaction);
    }
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      
      if (this.isEditMode && this.transaction?.id) {
        this.transactionService.updateTransaction(this.transaction.id, formValue).subscribe(
          () => {
            this.transactionSaved.emit();
          }
        );
      } else {
        this.transactionService.addTransaction(formValue).subscribe(
          () => {
            this.transactionSaved.emit();
          }
        );
      }
    }
  }
}