import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, HostListener, NgZone
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
  deptMap: Record<string, string> = {};
  deptDescToCode: Record<string, string> = {};
  // ===================== 部门饼图自定义 Tooltip =====================
  // 部门饼图自定义 Tooltip
  deptTooltipVisible = false;
  deptTooltipTitle = '';
  deptTooltipDetails: { code: string; desc: string; count: number }[] = [];
  deptTooltipTop = 0;
  deptTooltipLeft = 0;


  constructor(
    private employeeService: EmployeeService,
    private http: HttpClient,
    private message: NzMessageService,
    private ngZone: NgZone
  ) { }

  // ==================== 生命周期 ====================

  ngOnInit(): void {
    this.currentDate = this.formatDisplayDate(new Date());
    this.loadFactoryOptions();
    this.loadWorldMap();
    this.loadDashboardData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initCharts();
      // 数据可能已经在延迟期间加载完毕，需要立即渲染
      if (this.allEmployees.length > 0) {
        this.buildTrendChart();
        this.buildDeptChart();
        this.buildGenderChart();
        if (this.mapReady) {
          this.buildMapChart();
        } else if (this.mapLoadFailed) {
          this.buildMapFallbackChart();
        }
      }
    }, 400);
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
      regions: this.http.get<any[]>(`${environment.apiUrl}/regions`),
      departments: this.http.get<any[]>(`${environment.apiUrl}/departments`)   // ★ 新增
    }).subscribe({
      next: ({ activeCount, resignCount, allEmployees, regions, departments }) => {
        this.activeCount = activeCount;
        this.resignCount = resignCount;
        this.totalCount = activeCount + resignCount;
        this.allEmployees = allEmployees;
        this.regionData = regions;
        console.log(this.regionData);
        // ★ 新增：建立部门映射
        this.buildDeptMap(departments);

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

        // setTimeout(() => this.resizeAllCharts(), 100);
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
  onReset(): void {
    this.startDate = null;
    this.endDate = null;
    this.selectedFactory = '';
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
    // ★ 优先使用本地 assets，不再依赖外部 CDN
    const localUrl = 'assets/map/world.json';

    fetch(localUrl)
      .then(res => {
        if (!res.ok) throw new Error(`Local map load failed: ${res.status}`);
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

    // 1. 按地区聚合人数
    const regionCount: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      const r = emp.region_name || '未知';
      regionCount[r] = (regionCount[r] || 0) + 1;
    });

    // 2. 构建散点数据（按人数降序）
    const scatterData = this.regionData
      .filter((r: any) => r.longitude != null && r.latitude != null)
      .map((r: any) => ({
        name: r.region_name,
        name_cn: r.region_name_cn,
        value: [r.longitude, r.latitude, regionCount[r.region_name] || 0]
      }))
      .sort((a: any, b: any) => b.value[2] - a.value[2]);

    // 3. ★ 拆分：前3名 vs 其余
    const top3Data = scatterData.slice(0, 3);
    const restData = scatterData.slice(3);

    // 4. 为前3名计算标签位置 + 连线
    const labelPositions = this.calculateLabelPositions(top3Data);
    const linesData: any[] = [];
    const labelPoints: any[] = [];

    top3Data.forEach((point: any, index: number) => {
      const labelPos = labelPositions[index];

      linesData.push({
        coords: [
          [point.value[0], point.value[1]],
          [labelPos.lon, labelPos.lat]
        ]
      });

      labelPoints.push({
        name: point.name,
        value: [labelPos.lon, labelPos.lat, point.value[2]],
        dataIndex: index
      });
    });

    // 5. 颜色方案
    const colors = ['#ff4d4f', '#ff7a45', '#ffa940', '#fadb14', '#52c41a', '#1890ff', '#722ed1'];
    const getColor = (index: number): string => colors[Math.min(index, colors.length - 1)];

    this.mapEchart.setOption({
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderColor: 'transparent',
        textStyle: { color: '#ffffffff', fontSize: 13 },
        formatter: (params: any) => {
          console.log("参数" + JSON.stringify(params));
          if (params.seriesType === 'lines') return '';
          if (params.seriesName === '标签') return '';  // 标签端点不重复显示
          const count = params.value?.[2] ?? 0;
          return `
          <div style="padding:4px 8px;">
            <div style="font-size:14px;font-weight:600;margin-bottom:4px;">📍 ${params.name}:${params.data.name_cn}</div>
            <div style="font-size:20px;font-weight:700;color:#faad14;">
              ${count.toLocaleString()} <span style="font-size:12px;color:#ccc;">人</span>
            </div>
          </div>`;
        }
      },
      geo: {
        map: 'world',
        roam: true,
        zoom: 1.5,
        center: [90, 20],
        label: { show: false },
        itemStyle: {
          areaColor: '#d6e4f0',
          borderColor: '#a3bdd4',
          borderWidth: 0.5
        },
        emphasis: {
          itemStyle: { areaColor: '#b3d1ea' },
          label: {
            show: true,
          }
        }
      },
      series: [
        // ★ 系列1：前3名散点（带颜色排名）
        {
          name: 'TOP3',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: top3Data,
          symbolSize: 10,
          itemStyle: {
            color: (params: any) => getColor(params.dataIndex),
            borderColor: '#fff',
            borderWidth: 1.5,
            shadowBlur: 6,
            shadowColor: 'rgba(0,0,0,0.2)'
          },
          label: { show: false },
          zlevel: 2
        },

        // ★ 系列2：其余散点 — 默认不显示标签，hover 时显示
        {
          name: '其他地区',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: restData.map((d: any, i: number) => ({
            ...d,
            dataIndex: i + 3   // 保留全局索引用于取色
          })),
          symbolSize: 10,
          itemStyle: {
            color: (params: any) => {
              const idx = params.data.dataIndex ?? (params.dataIndex + 3);
              if (params.value[2] === 0) return '#bfbfbf';
              return getColor(idx);
            },
            borderColor: '#fff',
            borderWidth: 1.5,
            shadowBlur: 6,
            shadowColor: 'rgba(0,0,0,0.2)'
          },
          // ★ 默认不显示标签
          label: { show: false },
          // ★ 鼠标悬停时显示标签
          emphasis: {
            scale: true,
            itemStyle: {
              shadowBlur: 12,
              shadowColor: 'rgba(0,0,0,0.4)',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'right',
              distance: 8,
              formatter: (p: any) => {
                const count = p.value[2];
                return `${p.name}  ${count.toLocaleString()}人`;
              },
              fontSize: 13,
              fontWeight: 700,
              color: (params: any) => {
                const idx = params.data.dataIndex ?? (params.dataIndex + 3);
                if (params.value[2] === 0) return '#999';
                return getColor(idx);
              },
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: [4, 8],
              borderRadius: 4,
              borderColor: '#ddd',
              borderWidth: 1
            }
          },
          zlevel: 2
        },

        // ★ 系列3：连线 — 仅前3名
        {
          name: '连线',
          type: 'lines',
          coordinateSystem: 'geo',
          data: linesData,
          lineStyle: {
            color: '#aaa',
            width: 1,
            type: 'solid',
            curveness: 0.2,
            opacity: 0.4
          },
          zlevel: 1
        },

        // ★ 系列4：标签端点 — 仅前3名
        {
          name: '标签',
          type: 'scatter',
          coordinateSystem: 'geo',
          data: labelPoints,
          symbol: 'circle',
          symbolSize: 4,
          itemStyle: {
            color: (params: any) => getColor(params.data.dataIndex),
            borderColor: '#fff',
            borderWidth: 1
          },
          label: {
            show: true,
            position: 'right',
            distance: 5,
            formatter: (p: any) => {
              const count = p.value[2];
              const idx = p.data.dataIndex;
              return `{s${idx}|${p.name}  ${count.toLocaleString()}人}`;
            },
            rich: (() => {
              const richStyles: Record<string, any> = {};
              for (let i = 0; i < 3; i++) {
                const color = getColor(i);
                richStyles[`s${i}`] = {
                  fontSize: 13,
                  fontWeight: 700,
                  color: color,
                  padding: [4, 8],
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  borderRadius: 4,
                  borderColor: color,
                  borderWidth: 1,
                  lineHeight: 22
                };
              }
              return richStyles;
            })()
          },
          zlevel: 3
        }
      ]
    }, true);
  }
  /**
   * ★ 计算标签在右侧空白区域的位置
   * 标签放在太平洋空白海域，垂直排列，避免与地图陆地重叠
   */
  private calculateLabelPositions(data: any[]): { lon: number; lat: number }[] {
    const count = data.length;

    // 标签列的经度位置（太平洋空白区域）
    const baseLon = 160;

    // 根据数据量动态计算垂直分布范围
    const topLat = 50;                                   // 最高标签的纬度
    const spacing = count > 1 ? Math.min(15, 70 / count) : 0;  // 标签间距（自动适应）

    return data.map((_: any, index: number) => ({
      lon: baseLon + (index % 2 === 0 ? 0 : 5),          // 奇偶交错，避免标签重叠
      lat: topLat - index * spacing
    }));
  }
  /**
   * ★ 计算每个散点的标签偏移方向和距离，避免标签重叠
   * 策略：按索引交替分配不同方向（右上、右下、左上、左下等）
   */
  private calculateLabelOffsets(data: any[]): { dx: number; dy: number }[] {
    // 预定义偏移方向（经度偏移, 纬度偏移）
    const directions = [
      { dx: 15, dy: 8 },     // 右上
      { dx: 18, dy: -5 },    // 右下
      { dx: -18, dy: 10 },   // 左上
      { dx: 20, dy: -12 },   // 右下远
      { dx: -15, dy: -8 },   // 左下
      { dx: 22, dy: 3 },     // 右平
      { dx: -20, dy: -3 },   // 左平
      { dx: 12, dy: 15 },    // 右上远
      { dx: -12, dy: 15 },   // 左上远
      { dx: 25, dy: -8 },    // 右下远
    ];

    return data.map((_: any, index: number) => {
      const dir = directions[index % directions.length];
      // 根据索引稍微调整距离，避免完全重叠
      const scale = 1 + (index * 0.05);
      return {
        dx: dir.dx * scale,
        dy: dir.dy * scale
      };
    });
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
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.75)',
        borderColor: 'transparent',
        textStyle: { color: '#fff', fontSize: 13 },
        formatter: (params: any) => {
          // ★ 过滤掉 geo 组件（国家区域）的 tooltip → 白色框消失
          if (params.componentType === 'geo') return '';
          if (params.seriesType === 'lines') return '';
          if (params.seriesName === '标签') return '';
          const count = params.value?.[2] ?? 0;
          return `
      <div style="padding:4px 8px;">
        <div style="font-size:14px;font-weight:600;margin-bottom:4px;">📍 ${params.name}</div>
        <div style="font-size:20px;font-weight:700;color:#faad14;">
          ${count.toLocaleString()} <span style="font-size:12px;color:#ccc;">人</span>
        </div>
      </div>`;
        }
      },
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

  // ==================== 部门饼图（按编码前3位归类） ====================

  private buildDeptChart(): void {
    if (!this.deptEchart) return;

    // ── 1. 按 dept_desc 统计每个部门的人数 ──
    const deptCountMap: Record<string, number> = {};
    this.allEmployees.forEach((emp: any) => {
      const raw = emp.dept_desc || '未知';
      deptCountMap[raw] = (deptCountMap[raw] || 0) + 1;
    });

    // ── 2. 按 dept_code 前3位归类 ──
    const groupMap: Record<string, {
      total: number;
      details: { code: string; desc: string; count: number }[];
    }> = {};

    Object.entries(deptCountMap).forEach(([desc, count]) => {
      const code = this.deptDescToCode[desc] || desc;
      const prefix = code.length >= 3 ? code.substring(0, 3) : code;

      if (!groupMap[prefix]) {
        groupMap[prefix] = { total: 0, details: [] };
      }
      groupMap[prefix].total += count;
      groupMap[prefix].details.push({ code, desc, count });
    });

    // ── 3. 按总人数降序排序 ──
    const sorted = Object.entries(groupMap).sort((a, b) => b[1].total - a[1].total);

    // ── 4. 构建饼图数据 ──
    const pieData = sorted.map(([prefix, group]) => {
      group.details.sort((a, b) => b.count - a.count);
      return {
        name: prefix,
        value: group.total,
        details: group.details
      };
    });

    // ── 5. 渲染（★ 禁用内置 tooltip，改用自定义浮层） ──
    this.deptEchart.setOption({
      tooltip: { show: false },          // ★ 禁用内置 tooltip
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

    // ── 6. ★ 绑定自定义 Tooltip 事件 ──
    this.bindDeptChartEvents();
  }

  /**
   * ★ 绑定饼图鼠标事件 → 驱动自定义 Tooltip 浮层
   */
  private bindDeptChartEvents(): void {
    if (!this.deptEchart) return;

    this.deptEchart.off('mouseover');
    this.deptEchart.off('mouseout');
    this.deptEchart.off('mousemove');      // ★ 新增

    // 鼠标移入扇区 → 显示浮层
    this.deptEchart.on('mouseover', (params: any) => {
      if (params.componentType !== 'series') return;

      this.ngZone.run(() => {
        const details = params.data?.details || [];
        this.deptTooltipTitle = `${params.name} — 共 ${params.value} 人（${params.percent}%）`;
        this.deptTooltipDetails = details;
        this.deptTooltipVisible = true;
      });
    });

    // ★ 鼠标移动 → 跟随鼠标位置（带边界检测）
    this.deptEchart.getZr().on('mousemove', (params: any) => {
      if (!this.deptTooltipVisible) return;

      this.ngZone.run(() => {
        const mouseX = params.event?.clientX ?? params.offsetX ?? 0;
        const mouseY = params.event?.clientY ?? params.offsetY ?? 0;

        const tooltipWidth = 350;     // 预估宽度
        const tooltipHeight = 300;    // 预估高度
        const offset = 15;            // 鼠标与浮层间距

        // ★ 边界检测：防止超出视口
        let x = mouseX + offset;
        let y = mouseY + offset;

        // 右侧超出 → 显示在鼠标左侧
        if (x + tooltipWidth > window.innerWidth) {
          x = mouseX - tooltipWidth - offset;
        }
        // 底部超出 → 显示在鼠标上方
        if (y + tooltipHeight > window.innerHeight) {
          y = mouseY - tooltipHeight - offset;
        }
        // 左侧/顶部不超出
        x = Math.max(10, x);
        y = Math.max(10, y);

        this.deptTooltipTop = y;
        this.deptTooltipLeft = x;
      });
    });

    // 鼠标移出扇区 → 隐藏浮层
    this.deptEchart.on('mouseout', () => {
      this.ngZone.run(() => {
        this.deptTooltipVisible = false;
      });
    });
  }




  /**
   * 建立部门映射表
   * 同时支持 dept_code → dept_desc 和 dept_desc → dept_desc
   */
  private buildDeptMap(departments: any[]): void {
    this.deptMap = {};
    this.deptDescToCode = {};

    departments.forEach((dept: any) => {
      const code = dept.dept_code || '';
      const desc = dept.dept_desc || '';

      // 正向：code → desc（用于其他场景）
      if (code && desc) {
        this.deptMap[code] = desc;
      }
      if (desc) {
        this.deptMap[desc] = desc;
      }
      if (desc && code) {
        this.deptDescToCode[desc] = code;
      }
      if (code) {
        this.deptDescToCode[code] = code;
      }
    });
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
        right: '-4%',
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
        text: '总人数',
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
