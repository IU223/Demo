import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token?: string;
    user?: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    // 修改为你后端实际的基地址或使用代理配置。直接调用本地后端服务
    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    login(payload: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload);
    }
}
