import { Component, OnInit } from '@angular/core';
import { AppService } from './../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_models';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../shared/services';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  jobs: any = [];
  jobDetails: any = [];
  filterStr: string;
  nextRunTimes: any = [];
  buildDetails: any = [];
  currentUser: User;
  currentUserSubscription: Subscription;
  constructor(private appService: AppService,
    private toastr: ToastrService, public router: Router,
    private authenticationService: AuthenticationService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.jobs = [];
    this.buildDetails = [];
    this.nextRunTimes = [];
    this.jobDetails = [];
    this.getAllJobs();
  }

  getAllJobs() {
    this.appService.getJobsData().subscribe({
      next: res => {
        this.jobs = res.jobs;
        this.getJobDetails();
      }
    })
  }

  getJobDetails() {
    this.jobs.forEach((job, index) => {
      this.appService.getJobsByName(job.name).subscribe((response) => {
        this.jobDetails[index] = response;
        if (job.builds) this.getBuildDetails(job.name, job.builds[0].number, index);
        this.getNextRunTime(job.name, index);
      })
    });
  }
  getNextRunTime(name, index) {
    this.appService.getNextRunTimes(name).subscribe((response) => {
      if (response && response.nextTime) this.nextRunTimes[index] = response.nextTime;
    })
  }
  navigateToJob(index) {
    const job = this.jobs[index];
    this.appService.jobData = job;
    this.router.navigate(["/job-details/" + job.name]);
  }

  getBuildDetails(jobName, buildNumber, index) {
    this.appService.getBuildDetails(jobName, buildNumber).subscribe((response) => {
      this.buildDetails[index] = response;
    })
  }

  getConsolelog(jobName, buildNumber, index) {
    this.appService.getConsoleLog(jobName, buildNumber).subscribe((response) => {
      this.buildDetails[index] = response;
    })
  }

  buildJob(name) {
    if (!this.currentUser.isReadonly) {
      if (confirm('Are you sure you want to build?')) {
        this.appService.buildJob(name).subscribe((response) => {
          this.toastr.success('Build has been started successfully!');
        });
      }
    }
  }

  getSampleJobDetails(jobName, index) {
    this.appService.getJobsByName(jobName).subscribe((response) => {
      this.jobDetails[index] = response;
    })
  }

  filterJobs(str) {
    const newArray = this.jobs.filter(j => j.name === str);
    this.jobs = newArray;
  }

}
