import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';

export interface AnalysisTemplate {
    template_id?: number;
    title: string;
    prompt: string;
    category?: string;
    sort_order?: number;
}

/** 模板分类 → Emoji 映射 */
const CATEGORY_ICONS: Record<string, string> = {
    structure: '📊',
    trend: '📈',
    region: '🗺️',
    department: '🏥',
};

@Component({
    selector: 'app-ai-template-bar',
    standalone: true,
    imports: [CommonModule, NzButtonModule, NzIconModule, NzSpinModule],
    templateUrl: './ai-template-bar.component.html',
    styleUrls: ['./ai-template-bar.component.scss'],
})
export class AiTemplateBarComponent {
    @Input() templates: AnalysisTemplate[] = [];
    @Input() loading = false;
    @Input() disabled = false;
    @Output() templateSelected = new EventEmitter<AnalysisTemplate>();

    onSelect(template: AnalysisTemplate): void {
        if (this.disabled) return;
        this.templateSelected.emit(template);
    }

    getIcon(category?: string): string {
        return CATEGORY_ICONS[category || ''] || '💡';
    }
}
