import { Component, OnInit, Output, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { User, IMediaStream } from '../shared/interfaces';
import { UserService } from '../shared/services/user.service';
import { VgAPI } from 'videogular2/core';
import { EventEmitter } from 'protractor';
import { VideoLinkInputComponent } from '../video-player/video-link-input/video-link-input.component';

@Component({
  selector: 'app-reffered-videos',
  templateUrl: './reffered-videos.component.html',
  styleUrls: ['./reffered-videos.component.css'],
})
export class RefferedVideosComponent implements OnInit {
  @Input('VideoLinkInput') VideoLinkInput: VideoLinkInputComponent;

  constructor(private userService: UserService) {}

  ngOnInit() {}

  openVideo(event, video) {
    this.VideoLinkInput.onInputChanged({
      target: { value: video.webpage_url },
    });
  }
}
