import { Component, Input } from "@angular/core";
import { GridsterConfig } from "angular-gridster2";
import { Widget } from "../store/dashboard.store";

@Component({
    selector: 'app-gridster',
    template: `
        <gridster class="gridster-main" [options]="options">
            <gridster-item class="gridster-items" [item]="item" *ngFor="let item of widgets">
                <div class="widget-wrap">
                    <div *ngIf="preview" class="widget-action">
                        <div>{{item.name}}</div>
                        <span class="icon" (click)="editWidget(item.id)">
                            <i class="fas fa-edit"></i>
                        </span>
                        <span class="icon" (click)="deleteWidget(item.id)">
                            <i class="fa-solid fa-trash"></i>
                        </span>
                    </div>
                    <cs-barchart></cs-barchart>
                </div>
            </gridster-item>
        </gridster>
    `
})
export class GridsterComponent {
    options: GridsterConfig = {};
    widgets: Widget[] = [];
    preview: boolean = false;
    editWidget: any;
    deleteWidget: any;

    constructor() {
    }
}