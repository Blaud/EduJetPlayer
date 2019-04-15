import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnkiStatusComponent } from './anki-status.component';

describe('AnkiStatusComponent', () => {
  let component: AnkiStatusComponent;
  let fixture: ComponentFixture<AnkiStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnkiStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnkiStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
