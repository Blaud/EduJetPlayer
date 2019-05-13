import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavLayoutComponent } from './top-nav-layout.component';

describe('TopNavLayoutComponent', () => {
  let component: TopNavLayoutComponent;
  let fixture: ComponentFixture<TopNavLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopNavLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
