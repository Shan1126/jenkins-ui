import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AppService {

  job: any;
  constructor(private http: HttpClient) {
  }

  getAllJobs() {
    return this.http.get<any>('/');
  }
  getJobsByName(name) {
    return this.http.get<any>('/'+name);
  }
  getBuildDetails(name, number) {
    return this.http.get<any>('/'+name+'/'+number);
  }
  getConsoleLog(name, number) {
    return this.http.get<any>('/'+name+'/'+number+'/log');
  }
  getNextRunTimes(name) {
    return this.http.post<any>('/', {jobName: name});
  }
  get jobData():string { 
    return this.job; 
  } 
  set jobData(value: string) { 
    this.job = value; 
  } 
  buildJob(name) {
    return this.http.post<any>('/'+name, {});
  }
}