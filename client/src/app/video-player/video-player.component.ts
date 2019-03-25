import { Component, OnInit } from '@angular/core';
import { VgAPI } from 'videogular2/core';

declare var VTTCue;

export interface ICuePoint {
  id: string;
  title: string;
  description: string;
  src: string;
  href: string;
}

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent implements OnInit {
  preload = 'auto';
  api: VgAPI;
  activeCuePoints: ICuePoint[] = [];

  constructor() {}

  ngOnInit() {}

  onPlayerReady(api: VgAPI) {
    this.api = api;
  }

  onEnterCuePoint(event) {
    this.activeCuePoints.push({
      id: event.id,
      title: event.text,
      description: event.text,
      href: event.text,
      src: event.text,
    });
  }

  onExitCuePoint(event) {
    this.activeCuePoints = this.activeCuePoints.filter(c => c.id !== event.id);
  }

  showSelectedText(oField) {
    let text = '';
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (
      document.getSelection() &&
      document.getSelection().type !== 'Control'
    ) {
      text = document.getSelection().toString();
    }
    console.log(text);
  }

  onMouseEnter(event) {
    this.api.pause();
  }
  onMouseLeave(event) {
    this.api.play();
  }
}
