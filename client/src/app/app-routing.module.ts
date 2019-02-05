import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/classes/auth.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { ProfileLayoutComponent } from './shared/layouts/profile-layout/profile-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { IndexPageComponent } from './index-page/index-page.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent }
    ]
  },
  {
    path: 'profile',
    component: ProfileLayoutComponent,
    canActivate: [AuthGuard],
    children: [{ path: 'overview', component: OverviewPageComponent }]
  },
  {
    path: '',
    component: IndexPageComponent
  }
];

@NgModule({
  imports: [RouterModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
