import { Component, OnInit } from "@angular/core";
import { AppService } from "../app.service";
import { ToastrService } from 'ngx-toastr';
import consoleData from '../data/console.json';
import {
  ActivatedRoute,
  Router,
  RouterEvent,
  NavigationEnd
} from "@angular/router";
import { filter } from "rxjs/operators";
import { User } from '../_models';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../shared/services';

@Component({
  selector: "app-job-details",
  templateUrl: "./job-details.component.html",
  styleUrls: ["./job-details.component.scss"]
})
export class JobDetailsComponent implements OnInit {
  jobName;
  jobDetails;
  job;
  buildDetails;
  consoleLog;
  counter = 0;
  nextRunTime;
  currentUser: User;
  currentUserSubscription: Subscription;

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(() => {
        route.params.subscribe(params => {
          this.jobName = params["name"];
        });
        if(this.appService.jobData) {
          this.job = this.appService.jobData;
        }
        this.getJobDetails();
        this.getNextRunTime(this.jobName);
      });
  }

  ngOnInit() {}

  nextBuild() {
    if(this.counter !=0) {
      this.counter = this.counter - 1;
      this.getBuildDetails();
      this.getConsolelog();
    }
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


  getNextRunTime(name) {
    this.appService.getNextRunTimes(name).subscribe((response) => {
      if(response && response.nextTime) this.nextRunTime = response.nextTime;
    })
  }

  previousBuild() {
    this.counter = this.counter +1;
    this.getBuildDetails();
    this.getConsolelog();
  }

  getJobDetails() {
    this.appService.getJobsByName(this.job.name).subscribe(response => {
      this.jobDetails = response;
      //console.log(`Job details for : ${job.name}: ${JSON.stringify(response)}`);
      if (this.jobDetails && this.jobDetails.builds) {
        this.getBuildDetails();
        this.getConsolelog();
      }

      this.getConsolelog();
    });
  }

  getBuildDetails() {
    this.appService
      .getBuildDetails(this.jobName, this.jobDetails.builds[this.counter].number)
      .subscribe(response => {
        this.buildDetails = response;
        // console.log(`Last Build details for : ${jobName}, ${buildNumber}: ${JSON.stringify(response)}`);
      });
  }

  getConsolelog() {
    // this.appService.getConsoleLog(this.jobName, this.jobDetails.builds[this.counter].number).subscribe(res => {
    //     this.consoleLog = res.data;
    //   });
    // console.log('Console log from json file: ' + JSON.stringify(consoleData));
    this.consoleLog = consoleData.data;
  }
}
