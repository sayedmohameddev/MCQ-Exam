import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../serviecs/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginfrom!: FormGroup;
  users: any[] = [];
  type: string = 'students';
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
    private Toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.getUsers();
    this.createFrom();
  }
  createFrom() {
    this.loginfrom = this.fb.group({
      type: this.type,
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  getUsers() {
    this.service.getusers(this.type).subscribe((res: any) => {
      this.users = res;
    });
  }

  getType(event: any) {
    this.type = event.value;
    this.getUsers();
  }

  submit() {
    let index = this.users.findIndex(
      (item) =>
        item.email == this.loginfrom.value.email &&
        item.password == this.loginfrom.value.password
    );
    if (index == -1) {
      this.Toastr.error(' يرجى التاكد من الايميل او الباسورد', '', {
        disableTimeOut: false,
        titleClass: 'toast-title',
        messageClass: 'toast-message',
        timeOut: 5000,
        closeButton: true,
      });
    } else {
      const model = {
        username: this.users[index].username,
        type: this.type,
        userid: this.users[index].id,
      };
      this.service.login(model).subscribe((res) => {
        this.service.user.next(res);

        this.Toastr.success('تم تسجيل الدخول بنجاح', '', {
          disableTimeOut: false,
          titleClass: 'toast-title',
          messageClass: 'toast-message',
          timeOut: 5000,
          closeButton: true,
        });
        this.router.navigate(['/subjects']);
      });
    }
  }
}
