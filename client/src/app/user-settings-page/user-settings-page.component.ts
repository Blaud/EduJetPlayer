import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MaterialService } from '../shared/classes/material.service';
import { Observable, timer } from 'rxjs';
import { AnkiService } from '../shared/services/anki.service';

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.css'],
})
export class UserSettingsPageComponent implements OnInit {
  @ViewChild('decknameselector') decknameselectorref: ElementRef;
  @ViewChild('modelnameselector') modelnameselectorref: ElementRef;
  userDecks$: Observable<string[]>;
  userModels$: Observable<string[]>;

  constructor(private ankiService: AnkiService) {}

  ngOnInit() {
    this.loadDecks();
    this.loadModels();
  }

  loadDecks() {
    const getUserDesksRequest = {
      action: 'deckNames',
      version: 6,
    };

    this.userDecks$ = <any>(
      this.ankiService.ankiConnectRequest(
        getUserDesksRequest.action,
        getUserDesksRequest.version
      )
    );

    this.userDecks$.subscribe(
      res => {
        timer(1).subscribe(val => {
          MaterialService.initializeSelect(this.decknameselectorref);
          MaterialService.updateTextInputs();
        });
      },
      error => {
        MaterialService.toast(error);
      }
    );
  }

  loadModels() {
    const getUserModelsRequest = {
      action: 'modelNames',
      version: 6,
    };

    this.userModels$ = <any>(
      this.ankiService.ankiConnectRequest(
        getUserModelsRequest.action,
        getUserModelsRequest.version
      )
    );

    this.userModels$.subscribe(
      res => {
        timer(2).subscribe(val => {
          MaterialService.initializeSelect(this.modelnameselectorref);
          MaterialService.updateTextInputs();
        });
      },
      error => {
        MaterialService.toast(error);
      }
    );
  }
}
