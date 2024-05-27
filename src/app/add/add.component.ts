import { 
	Component, 
	HostListener, 
	OnInit, 
	ElementRef, 
	ViewChildren, 
	QueryList,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { DashboardService } from '../store/dashboard.service';
import { Widget, Dashboard } from '../store/dashboard.store';
import { Bdcrums } from '../view/view.component';
import { FormGroup, FormControl } from '@angular/forms';
import { GridsterConfig, CompactType, GridsterItem } from 'angular-gridster2';
import { v4 as uuidv4 } from 'uuid';
import { timeHours } from 'd3';

enum navPath {
	EDITDASH = 'edit-dashboard',
	EDITWID = 'edit-widget'
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {

  selectedDashboardId: any = '';
  selectedWidget: Widget | undefined;
  widgets: Widget[] = [];
  preview: boolean = true;
  dashboard!: Dashboard | undefined;
  dashboardForm = new FormGroup({
	name: new FormControl(''),
	description: new FormControl('')
  });
  addWidgetForm = new FormGroup({
	widgetName: new FormControl(''),
	account: new FormControl(''),
	tags: new FormControl(''),
	date_range: new FormControl(''),
	cost_type: new FormControl('')
  });

  currentStep: number = 0;
  widgetState: string = 'add';
  loader: boolean = false;
  localNavigation: string = navPath.EDITDASH;
  gridSize: number = 8;
  widgetCache: Widget[] = [];
  options!: GridsterConfig;
  pathList: Bdcrums[] = [
	{ label: 'Custom Dashboard', path: '/list' },
	{ label: 'Configure Dashboard', path: `/add/${this.selectedDashboardId}` }
  ];

  widgetList: any = [
		{
			label: 'Cost Split by Accounts',
			value: 'cost-split-by-accounts'
		},
		{
			label: 'Cost Split by Region',
			value: 'cost-split-by-region'
		}
  ];

  @ViewChildren('accounts') accounts!: QueryList<ElementRef>;
//   @ViewChildren('body') body!: ElementRef;

  constructor(
	private route: ActivatedRoute, 
	private router: Router, 
	private dashboardService: DashboardService,
	public viewContainerRef: ViewContainerRef
  ){}

  @HostListener('window:resize', ['$event'])
  resize($event: any){
		let screenWidth ={
		'sw': $event.srcElement.innerWidth,
		'ww': $event.srcElement.innerWidth,
		'sh': $event.srcElement.innerHeight,
		};
		let isDesktop = screenWidth.sw >= 992 || screenWidth.ww >= 992;
		let isTab = (screenWidth.sw >= 768 || screenWidth.ww >= 768) && (screenWidth.sw < 992 || screenWidth.ww < 992);
		let isMobile = screenWidth.sw < 768 || screenWidth.ww < 768;

		// if(isDesktop) {
		// 	this.body.nativeElement.classList.remove('desktop-screen','tab-screen','mobile-screen');
		// 	this.body.nativeElement.classList.add('desktop-screen');
		// } else if(isTab) {
		// 	this.body.nativeElement.classList.remove('desktop-screen','tab-screen','mobile-screen');
		// 	this.body.nativeElement.classList.add('tab-screen');
		// } else if(isMobile) {
		// 	this.body.nativeElement.classList.remove('desktop-screen','tab-screen','mobile-screen');
		// 	this.body.nativeElement.classList.add('mobile-screen');
		// }
  }

  ngOnInit():void{ 
	this.selectedDashboardId = this.route.snapshot.paramMap.get('id') || '';
	this.dashboard = this.selectedDashboardId ? this.dashboardService.getDashboardById(this.selectedDashboardId) : undefined;
	this.options = { ...this.dashboardService.options,
		draggable: { enabled: true },
		resizable: { enabled: true },
		itemChangeCallback: this.onItemChange.bind(this),
		minCols: this.dashboard?.gridSize,
		maxCols: this.dashboard?.gridSize
	};
	this.widgets = this.widgetCache = this.dashboard ? this.dashboardService.extractData(this.dashboard) : [];

	this.dashboardForm.patchValue({
		name: this.dashboard?.name,
		description: this.dashboard?.description
	});
  }

  routeUrl(path: string){
	this.router.navigateByUrl(path);
  }

  wizardCallBack($event: any) {
	if($event.action === 'validate-before-next') {
		$event.callback({status: true});
	} else if($event.action === 'cancel') {
		this.localRoute('cancel');
	} else if($event.action === 'next') {
		$event.callback();
	} else if($event.action === 'validate-before-prev') {
		$event.callback({status: true});
	} else if($event.action === 'prev') {
		$event.callback();
	} else if($event.action === 'completed') {
		if(this.widgetState === 'add') {
			this.addWidget(this.addWidgetForm.value);
		} else {
			let item: any = {
				id: this.selectedWidget?.id,
				name: this.addWidgetForm.value.widgetName,
				account: this.addWidgetForm.value.account,
				tags: this.addWidgetForm.value.tags,
				date_range: this.addWidgetForm.value.date_range,
				cost_type: this.addWidgetForm.value.cost_type,
				cols: this.selectedWidget?.cols,
				rows: this.selectedWidget?.rows,
				minItemCols: this.selectedWidget?.minItemCols,
				x: this.selectedWidget?.x,
				y: this.selectedWidget?.y
			}
			this.updateWidget(item);
			this.widgetState = 'add';
		}
		$event.callback();
		this.currentStep = 0;
		this.localRoute('cancel');
		this.addWidgetForm.patchValue({
			widgetName: '',
			account: '',
			tags: '',
			cost_type: '',
			date_range: ''
		});
		this.selectedWidget = undefined;
	}
  }

  localRoute(buttonType: string) {
	if(buttonType === 'add-widget') {
		this.localNavigation = navPath.EDITWID;
	} else if(buttonType === 'cancel') {
		this.localNavigation = navPath.EDITDASH;
	}
  }

  onClickHandlerForAccount($event: any, value: string) {

	this.accounts.forEach((div: ElementRef) => {
		div.nativeElement.classList.remove('selected-account')
	});
	$event.target.classList.add('selected-account')
	this.addWidgetForm.patchValue({
		account : value
	});
  }

  editWidget(id: string):void {

	this.localRoute('add-widget');

	let widget = this.widgets.find((e)=>{
		return id === e.id;
	});
	this.addWidgetForm.patchValue({
		widgetName: widget?.name,
		account: widget?.account,
		tags: widget?.tags,
		cost_type: widget?.cost_type,
		date_range: widget?.date_range
	});
	this.widgetState = 'edit';
	this.selectedWidget = widget;
  }

  updateDashboard() {
	this.dashboardService.updateDashboard(this.selectedDashboardId, this.dashboardForm.value.name, this.dashboardForm.value.description, this.gridSize);
	this.dashboardService.updateWidget(this.selectedDashboardId, this.widgetCache);
	this.routeUrl(`/list`);
  }

  onNgModelChange($event: any) {

	if($event === null) {
		return;
	}
	
	let value: number = $event>1 && $event<=12 ? $event : 8;

	this.options = {...this.options, minCols: value, maxCols: value };
	let newWidgets = [];
	for(let wid of this.widgetCache) {
		let sample: Widget = {...wid};
		if(wid.cols >= value) {
			sample.x = 0;
			sample.cols = value;
		} else if(wid.cols < value && wid.x+wid.cols > value) {
			sample.x = value - wid.cols;
		}
		newWidgets.push(sample);
	}
	this.widgets = this.widgetCache =  newWidgets;
  }

  autoArrange() {
	this.options = {...this.options, compactType: CompactType.CompactUpAndLeft };
	let newWidgets = [];
	let len = 0;
	for(let wid of this.widgetCache) {
		let sample: Widget = {...wid};
		if(len >= this.gridSize) {
			len = 0;
		}

		if(len+wid.cols <= this.gridSize) {
			sample.x = len;
			len += wid.cols;
		}
		newWidgets.push(sample);
	}
	this.widgets = this.widgetCache =  newWidgets;
  }

  onItemChange(item: any) {
	let widget = this.widgetCache.filter((e)=>(e.id!=item.id));
	this.widgetCache = [...widget, {...item}];
  }

  addWidget(item: any): void {

		let widget: Widget = {
			id: uuidv4(),
			dashboard_id: this.selectedDashboardId,
			name: item.widgetName,
			account: item.account,
			tags: item.tags,
			date_range: item.date_range,
			cost_type: item.cost_type,
			cols: 2,
			rows: 1,
			minItemCols: 2,
			y: 0,
			x: 0
		}

		this.widgets = this.widgetCache = [widget, ...this.widgetCache]
  }

  deleteWidget(id: string) {

	let widgets = this.widgetCache.filter((e): any => {
		return e.id !== id;
	});

	this.widgets = this.widgetCache = widgets;
  }

  updateWidget(item: any): void {

		let widgets = this.widgetCache.filter((e): any=>{
			return e.id !== item.id;
		});

		this.widgets = this.widgetCache = [...widgets, item];
	}
}
