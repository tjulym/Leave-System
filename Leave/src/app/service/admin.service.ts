import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpParams } from "@angular/common/http";

import 'rxjs/add/operator/toPromise';

import { ApiService } from './api.service';
import { DegreeInfo } from '../domain/degree-info';
import { DepartmentInfo } from '../domain/department-info';
import { UserArray } from '../domain/user-array';
import { User } from '../domain/user';
import { HolidayInfo } from '../domain/holiday-info';
import { LeaveDetail } from '../domain/leave-detail';
import { error } from 'util';
import { WorkaddInfo } from '../domain/workadd-info';
import { WorkaddDetail } from '../domain/workadd-detail';


@Injectable()
export class AdminService {

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
    const url = `${this.api_url}/admin/token`;
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

  getDegreeInfo(): Promise<DegreeInfo[]> {
    const url = `${this.api_url}/admin/degree_infos/`;
    // this.headers.set("Authorization", sessionStorage.getItem("token"));
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(res => (res.json())['degree_infos'] as DegreeInfo[])
      .catch(this.handleError);
  }

  getDepartmentInfo(): Promise<DepartmentInfo[]> {
    const url = `${this.api_url}/admin/department_infos/`;
    // this.headers.set("Authorization", sessionStorage.getItem("token"));
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(res => (res.json())['department_infos'] as DepartmentInfo[])
      .catch(this.handleError);
  }


  getLeaveInfo(): Promise<HolidayInfo[]> {
    const url = `${this.api_url}/admin/holiday_type_infos/`;
    // this.headers.set("Authorization", sessionStorage.getItem("token"));
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(res => (res.json())['holiday_type_infos'] as HolidayInfo[])
      .catch(this.handleError);
  }

  getWorkers(page: number, per_page: number): Promise<UserArray[]> {
    const url = `${this.api_url}/admin/workers/`;
    const params = {'page': page.toString(), 'per_page': per_page.toString()};
    return this.http
      .get(url, { params: params, headers: this.headers })
      .toPromise()
      .then(res => res.json() as UserArray)
      .catch(this.handleError)
  }

  updateWorker(worker: User): Promise<boolean> {
    const url = `${this.api_url}/admin/workers/${worker.worker_id}/`;
    return this.http
      .put(url, JSON.stringify(worker), { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  passwd(worker_id: number, worker_password: string, worker_password2: string): Promise<boolean> {
    const url = `${this.api_url}/admin/workers/${worker_id}/`;
    let params = {'worker_password': worker_password, 'worker_password2': worker_password2};
    return this.http
      .put(url, params, { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  createWorker(newUser: Object): Promise<boolean> {
    const url = `${this.api_url}/admin/workers/`;
    return this.http
      .post(url, newUser, { headers: this.headers })
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  updateDegree(worker_id: string, department_id: number, degree_id: number) {
    if(degree_id == 0) {
      const url = `${this.api_url}/admin/workers/${worker_id}/degree/${department_id}`;
      return this.http
        .delete(url, { headers: this.headers })
        .toPromise()
        .then(res => true)
        .catch(this.handleError);
    }
    else {
      const url = `${this.api_url}/admin/workers/${worker_id}/department/${department_id}/`;
      let params = {'worker_degree_degree': degree_id.toString()}
      return this.http
        .put(url, params, { headers: this.headers })
        .toPromise()
        .then(res => res.json())
        .catch(error => error.json());
    }
  }

  getLeaveDetail(params: Object) {
    const url = `${this.api_url}/admin/holidays/`;
    return this.http
      .get(url, { params: params, headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(error => error.json())
  }

  updateLeave(leave: LeaveDetail) {
    const url = `${this.api_url}/admin/holidays/${leave.holiday_id}/`;
    return this.http
      .put(url, JSON.stringify(leave), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(error => error.json());
  }

  overLeave(leave_id: number) {
    const url = `${this.api_url}/admin/holidays/${leave_id}/`;
    return this.http
      .put(url, {"holiday_over": '1'}, { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(error => error.json());
  }

  getWorkaddInfo() {
    const url = `${this.api_url}/admin/workadd_type_infos/`;
    // this.headers.set("Authorization", sessionStorage.getItem("token"));
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(res => (res.json())['workadd_type_info'] as WorkaddInfo[])
      .catch(this.handleError);
  }

  getWorkaddDetail(params: Object) {
    const url = `${this.api_url}/admin/workadds/`;
    return this.http
      .get(url, { params: params, headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(error => error.json())
  }

  updateWorkadd(workadd: WorkaddDetail) {
    const url = `${this.api_url}/admin/workadds/${workadd.workadd_id}/`;
    return this.http
      .put(url, JSON.stringify(workadd), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(error => error.json());
  }

  operWorkadd(workadd: Object) {
    const url = `${this.api_url}/admin/workadds/${workadd['workadd_id']}/`;
    return this.http
      .put(url, JSON.stringify(workadd), { headers: this.headers })
      .toPromise()
      .then(res => res.json())
      .catch(error => error.json());
  }

  private handleError(error: any): Promise<any> {
    console.error('An error cccurred', error);
    return Promise.reject(error.message || error);
  }
}
