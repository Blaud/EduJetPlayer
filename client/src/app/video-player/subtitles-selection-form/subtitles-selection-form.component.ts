import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MaterialInstance,
  MaterialService
} from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-subtitles-selection-form',
  templateUrl: './subtitles-selection-form.component.html',
  styleUrls: ['./subtitles-selection-form.component.css']
})
export class SubtitlesSelectionFormComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modalRef: ElementRef;

  form: FormGroup;
  modal: MaterialInstance;
  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
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
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onModalClose() {
    this.modal.close();
  }
}
