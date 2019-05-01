import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastSavedCardsComponent } from './last-saved-cards.component';

describe('LastSavedCardsComponent', () => {
  let component: LastSavedCardsComponent;
  let fixture: ComponentFixture<LastSavedCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastSavedCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastSavedCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
