import { VideoPlayerComponent } from './video-player/video-player.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { ProfileLayoutComponent } from './shared/layouts/profile-layout/profile-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { ParticlesModule } from 'angular-particle';
import { ParticleEffectButtonModule } from 'angular-particle-effect-button';
import { AnkiStatusComponent } from './shared/components/anki-status/anki-status.component';
import { VideoLinkInputComponent } from './video-player/video-link-input/video-link-input.component';
import { SubtitlesComponent } from './video-player/subtitles/subtitles.component';
import { CommonModule } from '@angular/common';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { VgStreamingModule } from 'videogular2/streaming';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    ProfileLayoutComponent,
    RegisterPageComponent,
    OverviewPageComponent,
    LoaderComponent,
    IndexPageComponent,
    AnkiStatusComponent,
    VideoLinkInputComponent,
    SubtitlesComponent,
    VideoPlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ParticlesModule,
    ParticleEffectButtonModule,
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
