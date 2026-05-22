import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditLog } from '../models/audit-log';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private apiUrl = `${environment.apiUrl}/audit-logs`;

  constructor(private http: HttpClient) {}

  /**
   * 获取日志列表（支持 LoopBack filter）
   */
  getLogs(filter?: any): Observable<AuditLog[]> {
    let params = new HttpParams();
    if (filter) {
      params = params.set('filter', JSON.stringify(filter));
    }
    return this.http.get<AuditLog[]>(this.apiUrl, { params });
  }

  /**
   * 获取日志总数（支持 where）
   */
  getLogsCount(where?: any): Observable<number> {
    let params = new HttpParams();
    if (where) {
      params = params.set('where', JSON.stringify(where));
    }
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`, { params }).pipe(
      map(r => r.count)
    );
  }

  /**
   * 获取单条日志详情
   */
  getLogById(id: number): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.apiUrl}/${id}`);
  }
}
