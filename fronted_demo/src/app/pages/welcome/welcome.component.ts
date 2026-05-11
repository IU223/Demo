import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService, NzMessageModule } from 'ng-zorro-antd/message';

import { forkJoin } from 'rxjs';
import * as echarts from 'echarts';

import { EmployeeService } from '../../services/employee.service';
import { SelectOption } from '../../models/employee';
import { environment } from '../../../environments/environment.development';

/** 排行榜徽章颜色 */
const BADGE_COLORS = [
  '#ff4d4f', '#ff7a45', '#52c41a',
  '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c', '#8c8c8c'
];
/** 排行榜柱条颜色 */
const BAR_COLORS = [
  '#ff4d4f', '#ff7a45', '#52c41a',
  '#1890ff', '#1890ff', '#1890ff', '#1890ff', '#1890ff', '#1890ff', '#1890ff'
];

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzDatePickerModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzMessageModule,
    // ★ 不再导入任何 ngx-echarts 模块/指令
  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit, OnDestroy {

  // ===================== ViewChild 图表容器 =====================
  @ViewChild('trendChartRef') trendChartEl!: ElementRef<HTMLDivElement>;
  @ViewChild('mapChartRef') mapChartEl!: ElementRef<HTMLDivElement>;
  @ViewChild('deptChartRef') deptChartEl!: ElementRef<HTMLDivElement>;
  @ViewChild('genderChartRef') genderChartEl!: ElementRef<HTMLDivElement>;

  // ===================== ECharts 实例 =====================
  private trendChart: echarts.ECharts | null = null;
  private mapEchart: echarts.ECharts | null = null;
  private deptEchart: echarts.ECharts | null = null;
  private genderEchart: echarts.ECharts | null = null;

  // ===================== 统计数据 =====================
  activeCount = 0;
  resignCount = 0;
  totalCount = 0;
  yoyActive = 0;
  momActive = 0;
  yoyResign = 0;
  momResign = 0;

  // ===================== 筛选条件 =====================
  startDate: Date | null = null;
  endDate: Date | null = null;
  selectedFactory = '';
  factoryOptions: SelectOption[] = [];

  // ===================== 厂别排行 =====================
  factoryRanking: { name: string; count: number; badgeColor: string; barColor: string }[] = [];
  displayedRanking: { name: string; count: number; badgeColor: string; barColor: string }[] = [];
  showAllFactories = false;

  // ===================== 原始数据 / 状态 =====================
  allEmployees: any[] = [];
  regionData: any[] = [];
  currentDate = '';
  loading = false;
  mapReady = false;
  mapLoadFailed = false;

  constructor(
    private employeeService: EmployeeService,
    private http: HttpClient,
    private message: NzMessageService
  ) { }

  // ==================== 生命周期 ====================

  ngOnInit(): void {
    this.currentDate = this.formatDisplayDate(new Date());
    this.loadFactoryOptions();
    this.loadWorldMap();
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    this.initCharts();
  }

  ngOnDestroy(): void {
    this.trendChart?.dispose();
    this.mapEchart?.dispose();
    this.deptEchart?.dispose();
    this.genderEchart?.dispose();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.trendChart?.resize();
    this.mapEchart?.resize();
    this.deptEchart?.resize();
    this.genderEchart?.resize();
  }

  // ==================== 初始化 ECharts 实例 ====================

  private initCharts(): void {
    if (this.trendChartEl?.nativeElement) {
      this.trendChart = echarts.init(this.trendChartEl.nativeElement);
    }
    if (this.mapChartEl?.nativeElement) {
      this.mapEchart = echarts.init(this.mapChartEl.nativeElement);
    }
    if (this.deptChartEl?.nativeElement) {
      this.deptEchart = echarts.init(this.deptChartEl.nativeElement);
    }
    if (this.genderChartEl?.nativeElement) {
      this.genderEchart = echarts.init(this.genderChartEl.nativeElement);
    }
  }

  // ==================== 下拉选项加载 ====================

  private loadFactoryOptions(): void {
    this.employeeService.getFactories().subscribe({
      next: opts => {
        this.factoryOptions = opts.filter(o => o.value !== '1');
      }
    });
  }

  // ==================== 仪表盘数据加载 ====================

  loadDashboardData(): void {
    this.loading = true;
    const where = this.buildWhereFilter();

    forkJoin({
      activeCount: this.employeeService.getCountByStatus(true, where),
      resignCount: this.employeeService.getCountByStatus(false, where),
      allEmployees: this.employeeService.getAllForAnalysis(where),
      regions: this.http.get<any[]>(`${environment.apiUrl}/regions`)
    }).subscribe({
      next: ({ activeCount, resignCount, allEmployees, regions }) => {
        this.activeCount = activeCount;
        this.resignCount = resignCount;
        this.totalCount = activeCount + resignCount;
        this.allEmployees = allEmployees;
        this.regionData = regions;

        this.calculateComparisons();
        this.buildTrendChart();
        this.buildFactoryRanking();
        this.buildDeptChart();
        this.buildGenderChart();

        if (this.mapReady) {
          this.buildMapChart();
        } else if (this.mapLoadFailed) {
          this.buildMapFallbackChart();
        }

        this.loading = false;
      },
      error: err => {
        console.error('加载仪表盘数据失败:', err);
        this.message.error('数据加载失败，请稍后重试');
        this.loading = false;
      }
    });
  }

  private buildWhereFilter(): any {
    const where: any = {};
    if (this.startDate && this.endDate) {
      where.hire_date = {
        between: [
          this.fmtDate(this.startDate),
          this.fmtDate(this.endDate) + 'T23:59:59'
        ]
      };
    }
    if (this.selectedFactory) {
      where.plant_name = this.selectedFactory;
    }
    return where;
  }

  onSearch(): void {
    this.loadDashboardData();
  }

  // ==================== 同比 / 环比计算 ====================

  private calculateComparisons(): void {
    const now = new Date();
    const curKey = this.monthKey(now.getFullYear(), now.getMonth() + 1);

    const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const prevKey = this.monthKey(prevYear, prevMonth);
    const lastYearKey = this.monthKey(now.getFullYear() - 1, now.getMonth() + 1);

    const hires = this.groupByMonth('hire_date');
    const resigns = this.groupByMonth('resin_date');

    const curH = hires[curKey] || 0;
    const prevH = hires[prevKey] || 0;
    const lyH = hires[lastYearKey] || 0;

    const curR = resigns[curKey] || 0;
    const prevR = resigns[prevKey] || 0;
    const lyR = resigns[lastYearKey] || 0;

    this.yoyActive = lyH > 0 ? +((curH - lyH) / lyH * 100).toFixed(2) : 0;
    this.momActive = prevH > 0 ? +((curH - prevH) / prevH * 100).toFixed(2) : 0;
    this.yoyResign = lyR > 0 ? +((curR - lyR) / lyR * 100).toFixed(2) : 0;
    this.momResign = prevR > 0 ? +((curR - prevR) / prevR * 100).toFixed(2) : 0;
  }

  private groupByMonth(field: string): Record<string, number> {
    const m: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      if (emp[field]) {
        const d = new Date(emp[field]);
        const key = this.monthKey(d.getFullYear(), d.getMonth() + 1);
        m[key] = (m[key] || 0) + 1;
      }
    });
    return m;
  }

  private monthKey(y: number, m: number): string {
    return `${y}-${String(m).padStart(2, '0')}`;
  }

  // ==================== 趋势折线图 ====================

  private buildTrendChart(): void {
    if (!this.trendChart) return;

    const now = new Date();
    const months: string[] = [];
    const hireData: number[] = [];
    const resignData: number[] = [];

    const hires = this.groupByMonth('hire_date');
    const resigns = this.groupByMonth('resin_date');

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = this.monthKey(d.getFullYear(), d.getMonth() + 1);
      months.push(`${d.getMonth() + 1}月`);
      hireData.push(hires[key] || 0);
      resignData.push(resigns[key] || 0);
    }

    this.trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['离职人数', '入职人数'],
        top: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 12, color: '#666' }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '40px', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: months,
        axisLine: { lineStyle: { color: '#d9d9d9' } },
        axisLabel: { color: '#666' }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLabel: { color: '#999' }
      },
      series: [
        {
          name: '离职人数',
          type: 'line',
          data: resignData,
          smooth: false,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: '#ff4d4f' },
          lineStyle: { color: '#ff4d4f', width: 2 }
        },
        {
          name: '入职人数',
          type: 'line',
          data: hireData,
          smooth: false,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: { color: '#faad14' },
          lineStyle: { color: '#faad14', width: 2 }
        }
      ]
    }, true);
  }

  // ==================== 厂别排行 ====================

  private buildFactoryRanking(): void {
    const map: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      const f = emp.plant_name || '未知';
      map[f] = (map[f] || 0) + 1;
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);

    this.factoryRanking = sorted.map(([name, count], i) => ({
      name,
      count,
      badgeColor: BADGE_COLORS[Math.min(i, BADGE_COLORS.length - 1)],
      barColor: BAR_COLORS[Math.min(i, BAR_COLORS.length - 1)]
    }));

    this.updateDisplayedRanking();
  }

  updateDisplayedRanking(): void {
    this.displayedRanking = this.showAllFactories
      ? this.factoryRanking
      : this.factoryRanking.slice(0, 10);
  }

  toggleShowAll(): void {
    this.showAllFactories = !this.showAllFactories;
    this.updateDisplayedRanking();
  }

  getMaxCount(): number {
    return this.factoryRanking.length > 0 ? this.factoryRanking[0].count : 1;
  }

  // ==================== 世界地图 ====================

  private loadWorldMap(): void {
    // ★ 改为世界地图 GeoJSON
    const mapUrl = 'https://cdn.jsdelivr.net/npm/echarts@5/map/json/world.json';

    fetch(mapUrl)
      .then(res => {
        if (!res.ok) throw new Error('Map fetch failed');
        return res.json();
      })
      .then(json => {
        echarts.registerMap('world', json as any);
        this.mapReady = true;
        if (this.allEmployees.length > 0 && this.mapEchart) {
          this.buildMapChart();
        }
      })
      .catch(err => {
        console.warn('地图加载失败，使用备用图表:', err);
        this.mapLoadFailed = true;
        if (this.allEmployees.length > 0 && this.mapEchart) {
          this.buildMapFallbackChart();
        }
      });
  }


  private buildMapChart(): void {
    if (!this.mapReady || !this.mapEchart) return;

    const regionCount: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      const r = emp.region_name || '未知';
      regionCount[r] = (regionCount[r] || 0) + 1;
    });

    const scatterData = this.regionData
      .filter((r: any) => r.longitude != null && r.latitude != null)
      .map((r: any) => ({
        name: r.region_name,
        value: [r.longitude, r.latitude, regionCount[r.region_name] || 0]
      }));

    this.mapEchart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => `${params.name}<br/>人数：${params.value?.[2] || 0}`
      },
      geo: {
        map: 'world',            // ★ 改为 'world'
        roam: true,
        zoom: 1.5,               // ★ 世界地图缩放比例
        center: [105, 30],       // ★ 居中到亚洲区域（可根据数据调整）
        silent: false,
        label: { show: false },
        itemStyle: {
          areaColor: '#dce9f7',
          borderColor: '#a3c4e0',
          borderWidth: 0.5
        },
        emphasis: {
          itemStyle: {
            areaColor: '#b3d1ea'
          },
          label: { show: false }
        }
      },
      series: [{
        type: 'scatter',
        coordinateSystem: 'geo',
        data: scatterData,
        symbolSize: (val: any) => {
          const count = val[2] || 0;
          return Math.max(8, Math.min(40, Math.sqrt(count) * 2));
        },
        itemStyle: {
          color: '#ff4d4f',
          shadowBlur: 10,
          shadowColor: 'rgba(255, 77, 79, 0.4)'
        },
        label: {
          show: true,
          position: 'right',
          formatter: (p: any) => `${p.name} ${p.value[2]}人`,
          fontSize: 11,
          color: '#333',
          backgroundColor: 'rgba(255,255,255,0.85)',
          padding: [3, 6],
          borderRadius: 3
        }
      }]
    }, true);
  }


  /** 地图加载失败时的备用柱状图 */
  private buildMapFallbackChart(): void {
    if (!this.mapEchart) return;

    const regionCount: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      const r = emp.region_name || '未知';
      regionCount[r] = (regionCount[r] || 0) + 1;
    });
    const sorted = Object.entries(regionCount).sort((a, b) => b[1] - a[1]);

    this.mapEchart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '10%', bottom: '3%', top: '10%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: sorted.map(([n]) => n).reverse(),
        axisLabel: { fontSize: 11 }
      },
      series: [{
        type: 'bar',
        data: sorted.map(([, c]) => c).reverse(),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#1890ff' },
            { offset: 1, color: '#69c0ff' }
          ])
        },
        barWidth: '60%'
      }]
    }, true);
  }

  // ==================== 部门饼图 ====================

  private buildDeptChart(): void {
    if (!this.deptEchart) return;

    const map: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      const d = emp.dept_desc || '未知';
      map[d] = (map[d] || 0) + 1;
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const pieData = sorted.map(([name, value]) => ({ name, value }));

    this.deptEchart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['0%', '65%'],
        center: ['50%', '52%'],
        data: pieData,
        label: {
          show: true,
          formatter: '{b}\n{c}',
          fontSize: 10,
          color: '#555'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        }
      }]
    }, true);
  }

  // ==================== 性别环形图 ====================

  private buildGenderChart(): void {
    if (!this.genderEchart) return;

    let male = 0, female = 0, unknown = 0;
    this.allEmployees.forEach((emp: any) => {
      if (emp.Sex === true) male++;
      else if (emp.Sex === false) female++;
      else unknown++;
    });

    const total = male + female + unknown;
    const mp = total > 0 ? Math.round(male / total * 100) : 0;
    const fp = total > 0 ? Math.round(female / total * 100) : 0;
    const up = 100 - mp - fp;

    this.genderEchart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: {
        orient: 'vertical',
        right: '2%',
        top: 'center',
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        formatter: (name: string) => {
          if (name === '男') return `男：${mp}%（${male}）`;
          if (name === '女') return `女：${fp}%（${female}）`;
          return `未知：${up}%（${unknown}）`;
        },
        textStyle: { fontSize: 12, lineHeight: 22 }
      },
      title: {
        text: '总人',
        subtext: `${total}`,
        left: '30%',
        top: '35%',
        textAlign: 'center',
        textStyle: { fontSize: 13, color: '#999', fontWeight: 'normal' },
        subtextStyle: { fontSize: 24, color: '#333', fontWeight: 'bold' }
      },
      series: [{
        type: 'pie',
        radius: ['45%', '65%'],
        center: ['30%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: male, name: '男', itemStyle: { color: '#1890ff' } },
          { value: female, name: '女', itemStyle: { color: '#ff85c0' } },
          { value: unknown, name: '未知', itemStyle: { color: '#d9d9d9' } }
        ]
      }]
    }, true);
  }

  // ==================== 日期禁用 ====================

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endDate) return false;
    return startValue.getTime() > this.endDate.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startDate) return false;
    return endValue.getTime() < this.startDate.getTime();
  };

  // ==================== 工具函数 ====================

  private formatDisplayDate(d: Date): string {
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  }

  private fmtDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
}
