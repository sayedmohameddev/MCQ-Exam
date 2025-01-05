import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../serviecs/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  userfrom!: FormGroup;
  Students: any[] = [];
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
    private Toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.createFrom();
    this.getStudents();
  }

  getStudents() {
    this.service.getusers('students').subscribe((res: any) => {
      this.Students = res;
    });
  }
  createFrom() {
    this.userfrom = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
    });
  }

  submit() {
    const model = {
      username: this.userfrom.value.username,
      email: this.userfrom.value.email,
      password: this.userfrom.value.password,
    };
    let index = this.Students.findIndex(
      (item) => item.email == this.userfrom.value.email
    );
    if (index !== -1) {
      this.Toastr.error('الايميل موجود بالفعل', '', {
        disableTimeOut: false,
        titleClass: 'toast-title',
        messageClass: 'toast-message',
        timeOut: 5000,
        closeButton: true,
      });
    } else {
      this.service.createuser(model).subscribe((res: any) => {
        this.Toastr.success('تم انشاء الحساب بنجاح', '', {
          disableTimeOut: false,
          titleClass: 'toast-title',
          messageClass: 'toast-message',
          timeOut: 5000,
          closeButton: true,
        });
        const model = {
          username: res.username,
          type: 'students',
          userid: res.id,
        };
        this.service.login(model).subscribe((res) => {
          this.service.user.next(res);
        });
        this.router.navigate(['/subjects']);
      });
    }
  }
}
