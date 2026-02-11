import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareList } from './software-list';

describe('SoftwareList', () => {
  let component: SoftwareList;
  let fixture: ComponentFixture<SoftwareList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoftwareList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoftwareList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
