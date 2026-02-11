import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkList } from './network-list';

describe('NetworkList', () => {
  let component: NetworkList;
  let fixture: ComponentFixture<NetworkList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
