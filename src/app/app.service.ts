import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import 'rxjs/add/observable/of';
import { User } from "./_models";
import { map } from "rxjs/operators";

@Injectable()
export class AppService {
  private job: any;
  private jobsData: any;
  constructor(private http: HttpClient) {}

  getAllJobs() {
    return this.http.get<any>("/");
  }
  getJobsByName(name) {
    return this.http.get<any>("/" + name);
  }
  getBuildDetails(name, number) {
    return this.http.get<any>("/" + name + "/" + number);
  }
  getConsoleLog(name, number) {
    return this.http.get<any>("/" + name + "/" + number + "/log");
  }
  getNextRunTimes(name) {
    return this.http.post<any>("/", { jobName: name });
  }
  get jobData(): string {
    return this.job;
  }
  set jobData(value: string) {
    this.job = value;
  }
  buildJob(name) {
    return this.http.post<any>("/" + name, {});
  }

  getJobsData(): Observable<any> {
    if (this.jobsData) {
      return Observable.of(this.jobsData);
    } else {
      return this.http.get<any>("/").pipe(
        map(jobs => {
          this.jobsData = jobs;
          return jobs;
        })
      );
    }
  }
}
