import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DoctorService } from '../../doctor.service.service';

@Component({
  selector: 'app-new-exam',
  templateUrl: './new-exam.component.html',
  styleUrls: ['./new-exam.component.scss'],
})
export class NewExamComponent implements OnInit {
  name = new FormControl('');
  questionFrom!: FormGroup;
  question: any[] = [];
  correctnum: any;
  startAdd: boolean = false;
  sbjectname!: string | null;
  stepperIndex = 0;
  preview: boolean = false;
  id: any;
  constructor(
    private fb: FormBuilder,
    private toster: ToastrService,
    private service: DoctorService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.questionFrom = this.fb.group({
      question: ['', [Validators.required]],
      answer1: ['', [Validators.required]],
      answer2: ['', [Validators.required]],
      answer3: ['', [Validators.required]],
      answer4: ['', [Validators.required]],
    });
  }
  start() {
    if (this.name.value == '') {
      this.toster.error('يرجي ادخال اسم المادة');
    } else {
      this.startAdd = true;
      this.sbjectname = this.name.value;
    }
    if (this.startAdd) {
      this.stepperIndex = 1;
    }
  }
  clearform() {
    this.questionFrom.reset();
  }
  submit() {
    const model = {
      name: this.sbjectname,
      question: this.question,
    };

    if (this.preview) {
      this.stepperIndex = 2;
    } else {
      this.service.createSubject(model).subscribe((res: any) => {
        this.preview = true;
        this.id = res.id;
      });
    }
  }
  cancel() {
    this.questionFrom.reset();
    this.question = [];
    this.sbjectname = '';
    this.name.reset();
    this.stepperIndex = 0;
    this.startAdd = false;
  }
  createquestion() {
    if (this.correctnum) {
      const model = {
        question: this.questionFrom.value.question,
        answer1: this.questionFrom.value.answer1,
        answer2: this.questionFrom.value.answer2,
        answer3: this.questionFrom.value.answer3,
        answer4: this.questionFrom.value.answer4,
        correctanswer: this.questionFrom.value[this.correctnum],
      };

      this.question.push(model);
      this.questionFrom.reset();
    } else {
      this.toster.error(' يرجي اختيار الاجابه الصحيحه');
    }
  }

  getCorrect(event: any) {
    this.correctnum = event.value;
  }

  delete(index: number) {
    this.question.splice(index, 1);

    const model = {
      name: this.sbjectname,
      question: this.question,
    };
    this.service.updateSubject(model, this.id).subscribe((res) => {
      this.toster.success('تم حذف السؤال بنجاح');
    });
  }
}
