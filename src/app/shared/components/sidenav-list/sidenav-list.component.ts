import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../auth/serviecs/auth.service';

@Component({
  selector: 'app-sidenav-list',

  templateUrl: './sidenav-list.component.html',
  styleUrl: './sidenav-list.component.scss',
})
export class SidenavListComponent implements OnInit {
  user: any = null;

  @Output() sidenavclose = new EventEmitter();
  constructor(private service: AuthService) {}
  ngOnInit(): void {
    this.service.user.subscribe((res: any) => {
      if (res.type) {
        this.user = res;
        // console.log(res);
      }
    });
  }
  Sidenavclose() {
    this.sidenavclose.emit();
  }
  logout() {
    this.sidenavclose.emit();

    const model = {};
    this.service.login(model).subscribe((res) => {
      this.user = null;
      this.service.user.next(res);
    });
  }
}
