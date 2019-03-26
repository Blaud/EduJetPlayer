import { Component, OnInit } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { TranslatorService } from '../shared/services/translator.service';
import { TextToTranslate } from '../shared/interfaces';

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
  // TODO: move subtitles to another (it own) component?
  // TODO: select whole word even if part selected.
  // TODO: translate whole caption on empty space click.
  preload = 'auto';
  api: VgAPI;
  activeCuePoints: ICuePoint[] = [];

  constructor(private translatorServoce: TranslatorService) {}

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
    const test: TextToTranslate = {
      from: 'en',
      to: 'ru',
      text: '',
    };

    if (window.getSelection) {
      test.text = window.getSelection().toString();
    } else if (
      document.getSelection() &&
      document.getSelection().type !== 'Control'
    ) {
      test.text = document.getSelection().toString();
    }

    // console.log(text);

    this.translatorServoce.translate(test).subscribe(
      translatedText => {
        console.log(translatedText.text);
      },
      error => {
        console.log(error.error.message);
      }
    );
  }

  onMouseEnter(event) {
    this.api.pause();
  }
  onMouseLeave(event) {
    this.api.play();
  }
}
