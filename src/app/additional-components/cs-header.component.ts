import { Component, Input } from '@angular/core';
@Component({
  selector: 'cs-header',
  template: `
    <div class="flex-left flex-center gap5">
        <span class="{{classes}}">{{label}}</span>
        <span class="{{classes}}" *ngIf="suffix.length > 0">{{suffix}}</span>
        <span *ngIf="help.length > 0" title="{{help}}" class="txt12 gl-icon glyphicon-info-sign cs-tooltip"></span>
    </div>
    `,
})
export class CsHeader{

    @Input() public label: string = "";
    @Input() public suffix: string = "";
    @Input() public help: string = "";
    @Input() public classes: string = "txt18";

}