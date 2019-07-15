import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { MaterialService } from '../shared/classes/material.service';
import { Observable, timer } from 'rxjs';
import { AnkiService } from '../shared/services/anki.service';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-user-settings-page',
  templateUrl: './user-settings-page.component.html',
  styleUrls: ['./user-settings-page.component.css'],
})
export class UserSettingsPageComponent implements OnInit, AfterViewInit {
  // TODO: select "translate to" language.
  @ViewChild('decknameselector') decknameselectorref: ElementRef;
  @ViewChild('modelnameselector') modelnameselectorref: ElementRef;
  @ViewChild('langselector') langselectorref: ElementRef;
  @ViewChild('fromlangselector') fromlangselectorref: ElementRef;
  userDecks$: Observable<string[]>;
  userModels$: Observable<string[]>;

  constructor(
    private ankiService: AnkiService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadDecks();
    this.loadModels();
  }
  ngAfterViewInit() {
    if (this.langselectorref) {
      this.langselectorref.nativeElement.value = this.userService.currentUser.lastlang;
      MaterialService.initializeSelect(this.langselectorref);

      // TODO: save tags and from lang to user object in database
      this.fromlangselectorref.nativeElement.value = this.userService.currentUser.lastlang;
      MaterialService.initializeSelect(this.fromlangselectorref);
      MaterialService.updateTextInputs();
    }
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

    // TODO: fix double subscribe bug.
    this.userDecks$.subscribe(
      res => {
        timer(1).subscribe(val => {
          try {
            this.decknameselectorref.nativeElement.value = this.userService.currentUser.lastDeckName;
          } catch (e) {
            console.log(e);
          }
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
          try {
            this.modelnameselectorref.nativeElement.value = this.userService.currentUser.lastModelName;
          } catch (e) {
            console.log(e);
          }
          MaterialService.initializeSelect(this.modelnameselectorref);
          MaterialService.updateTextInputs();
        });
      },
      error => {
        MaterialService.toast(error);
      }
    );
  }

  saveUserSettings(event) {
    this.userService.currentUser.lastDeckName = this.decknameselectorref.nativeElement.value;
    this.userService.currentUser.lastModelName = this.modelnameselectorref.nativeElement.value;
    this.userService.currentUser.lastlang = this.langselectorref.nativeElement.value;
    console.log(this.userService.currentUser.lastlang);
    this.userService.updateSettings(this.userService.currentUser).subscribe(
      res => {
        MaterialService.toast('Settings Updated');
      },
      error => {}
    );
  }
}
