import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DashboardService } from '../store/dashboard.service';
import { Dashboard, Widget } from '../store/dashboard.store';
import { GridsterConfig } from 'angular-gridster2';

export interface Bdcrums {
	label: string;
	path: string;
}

@Component({
	selector: 'app-view',
	templateUrl: './view.component.html'
})
export class ViewComponent implements OnInit {

	selectedDashboardId: string | null = '';
	options!: GridsterConfig;
	dashboard!: Dashboard | undefined;
	widgets!: Array<Widget> | undefined;
	preview: boolean = false;
	pathList: Bdcrums[] = [];
	widgetsCache: Widget[] = [];
	actions: any = [
		{
			name: 'Device presets',
			action: () => {},
			subList: [
				{
					name: 'Mobile',
					icon: 'fa-solid fa-mobile',
					action: () => {
						this.view('Mobile');
					}
				},
				{
					name: 'Tab',
					icon: 'fa-solid fa-tablet',
					action: () => {
						this.view('Tab');
					}
				},
				{
					name: 'Laptop',
					icon: 'fa-solid fa-laptop',
					action: () => {
						this.view('Laptop');
					}
				},
				{
					name: 'Desktop',
					icon: 'fa-solid fa-desktop',
					action: () => {
						this.view('Desktop');
					}
				},
				{
					name: 'Reset',
					icon: 'fa-solid fa-rotate',
					action: () => {
						this.view('');
					}
				}
			]
		},
		{
			name: 'Clone',
			action: () => {}
		},
		{
			name: 'Save as template',
			action: () => {}
		}
	];

	@ViewChild('rotate') rotate!: ElementRef;

	constructor(
		private route: ActivatedRoute, 
		private router: Router, 
		private dashboardService: DashboardService
	){}

	ngOnInit():void{

		this.selectedDashboardId = this.route.snapshot.paramMap.get('id') || '';
		this.dashboard = this.selectedDashboardId ? this.dashboardService.getDashboardById(this.selectedDashboardId) : undefined;
		this.options = {
			...this.dashboardService.options,
			draggable: { enabled: false },
			resizable: { enabled: false },
			minCols: this.dashboard?.gridSize,
			maxCols: this.dashboard?.gridSize
		};
		this.widgets = this.widgetsCache = this.dashboard ? this.dashboardService.extractData(this.dashboard) : [];
		this.pathList.push( 
			{ label: 'Custom Dashboard', path: '/list' },
			{ label: this.dashboard?.name  || '', path: `/view/${this.selectedDashboardId}` }
		);
	}

	routeUrl(path: string){
		this.router.navigateByUrl(path);
	}

	redirectionToEditPage() {
		this.router.navigateByUrl(`/add/${this.selectedDashboardId}`);
	}

	contextAction($event: any): void{
		$event.target.parentElement.nextSibling.classList.toggle('display-context');
	}

	dropDown(): void{
		this.rotate.nativeElement.firstChild.classList.toggle('rotate');
		this.rotate.nativeElement.parentElement.nextSibling.classList.toggle('display-subList');
	}

	view(device: string): void {

		if(device === 'reset') {
			this.widgets = this.widgetsCache;
			return;
		}

		let value: any = this.dashboard?.gridSize;

		if(device === 'Mobile') {
			value = 2;
		} else if(device === 'Tab') {
			value = 4;
		} else if(device === 'Laptop') {
			value = 6;
		} else if(device === 'Desktop') {
			value = 8;
		}
	
		this.options = {...this.options, minCols: value, maxCols: value };
		let newWidgets = [];
		for(let wid of this.widgets || []) {
			let sample: Widget = {...wid};
			if(wid.cols >= value) {
				sample.x = 0;
				sample.cols = value;
			} else if(wid.cols < value && wid.x+wid.cols > value) {
				sample.x = value - wid.cols;
			}
			newWidgets.push(sample);
		}

		let len = 0;
		for(let wid of newWidgets) {
			if(len >= value) {
				len = 0;
			}
	
			if(len+wid.cols <= value) {
				wid.x = len;
				len += wid.cols;
			}
		}
		this.widgets =  newWidgets;
	}
}
