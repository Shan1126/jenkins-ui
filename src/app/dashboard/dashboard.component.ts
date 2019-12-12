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
  nextRunTimes: any = [];
  buildDetails: any = [];
  currentUser: User;
  p: number = 1;
  filterStr;
  jobToBuild;
  confirmdialogue : boolean = false;
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
        this.jobs = res;
        this.getJobDetails();
      }
    })
  }

  getJobDetails() {
    this.jobs.jobs.forEach((job, index) => {
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
    const job = this.jobs.jobs[index];
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

  closemodal(){
    this.confirmdialogue = false;
  }

  buildJob() {
    this.confirmdialogue = false;
    if (!this.currentUser.isReadonly) {
        this.appService.buildJob(this.jobToBuild).subscribe((response) => {
          this.toastr.success('Build has been started successfully!');
        }); 
    }
  }
  confirmBuild(name) {
    this.confirmdialogue = true;
    this.jobToBuild = name;

  }

  getSampleJobDetails(jobName, index) {
    this.appService.getJobsByName(jobName).subscribe((response) => {
      this.jobDetails[index] = response;
    })
  }

  filterJobs(event) {
    var str = event.target.value;
    if(str && str.length >= 1) {

      console.log('Inside: string> 1');
      const newArray = this.jobs.jobs.filter(j => j.name.includes(str));
      this.jobs.jobs = newArray;
    } else {
      console.log('Inside: else');
      this.getAllJobs();
    }
  }

  filterByKeyword(keyword: string) {
    const k = keyword.toLowerCase();
    this.jobs.jobs = this.jobs.jobs.map(x => Object.assign({}, x));
    this.jobs.jobs = this.jobs.jobs.filter((category) => {
        category.products = category.products.filter(
          (product)=> product.name.toLowerCase().includes(k));

        return category.products.length>0 }
      );
    if(this.jobs.jobs.length===0){
      this.jobs.jobs = this.jobs.jobs.map(x => Object.assign({}, x));
    }
  }
}