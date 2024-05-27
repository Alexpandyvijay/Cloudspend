import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { GridsterItem } from 'angular-gridster2';

export interface Widget extends GridsterItem {
  id: string;
  dashboard_id: string;
  name: string;
  account: string;
  tags: string;
  date_range: string;
  cost_type: string;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  gridSize: number;
  widgets: Widget[];
}

export interface DashboardListState {
  list: Dashboard[];
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dashboards' })
export class DashboardStore extends Store<DashboardListState> {
  constructor() {
    super({list: [
		{
			id: 'custom-dashboard1',
			name: 'custom dashboard one',
			description: 'Grister implementation check for angular project',
			gridSize: 8,
			widgets: [
				{
					id: 'alex1',
					dashboard_id: 'custom-dashboard1',
					name: 'Sample 1',
					account: 'cost-split-by-accounts',
					tags: 'sample tags',
					date_range: 'sample date',
					cost_type: 'sample cost type',
					cols: 2,
					rows: 1,
					minItemCols: 2,
					y: 0,
					x: 0
				},
				{
					id: 'alex2',
					dashboard_id: 'custom-dashboard1',
					name: 'Sample 2',
					account: 'cost-split-by-accounts',
					tags: 'sample tags',
					date_range: 'sample date',
					cost_type: 'sample cost type',
					cols: 2,
					rows: 1,
					minItemCols: 2,
					y: 2,
					x: 4
				},
				{
					id: 'alex3',
					dashboard_id: 'custom-dashboard1',
					name: 'Sample 3',
					account: 'cost-split-by-accounts',
					tags: 'sample tags',
					date_range: 'sample date',
					cost_type: 'sample cost type',
					cols: 2,
					rows: 1,
					minItemCols: 2,
					y: 1,
					x: 4
				},
				{
					id: 'alex4',
					dashboard_id: 'custom-dashboard1',
					name: 'Sample 4',
					account: 'cost-split-by-accounts',
					tags: 'sample tags',
					date_range: 'sample date',
					cost_type: 'sample cost type',
					cols: 2,
					rows: 1,
					minItemCols: 2,
					y: 0,
					x: 4
				},
				{
					id: 'alex5',
					dashboard_id: 'custom-dashboard1',
					name: 'Sample 5',
					account: 'cost-split-by-accounts',
					tags: 'sample tags',
					date_range: 'sample date',
					cost_type: 'sample cost type',
					cols: 2,
					rows: 1,
					minItemCols: 2,
					y: 2,
					x: 2
				}
			]
		}
	]});
  }
}

// {list: [
// 	{
// 		id: 'custom-dashboard1',
// 		name: 'custom dashboard one',
// 		description: 'Grister implementation check for angular project',
// 		widgets: [
// 			{
// 				id: 1,
// 				dashboard_id: 'custom-dashboard1',
// 				name: 'Sample 1',
// 				account: 'cost-split-by-accounts',
// 				tags: 'sample tags',
// 				date_range: 'sample date',
// 				cost_type: 'sample cost type',
// 				cols: 2,
// 				rows: 1,
// 				y: 0,
// 				x: 0
// 			},
// 			{
// 				id: 2,
// 				dashboard_id: 'custom-dashboard1',
// 				name: 'Sample 1',
// 				account: 'cost-split-by-accounts',
// 				tags: 'sample tags',
// 				date_range: 'sample date',
// 				cost_type: 'sample cost type',
// 				cols: 2,
// 				rows: 1,
// 				y: 2,
// 				x: 4
// 			}
// 		]
// 	}
// ]}