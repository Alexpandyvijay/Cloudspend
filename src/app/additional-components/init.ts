import { Input, Component } from '@angular/core';
@Component({
    selector: '[init]',
    template: `<ng-content/>`
}) 
export class CsNgInit {@Input() init: any;}