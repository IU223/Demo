import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, NzIconModule, NzLayoutModule, NzMenuModule],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss'
})
export class DefaultComponent {
  isCollapsed = false;
  activeMenu: string = 'home';

  // 点击菜单时调用的方法
  selectMenu(menuName: string) {
    this.activeMenu = menuName;
  }
}
