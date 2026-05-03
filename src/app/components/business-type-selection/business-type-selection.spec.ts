import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTypeSelection } from './business-type-selection';

describe('BusinessTypeSelection', () => {
  let component: BusinessTypeSelection;
  let fixture: ComponentFixture<BusinessTypeSelection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusinessTypeSelection],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessTypeSelection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
