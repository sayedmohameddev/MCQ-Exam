import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/serviecs/auth.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  dataSource: any;
  dataTable: any;
  displayedColumns: any;
  students: any[] = [];
  constructor(private service: AuthService) {
    this.displayedColumns = ['position', 'name', 'SubjectName', 'degree'];
    //this.dataSource = this.ELEMENT_DATA;
  }

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.service.getusers('students').subscribe((res: any) => {
      this.dataSource = res.map((student: any) => {
        if (student?.Subject) {
          return student?.Subject?.map((sub: any) => {
            return {
              name: student.username,
              sbjectName: sub.name,
              degree: sub.degree,
            };
          });
        } else {
          return [
            {
              name: student.username,
              sbjectName: '_',
              degree: '_',
            },
          ];
        }
      });
      this.dataTable = [];
      this.dataSource.forEach((item: any) => {
        item.forEach((sub: any) => {
          this.dataTable.push({
            name: sub.name,
            sbjectName: sub.sbjectName,
            degree: sub.degree,
          });
        });
      });
      // console.log(this.dataTable);
    });
  }
}
