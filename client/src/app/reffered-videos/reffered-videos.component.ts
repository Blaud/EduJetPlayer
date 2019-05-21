import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../shared/interfaces';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-reffered-videos',
  templateUrl: './reffered-videos.component.html',
  styleUrls: ['./reffered-videos.component.css'],
})
export class RefferedVideosComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {}

  openVideo(event, card) {}
}
