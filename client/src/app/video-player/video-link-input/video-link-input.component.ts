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
}
