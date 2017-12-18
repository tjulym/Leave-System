import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { ApiService } from './api.service';
import { HolidayInfo } from '../domain/holiday-info';
import { WorkaddInfo } from '../domain/workadd-info';

@Injectable()
export class CommonService {

  private api_url: string;
  private headers: Headers;

  constructor(private http: Http, private apiService: ApiService) { 
    this.api_url = apiService.getUrl();
    this.headers = apiService.getHeaders();
    if (sessionStorage.getItem("token") !== null) {
      this.headers.set("Authorization", sessionStorage.getItem("token"));
    }
  }


  getDegree(degree_id: number): Promise<string> {
    const url = `${this.api_url}/api/v1.0/degree_infos/`;
    // this.headers.set("Authorization", sessionStorage.getItem("token"));
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(res => {
        let degrees = res.json();
        return degrees.degree_infos[degree_id - 1].degree_name;
      })
      .catch(this.handleError);
  }

  getDepartment(department_id: number): Promise<string> {
    const url = `${this.api_url}/api/v1.0/department_infos/`;
    // this.headers.set("Authorization", sessionStorage.getItem("token"));
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(res => {
        let department = res.json();
        return department.department_infos[department_id - 1].department_name;
      })
      .catch(this.handleError);
  }

  getHolidayInfo(): Promise<HolidayInfo[]> {
    const url = `${this.api_url}/api/v1.0/holiday_type_infos/`;
    // this.headers.set("Authorization", sessionStorage.getItem("token"));
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json().holiday_type_infos as HolidayInfo[])
      .catch(this.handleError);
  }

  getWorkaddInfo(): Promise<WorkaddInfo[]> {
    const url = `${this.api_url}/api/v1.0/workadd_type_infos/`;
    // this.headers.set("Authorization", sessionStorage.getItem("token"));
    return this.http.get(url, { headers: this.headers })
      .toPromise()
      .then(res => res.json().workadd_type_info as WorkaddInfo[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error cccurred', error);
    return Promise.reject(error.message || error);
  }
}
