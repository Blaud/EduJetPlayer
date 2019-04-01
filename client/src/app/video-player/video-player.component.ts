import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { VgAPI } from 'videogular2/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent implements OnInit, AfterViewChecked {
  // TODO: select whole word even if part selected.
  // TODO: translate whole caption on empty space click.
  // TODO: dont resume if stopped manually.
  // TODO: get last lang from cookies
  preload = 'auto';
  api: VgAPI;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {}

  onPlayerReady(api: VgAPI) {
    this.api = api;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
