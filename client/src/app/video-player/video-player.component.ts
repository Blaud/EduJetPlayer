import { SubtitlesSelectionFormComponent } from './subtitles-selection-form/subtitles-selection-form.component';
import { SubtitlesComponent } from './subtitles/subtitles.component';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewChecked,
  ViewChild,
} from '@angular/core';
import { VgAPI, BitrateOption } from 'videogular2/core';
import { IMediaStream, ITrack } from '../shared/interfaces';
import { VgDASH } from 'videogular2/src/streaming/vg-dash/vg-dash';
import { VgHLS } from 'videogular2/src/streaming/vg-hls/vg-hls';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css'],
})
export class VideoPlayerComponent implements OnInit, AfterViewChecked {
  @ViewChild(VgDASH) vgDash: VgDASH;
  @ViewChild(VgHLS) vgHls: VgHLS;
  @ViewChild('subtitles') subtitles: SubtitlesComponent;
  @ViewChild('subtitlesSelectionForm')
  subtitlesSelectionForm: SubtitlesSelectionFormComponent;
  // TODO: select whole word even if part selected.
  // TODO: dont resume (on subtitle mouse leave) if stopped manually.
  // TODO: get last lang from cookies
  currentStream: IMediaStream;
  preload = 'auto';
  api: VgAPI;
  bitrates: BitrateOption[];

  currentTrack: ITrack = {
    kind: 'subtitles',
    label: 'English',
    src: '../../assets/pale-blue-dot.vtt',
    srclang: 'en',
  };

  streams: IMediaStream[] = [
    {
      type: 'vod',
      label: 'VOD',
      source: '../../assets/videogular.mp4',
    },
    {
      type: 'dash',
      label: 'DASH: Multi rate Streaming',
      source: 'http://dash.edgesuite.net/akamai/bbb_30fps/bbb_30fps.mpd',
    },
    {
      type: 'dash',
      label: 'DASH: Live Streaming',
      source:
        'https://24x7dash-i.akamaihd.net/dash/live/900080/dash-demo/dash.mpd',
    },
    {
      type: 'dash',
      label: 'DASH: DRM with Widevine',
      source:
        'https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine/dash.mpd',
      licenseServers: {
        'com.widevine.alpha': {
          serverURL: 'https://widevine-proxy.appspot.com/proxy',
        },
      },
    },
    {
      type: 'hls',
      label: 'HLS: Streaming',
      source:
        'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
    },
  ];

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.currentStream = this.streams[0];
  }

  onPlayerReady(api: VgAPI) {
    this.api = api;
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  setBitrate(option: BitrateOption) {
    switch (this.currentStream.type) {
      case 'dash':
        this.vgDash.setBitrate(option);
        break;

      case 'hls':
        this.vgHls.setBitrate(option);
        break;
    }
  }

  newVideoSourceEvent(event) {
    this.bitrates = null;
    this.currentStream = event;
    this.subtitles.newVideoSource();
    this.subtitlesSelectionForm.activateModal();
  }

  newSubtitlesSourceEvent(event) {
    this.currentTrack = event;
  }
}
