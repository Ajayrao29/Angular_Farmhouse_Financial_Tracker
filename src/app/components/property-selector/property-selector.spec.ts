import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySelector } from './property-selector';

describe('PropertySelector', () => {
  let component: PropertySelector;
  let fixture: ComponentFixture<PropertySelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertySelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
