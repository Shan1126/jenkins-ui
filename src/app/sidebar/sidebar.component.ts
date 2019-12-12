import { Component, OnInit } from "@angular/core";
import { AppService } from "./../app.service";
import { Router } from "@angular/router";
import { User } from '../_models';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../shared/services';


@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  jobs: any = [];
  jobDetails: any = [];
  jobName;
  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(private appService: AppService, private router: Router,
    private authenticationService: AuthenticationService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
  });
  }

  ngOnInit() {
    this.getAllJobs();
  }

  getAllJobs() {
    this.appService.getJobsData().subscribe(response => {
      this.jobs = response.jobs;
    });
  }
  navigateToJob(index) {
    const job = this.jobs[index];
    this.appService.jobData =job;
    this.router.navigate(["/job-details/" + job.name]);
  }
}
