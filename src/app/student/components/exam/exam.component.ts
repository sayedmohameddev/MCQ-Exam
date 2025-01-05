import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../doctor/doctor.service.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/serviecs/auth.service';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent implements OnInit {
  id: any;
  Subject: any;
  user: any = null;
  total: number = 0;
  showResult: boolean = false;
  studentInfo: any;
  userSubject: any[] = [];
  ValidExam: boolean = true;
  constructor(
    private toster: ToastrService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private service: DoctorService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getSubject();
    this.getLogedInUser();
  }

  getSubject() {
    this.service.getSubjectById(this.id).subscribe((res: any) => {
      this.Subject = res;
      //console.log(this.Subject);
    });
  }

  ngOnInit(): void {}
  getLogedInUser() {
    this.auth.getRole().subscribe((res) => {
      this.user = res;
      this.getUserData();
    });
  }
  getUserData() {
    this.auth.getStudent(this.user.userid).subscribe((res: any) => {
      this.studentInfo = res;
      this.userSubject = res?.Subject ? res?.Subject : [];

      this.checkValidExam();
    });
  }

  checkValidExam() {
    for (let x in this.userSubject) {
      // console.log(this.userSubject[x].id);
      if (this.userSubject[x].id == this.id) {
        this.total = this.userSubject[x].degree;
        this.toster.warning('تم اداء هذا الاختبار مسبقاً');

        this.ValidExam = false;
      }
    }
  }

  delete(index: number) {
    this.Subject.question.splice(index, 1);

    const model = {
      name: this.Subject.name,
      question: this.Subject.question,
    };
    this.service.updateSubject(model, this.id).subscribe((res) => {
      this.toster.success('تم حذف السؤال بنجاح');
    });
  }
  getAnswer(event: any) {
    let value = event.value;
    let questionIndex = event.source.name;
    this.Subject.question[questionIndex].studentAnswer = value;
    //console.log(this.Subject.question);
  }

  getResult() {
    this.total = 0;
    for (let i in this.Subject.question) {
      if (
        this.Subject.question[i].studentAnswer ==
        this.Subject.question[i].correctanswer
      ) {
        this.total += 1;
      }
    }
    this.showResult = true;
    this.userSubject.push({
      name: this.Subject.name,
      id: this.id,
      degree: this.total,
    });

    const model = {
      username: this.studentInfo.username,
      email: this.studentInfo.email,
      password: this.studentInfo.password,
      Subject: this.userSubject,
    };

    this.auth.UpdateStudent(this.user.userid, model).subscribe((res) => {
      this.toster.success('تم حفظ النتيجة بنجاح');
    });
  }
}
