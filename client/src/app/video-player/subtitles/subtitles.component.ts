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
  stopedOnSubtitle = false;
  currentTranslation = '';
  stopedOnTranslation = false;

  constructor(private translatorService: TranslatorService) {}

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
    this.stopedOnTranslation = false;
    this.stopedOnSubtitle = false;
    this.currentTranslation = '';
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

    if (!test.text) {
      test.text = this.activeCuePoints[0].title;
    }

    this.translatorService.translate(test).subscribe(
      translatedText => {
        this.currentTranslation = translatedText.text;
      },
      error => {
        this.currentTranslation = error.error.message;
        console.log(error.error.message);
      }
    );
    this.stopedOnTranslation = true;
  }

  onMouseEnter(event) {
    this.api.pause();
    this.stopedOnSubtitle = true;
  }
  onMouseLeave(event) {
    // if user translated text, player wount start after mouse leave
    if (!this.stopedOnTranslation) {
      this.api.play();
      this.stopedOnSubtitle = false;
      this.currentTranslation = '';
    } else {
      this.stopedOnTranslation = false;
    }
  }
}
