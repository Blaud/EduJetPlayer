import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefferedVideosComponent } from './reffered-videos.component';

describe('RefferedVideosComponent', () => {
  let component: RefferedVideosComponent;
  let fixture: ComponentFixture<RefferedVideosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefferedVideosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefferedVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
