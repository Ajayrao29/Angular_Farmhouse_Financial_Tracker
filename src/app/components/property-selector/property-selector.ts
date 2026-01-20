import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyService } from '../../services/property';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-selector.html',
  styleUrl: './property-selector.css'
})
export class PropertySelectorComponent implements OnInit {
  properties: Property[] = [];
  selectedPropertyId: number = 0;
  
  @Output() propertyChanged = new EventEmitter<number>();

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getProperties().subscribe(
      (data: Property[]) => {
        this.properties = data;
        if (data.length > 0) {
          this.selectedPropertyId = 0; // 0 means "All Properties"
        }
      }
    );
  }

  onPropertyChange(): void {
    this.propertyChanged.emit(this.selectedPropertyId);
  }
}