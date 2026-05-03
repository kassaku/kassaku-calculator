import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareConfig } from './hardware-config.component';

describe('HardwareConfig', () => {
  let component: HardwareConfig;
  let fixture: ComponentFixture<HardwareConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HardwareConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(HardwareConfig);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
