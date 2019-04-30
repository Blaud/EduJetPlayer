import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { IMediaStream } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-video-link-input',
  templateUrl: './video-link-input.component.html',
  styleUrls: ['./video-link-input.component.css']
})
export class VideoLinkInputComponent implements OnInit {
  @Input('api') api: VgAPI;
  @Output() newVideoSoueceEvent = new EventEmitter<IMediaStream>();
  constructor() {}

  ngOnInit() {}

  onBrowseBtnClick() {
    this.api.pause();
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    const stream: IMediaStream = {
      type: 'vod',
      label: 'VOD',
      source: URL.createObjectURL(file)
    };

    this.api.pause();
    this.newVideoSoueceEvent.emit(stream);
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
      const stream: IMediaStream = {
        type: 'vod',
        label: 'VOD',
        source: event.target.value
      };

      this.api.pause();
      this.newVideoSoueceEvent.emit(stream);
    }
  }
}
