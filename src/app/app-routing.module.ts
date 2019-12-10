import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobDetailsComponent } from './job-details/job-details.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'job-details/:name', component: JobDetailsComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
