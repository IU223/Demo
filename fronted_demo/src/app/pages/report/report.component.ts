// report.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';

interface ReportData {
  id: string;
  name: string;
  englishName: string;
  area: string;
  factory: string;
  department: string;
  status: string;
  checked?: boolean;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzDatePickerModule,
    NzSelectModule,
    NzIconModule
  ],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  // 筛选条件
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedArea: string = '1';
  selectedFactory: string = '1';
  searchText: string = '';

  // 地区选项
  areaOptions = [
    { label: '全部', value: '1' },
    { label: 'WZS', value: 'WZS' },
    { label: 'WKS', value: 'WKS' }
  ];

  // 厂别选项
  factoryOptions = [
    { label: '全部', value: '1' },
    { label: 'F232', value: 'F232' },
    { label: 'F233', value: 'F233' }
  ];

  // 表格数据
  listOfData: ReportData[] = [];
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  ngOnInit(): void {
    this.loadData();
  }

  // 加载数据
  loadData(): void {
    this.listOfData = [
      {
        id: 'Z19070503',
        name: '王小帅',
        englishName: 'Arlen Shaw',
        area: 'WZS',
        factory: 'F232',
        department: '智慧制造系统开发二部',
        status: '在职'
      },
      {
        id: 'Z19070503',
        name: '王小帅',
        englishName: 'Arlen Shaw',
        area: 'WKS',
        factory: 'F232',
        department: '智慧制造系统开发二部',
        status: '在职'
      },
      {
        id: 'Z19070503',
        name: '王小帅',
        englishName: 'Arlen Shaw',
        area: 'WZS',
        factory: 'F232',
        department: '智慧制造系统开发二部',
        status: '在职'
      },
      {
        id: 'Z19070503',
        name: '王小帅',
        englishName: 'Arlen Shaw',
        area: 'WZS',
        factory: 'F232',
        department: '智慧制造系统开发二部',
        status: '离职'
      }
    ];
  }

  // 全选/取消全选
  onAllChecked(checked: boolean): void {
    this.listOfData.forEach(item => this.updateCheckedSet(item.id, checked));
    this.refreshCheckedStatus();
  }

  // 单选
  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  // 更新选中集合
  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  // 刷新选中状态
  refreshCheckedStatus(): void {
    this.checked = this.listOfData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  // 搜索
  onSearch(): void {
    console.log('搜索:', this.searchText);
    // 实现搜索逻辑
  }

  // 删除
  onDelete(): void {
    console.log('删除选中项:', Array.from(this.setOfCheckedId));
    // 实现删除逻辑
  }

  // 新增
  onAdd(): void {
    console.log('新增');
    // 实现新增逻辑
  }

  // 查看
  onView(data: ReportData): void {
    console.log('查看:', data);
    // 实现查看逻辑
  }

  // 编辑
  onEdit(data: ReportData): void {
    console.log('编辑:', data);
    // 实现编辑逻辑
  }
}
