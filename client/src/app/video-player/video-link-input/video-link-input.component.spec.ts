import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLinkInputComponent } from './video-link-input.component';

describe('VideoLinkInputComponent', () => {
  let component: VideoLinkInputComponent;
  let fixture: ComponentFixture<VideoLinkInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoLinkInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLinkInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
