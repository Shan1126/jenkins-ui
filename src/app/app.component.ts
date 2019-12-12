import { Component } from '@angular/core';
import { AppService } from './app.service';
import { Router, NavigationStart } from '@angular/router';
import { AuthenticationService } from './shared/services';
import { User } from './_models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Jenkins-UI';
  jobs: any = [];
  jobDetails: any = [];
  buildDetails: any = [];
  showHead: boolean = false;
  newsShow: boolean = false;
  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(private router: Router,
    private authenticationService: AuthenticationService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
          this.showHead = true;
          this.router.navigate(['/']);
      } else {
          this.router.navigate(['/login']);
      }
  });
  }

  ngOnInit() {}

  openNews(){
    this.newsShow = !this.newsShow;
  }

  refresh() {
    window.location.reload();
  }
  
  logout() {
    this.showHead = false;
    this.authenticationService.logout();
  }

}
