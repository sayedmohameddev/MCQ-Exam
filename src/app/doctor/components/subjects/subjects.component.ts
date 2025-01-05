import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../doctor.service.service';
import { AuthService } from '../../../auth/serviecs/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  constructor(
    private servive: DoctorService,
    private auth: AuthService,
    private toster: ToastrService
  ) {}
  subjects: any[] = [];
  user: any = null;
  ngOnInit(): void {
    this.getSubject();
    this.getUserInfo();
  }

  getSubject() {
    this.servive.getAllSubject().subscribe((res: any) => {
      this.subjects = res;
    });
  }

  getUserInfo() {
    this.auth.getRole().subscribe((res) => {
      this.user = res;
    });
  }
  delete(index: number) {
    let id = this.subjects[index].id;
    this.subjects.splice(index, 1);
    this.servive.deleteSubject(id).subscribe((res) => {
      this.toster.success('تم حذف السؤال بنجاح');
    });
  }
}
