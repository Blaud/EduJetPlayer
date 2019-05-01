import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtitlesSelectionFormComponent } from './subtitles-selection-form.component';

describe('SubtitlesSelectionFormComponent', () => {
  let component: SubtitlesSelectionFormComponent;
  let fixture: ComponentFixture<SubtitlesSelectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubtitlesSelectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtitlesSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
