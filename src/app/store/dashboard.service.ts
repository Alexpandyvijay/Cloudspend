import { Injectable } from '@angular/core';
import { Dashboard, DashboardListState, DashboardStore, Widget } from './dashboard.store';
import { Query } from '@datorama/akita';
import { CompactType, DisplayGrid, GridsterConfig, GridsterItem, GridType } from 'angular-gridster2';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class DashboardService extends Query<DashboardListState> {

	public options: GridsterConfig = {
		gridType: GridType.ScrollVertical,
		compactType: CompactType.CompactUp,
		margin: 10,
		outerMargin: true,
		outerMarginTop: null,
		outerMarginRight: null,
		outerMarginBottom: null,
		outerMarginLeft: null,
		useTransformPositioning: false,
		mobileBreakpoint: 500,
		mobileModeEnabled: true,
		minRows: 1,
		maxRows: 100,
		maxItemCols: 100,
		minItemCols: 1,
		maxItemRows: 100,
		minItemRows: 1,
		maxItemArea: 500,
		minItemArea: 1,
		defaultItemCols: 1,
		defaultItemRows: 1,
		fixedColWidth: 105,
		fixedRowHeight: 105,
		keepFixedHeightInMobile: false,
		keepFixedWidthInMobile: false,
		scrollSensitivity: 10,
		scrollSpeed: 20,
		enableEmptyCellClick: false,
		enableEmptyCellContextMenu: false,
		enableEmptyCellDrop: false,
		enableEmptyCellDrag: false,
		emptyCellDragMaxCols: 50,
		emptyCellDragMaxRows: 50,
		ignoreMarginInRow: false,
		swap: false,
		pushItems: true,
		disablePushOnDrag: false,
		disablePushOnResize: false,
		pushDirections: { north: true, east: true, south: true, west: true },
		pushResizeItems: true,
		displayGrid: DisplayGrid.None,
		disableWindowResize: false,
		disableWarnings: false,
		scrollToNewItems: false
	};

	constructor(public dashboardStore: DashboardStore) {
		super(dashboardStore);
	}

	getDashboardById(id: string | null): Dashboard | undefined {

		for(let dash of this.getValue().list) {
			if(dash.id === id){
				return dash;
			}
		}
		return undefined;
	}

	deleteDashboard(id: string): void {

		let dashlist = this.getValue().list;
		dashlist = dashlist.filter((e): any=>{
			if(id != e.id) {
				return e
			}
		});
		this.dashboardStore.update({list: dashlist});
	}

	addDashboard(): any {

		let newDashboard: Dashboard = {
			id: uuidv4(),
			name: '',
			description: '',
			gridSize: 8,
			widgets: []
		}
		
		let dashlist = this.getValue().list;
		dashlist = [...dashlist, newDashboard];

		this.dashboardStore.update({list: dashlist});

		return newDashboard.id;
	}

	updateDashboard(id: string, name: any, des: any, gridSize: number): void {

		let dashlist = this.getValue().list;
		let dashboard = dashlist.find((e) => {
			return id == e.id;
		});

		if(dashboard !== undefined) {

			let copydashboard: Dashboard = {
				id: dashboard.id,
				description: des,
				name: name,
				gridSize: gridSize,
				widgets: dashboard.widgets
			}

			dashlist = dashlist.filter((e): any => {
				if(e.id !== id) {
					return e;
				}
			});

			dashlist = [...dashlist, copydashboard];

			this.dashboardStore.update({list: dashlist});
		}

	}

	updateWidget(dashboardId: string, item: any): void {

		let dashlist = this.getValue().list;
		let dashboard = dashlist.find((e) => {
			return dashboardId == e.id;
		});

		if(dashboard !== undefined) {

			let widget: any;

			if(Array.isArray(item)) {
				widget = [...item];
			} else{
				widget = dashboard.widgets.filter((e): any=>{
					return e.id !== item.id;
				});
	
				widget = [...widget, item];
			}

			let copydashboard: Dashboard = {
				id: dashboard?.id,
				description: dashboard?.description,
				name: dashboard?.name,
				gridSize: dashboard?.gridSize,
				widgets: widget
			}

			dashlist = dashlist.filter((e): any => {
				if(e.id !== dashboardId) {
					return e;
				}
			});

			dashlist = [...dashlist, copydashboard];

			this.dashboardStore.update({list: dashlist});
		}
	}

	extractData(dashboard: any): any {
		let res = [];
		for(let wid of dashboard.widgets) {
			res.push({...wid});
		}
		return res;
	}
}

