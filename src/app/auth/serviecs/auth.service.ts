import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  user = new Subject();
  createuser(model: any) {
    return this.http.post(environment.baseApi + 'students', model);
  }

  login(model: any) {
    return this.http.put(environment.baseApi + 'login/1', model);
  }
  getusers(type: string) {
    return this.http.get(environment.baseApi + type);
  }

  getRole() {
    return this.http.get(environment.baseApi + 'login/1');
  }

  getStudent(id: number) {
    return this.http.get(environment.baseApi + 'students/' + id);
  }
  UpdateStudent(id: number, model: any) {
    return this.http.put(environment.baseApi + 'students/' + id, model);
  }
}
