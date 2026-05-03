import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionPrice } from './competition-price';

describe('CompetitionPrice', () => {
  let component: CompetitionPrice;
  let fixture: ComponentFixture<CompetitionPrice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionPrice],
    }).compileComponents();

    fixture = TestBed.createComponent(CompetitionPrice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
