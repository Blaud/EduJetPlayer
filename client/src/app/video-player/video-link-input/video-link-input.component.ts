import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { IMediaStream } from 'src/app/shared/interfaces';
import { YoutubeService } from 'src/app/shared/services/youtube.service';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-video-link-input',
  templateUrl: './video-link-input.component.html',
  styleUrls: ['./video-link-input.component.css'],
})
export class VideoLinkInputComponent implements OnInit {
  @Input('api') api: VgAPI;
  @Output() newVideoSourceEvent = new EventEmitter<IMediaStream>();

  loading = false;

  constructor(
    private youtubeService: YoutubeService,
    private userService: UserService
  ) {}

  ngOnInit() {}

  onBrowseBtnClick() {
    this.api.pause();
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    const stream: IMediaStream = {
      type: 'vod',
      label: 'VOD',
      source: URL.createObjectURL(file),
    };

    this.api.pause();
    this.newVideoSourceEvent.emit(stream);
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
  isYtUrl(str: string) {
    const pattern = new RegExp(
      '^((?:https?:)?\\/\\/)?' +
        '((?:www|m)\\.)?' +
        '((?:youtube\\.com|youtu.be))' +
        '(\\/(?:[\\w\\-]+\\?v=|embed\\/|v\\/)?)' +
        '([\\w\\-]+)(\\S+)?$'
    );
    return pattern.test(str);
  }

  onInputChanged(event: any) {
    // TODO: better link checker and classifier(VOD or hls ..etc)
    if (this.isURL(event.target.value)) {
      if (this.isYtUrl(event.target.value)) {
        this.loading = true;
        this.api.pause();
        this.youtubeService
          .getDirectLink(event.target.value, this.userService.currentUser._id)
          .subscribe(
            res => {
              const stream: IMediaStream = {
                type: 'vod',
                label: 'VOD',
                source: res.corsUrl,
                youtubeLink: event.target.value,
              };
              this.loading = false;
              this.newVideoSourceEvent.emit(stream);
            },
            err => {
              this.loading = false;
              MaterialService.toast(err.message);
            }
          );
      } else {
        const stream: IMediaStream = {
          type: 'vod',
          label: 'VOD',
          source: event.target.value,
        };

        this.api.pause();
        this.newVideoSourceEvent.emit(stream);
      }
    }
  }
}
