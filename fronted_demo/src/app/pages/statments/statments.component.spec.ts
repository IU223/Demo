import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatmentsComponent } from './statments.component';

describe('StatmentsComponent', () => {
  let component: StatmentsComponent;
  let fixture: ComponentFixture<StatmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
