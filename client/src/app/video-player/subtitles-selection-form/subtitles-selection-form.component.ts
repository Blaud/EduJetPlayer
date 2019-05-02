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
  form: FormGroup;
  modal: MaterialInstance;
  constructor(private sanitizer: DomSanitizer) {}

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
    // TODO: add current subtitles to list if opened by lang selector
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onModalClose() {
    this.modal.close();
  }

  onFileSelect(event: any) {
    // TODO: fields for label and srclang
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
}
