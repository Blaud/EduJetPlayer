import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MaterialInstance,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import { VgAPI } from 'videogular2/core';
import { ITrack } from 'src/app/shared/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, timer } from 'rxjs';
import { YoutubeService } from 'src/app/shared/services/youtube.service';

@Component({
  selector: 'app-subtitles-selection-form',
  templateUrl: './subtitles-selection-form.component.html',
  styleUrls: ['./subtitles-selection-form.component.css'],
})
export class SubtitlesSelectionFormComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modalRef: ElementRef;
  @Input('api') api: VgAPI;
  @Output() newSubtitlesSourceEvent = new EventEmitter<ITrack>();
  @ViewChild('subtitlesselect') subtitlesselectref: ElementRef;

  form: FormGroup;
  modal: MaterialInstance;
  youtubeLink: string;
  loadedSubtitles: string[] = [];
  isLoading = false;

  constructor(
    private sanitizer: DomSanitizer,
    private youtubeService: YoutubeService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)]),
    });
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
    MaterialService.updateTextInputs();
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  onSubmit() {}

  activateModal() {
    // TODO: add current subtitles to list if opened by lang selector(player ui right bottom btn)
    // TODO: modal looks bad after loadin subs selector
    this.modal.open();
    MaterialService.updateTextInputs();
    this.api.pause();
    if (this.youtubeLink) {
      this.isLoading = true;

      this.youtubeService.getSubtitles(this.youtubeLink).subscribe(
        res => {
          this.loadedSubtitles = res;
          this.isLoading = false;
          setTimeout(() => {
            MaterialService.initializeSelect(this.subtitlesselectref);
            MaterialService.updateTextInputs();
          }, 1);
        },
        error => {
          MaterialService.toast(error);
          this.isLoading = false;
        }
      );
    }
  }

  onModalClose() {
    this.modal.close();
  }

  onFileSelect(event: any) {
    // TODO: fields for label and srclang
    // TODO: fix for firefox (chrome says "Resource interpreted as TextTrack but transferred with MIME type text/plain" and works fine)
    // TODO: work with srt files
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    const track: ITrack = {
      kind: 'subtitles',
      label: 'English',
      src: <string>(
        this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file))
      ),
      srclang: 'en',
    };
    this.newSubtitlesSourceEvent.emit(track);
  }

  isURL(str: string) {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator
    return pattern.test(str);
  }

  onInputChanged(event: any) {
    if (this.isURL(event.target.value)) {
      const track: ITrack = {
        kind: 'subtitles',
        label: 'English',
        src: event.target.value,
        srclang: 'en',
      };

      this.api.pause();
      this.newSubtitlesSourceEvent.emit(track);
    }
  }

  onSubtitlesSelectChange(event) {
    const track: ITrack = {
      kind: 'subtitles',
      label: 'English',
      src:
        'https://' +
        <string>(
          this.sanitizer.bypassSecurityTrustResourceUrl(event.target.value)
        ),
      srclang: event.target.value.substring(
        event.target.value.lastIndexOf('.') - 1,
        event.target.value.length
      ),
    };
    this.api.pause();
    this.newSubtitlesSourceEvent.emit(track);
  }
}
