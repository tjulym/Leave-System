import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpParams } from "@angular/common/http";

import 'rxjs/add/operator/toPromise';

import { User } from '../domain/user';
import { ApiService } from './api.service';
import { error } from 'util';
import { Leave } from '../domain/leave';
import { LeaveArray } from '../domain/leave-array';
import { LeaveDetail } from '../domain/leave-detail';
import { Workadd } from '../domain/workadd';
import { WorkaddArray } from '../domain/workadd-array';
import { WorkaddDetail } from '../domain/workadd-detail';

@Injectable()
export class UserService {

  private api_url: string;
  private headers: Headers;

  constructor(private http: Http, private apiService: ApiService) { 
    this.api_url = apiService.getUrl();
    this.headers = apiService.getHeaders();
    if (sessionStorage.getItem("token") !== null) {
      this.headers.set("Authorization", sessionStorage.getItem("token"));
    }
  }

  login(username: string, password: string): Promise<boolean> {
    const url = `${this.api_url}/api/v1.0/token/`;
    this.headers.set("Authorization", "Basic " + btoa(username + ":" + password));
    return this.http
    .get(url, { headers: this.headers })
    .toPromise()
    .then(res => {
      let res2 = res.json();
      if (res2['token'] !== null){
        sessionStorage.setItem("token", "Basic " + btoa(res2['token'] + ":"));
        // console.log(res2['token']);
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      return false;
    })
    // .catch(this.handleError);
  }

  getUser(): Promise<User> {
    const url = `${this.api_url}/api/v1.0/user/`;
    this.headers.set("Authorization", sessionStorage.getItem("token"));
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(res => Object.assign(new User(), res.json()))
      .catch(this.handleError);
  }

  updateUser(user: User): Promise<User> {
    const url = `${this.api_url}/api/v1.0/user/`;
    return this.http
      .put(url, JSON.stringify(user), { headers: this.headers })
      .toPromise()
      .then(() => user)
      .catch(this.handleError);
  }

  updatePassword(password: string): Promise<boolean> {
    const url = `${this.api_url}/api/v1.0/user/`;
    return this.http
      .put(url, {"worker_password": password}, { headers: this.headers })
      .toPromise()
      .then(() =>  true)
      .catch(this.handleError);
  }

  applyLeave(leave: Leave): Promise<boolean> {
    const url = `${this.api_url}/api/v1.0/worker/holidays/`;
    return this.http
      .post(url, JSON.stringify(leave), { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  updateLeave(leave: LeaveDetail): Promise<boolean> {
    const url = `${this.api_url}/api/v1.0/worker/holidays/${leave.holiday_id}/`;
    return this.http
      .put(url, JSON.stringify(leave), { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  overLeave(leave: Object): Promise<JSON> {
    const url = `${this.api_url}/api/v1.0/worker/holidays/${leave['holiday_id']}/`;
    return this.http
      .put(url, JSON.stringify(leave), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  endLeave(leave: Object): Promise<JSON> {
    const url = `${this.api_url}/api/v1.0/worker/holidays/${leave['holiday_id']}/`;
    return this.http
      .put(url, JSON.stringify(leave), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  agreeLeave(leave: Object, tail_url: string): Promise<boolean>{
    const url = `${this.api_url}/api/v1.0/examine/holidays/${leave['holiday_id']}/${tail_url}`;
    return this.http
      .put(url, JSON.stringify(leave), { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  rejectLeave(leave: Object): Promise<boolean>{
    const url = `${this.api_url}/api/v1.0/examine/holidays/${leave['holiday_id']}/check/`;
    return this.http
      .put(url, JSON.stringify(leave), { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  getLeaveDetail(page: number, per_page: number): Promise<LeaveArray> {
    const url = `${this.api_url}/api/v1.0/worker/holidays/`;
    const params = {'page': page.toString(), 'per_page': per_page.toString()};
    return this.http
      .get(url, { params: params, headers: this.headers })
      .toPromise()
      .then(res => res.json() as LeaveArray)
      .catch(this.handleError)
  
  }

  getManageLeaveDetail(page: number, per_page: number): Promise<LeaveArray> {
    const url = `${this.api_url}/api/v1.0/examine/holidays/`;
    const params = {'page': page.toString(), 'per_page': per_page.toString()};
    return this.http
      .get(url, { params: params, headers: this.headers })
      .toPromise()
      .then(res => (res.json()) as LeaveArray)
      .catch(this.handleError)
  }

  applyWorkadd(workadd: Workadd): Promise<boolean> {
    const url = `${this.api_url}/api/v1.0/worker/workadds/`;
    return this.http
      .post(url, JSON.stringify(workadd), { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  cancelWorkadd(workadd: Object): Promise<boolean> {
    const url = `${this.api_url}/api/v1.0/worker/workadds/${workadd['workadd_id']}/`;
    return this.http
      .put(url, JSON.stringify(workadd), { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  updateWorkadd(workadd: WorkaddDetail): Promise<boolean> {
    const url = `${this.api_url}/api/v1.0/worker/workadds/${workadd.workadd_id}/`;
    return this.http
      .put(url, JSON.stringify(workadd), { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  operWorkadd(workadd: Object): Promise<boolean>{
    const url = `${this.api_url}/api/v1.0/examine/workadds/${workadd['workadd_id']}/`;
    return this.http
      .put(url, JSON.stringify(workadd), { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  getWorkaddDetail(page: number, per_page: number): Promise<WorkaddArray> {
    const url = `${this.api_url}/api/v1.0/worker/workadds/`;
    const params = {'page': page.toString(), 'per_page': per_page.toString()};
    return this.http
      .get(url, { params: params, headers: this.headers })
      .toPromise()
      .then(res => res.json() as WorkaddArray)
      .catch(this.handleError)
  
  }

  getManageWorkaddDetail(page: number, per_page: number): Promise<WorkaddArray> {
    const url = `${this.api_url}/api/v1.0/examine/workadds/`;
    const params = {'page': page.toString(), 'per_page': per_page.toString()};
    return this.http
      .get(url, { params: params, headers: this.headers })
      .toPromise()
      .then(res => (res.json()) as WorkaddArray)
      .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error cccurred', error);
    return Promise.reject(error.message || error);
  }
}
