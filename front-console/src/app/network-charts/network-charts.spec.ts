import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCharts } from './network-charts';

describe('NetworkCharts', () => {
  let component: NetworkCharts;
  let fixture: ComponentFixture<NetworkCharts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkCharts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkCharts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
