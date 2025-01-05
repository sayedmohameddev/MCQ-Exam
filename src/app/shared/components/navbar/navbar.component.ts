import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../auth/serviecs/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  constructor(private service: AuthService) {}
  user: any = null;
  ngOnInit(): void {
    this.service.user.subscribe((res: any) => {
      if (res.type) {
        this.user = res;
      }
    });
  }
  Ontogglesidenav() {
    this.sidenavToggle.emit();
  }
  logout() {
    const model = {};
    this.service.login(model).subscribe((res) => {
      this.user = null;
      this.service.user.next(res);
    });
  }
}
