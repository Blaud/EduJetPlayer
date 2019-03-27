import { Component, OnInit, Input } from '@angular/core';
import { VgAPI } from 'videogular2/core';
import { ICuePoint, TextToTranslate } from 'src/app/shared/interfaces';
import { TranslatorService } from 'src/app/shared/services/translator.service';

@Component({
  selector: 'app-subtitles',
  templateUrl: './subtitles.component.html',
  styleUrls: ['./subtitles.component.css'],
})
export class SubtitlesComponent implements OnInit {
  @Input('api') api: VgAPI;

  activeCuePoints: ICuePoint[] = [];

  constructor(private translatorServoce: TranslatorService) {}

  ngOnInit() {}

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
