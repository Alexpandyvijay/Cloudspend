import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../store/dashboard.service';
import { Router } from '@angular/router';
import { Dashboard } from '../store/dashboard.store';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit, AfterViewInit {

  dashboards!: Array<Dashboard>;
  theme!: string | null;
  action: any = [
    {
      name: 'Edit',
      class: 'fa-solid fa-pen-to-square',
      action: (id: string) => {
        this.routeUrl('/add/'+id);
      }
    },
    {
      name: 'Delete',
      class: 'fa-solid fa-trash',
      action: (id: string) => {
        this.dashboardService.deleteDashboard(id);
      }
    }
  ];

  @ViewChild('modebtn') modebtn!: ElementRef;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dashboardService.select().subscribe(dash => {
      this.dashboards = dash.list;
    });
  }

  ngAfterViewInit(): void {
    this.theme = document.documentElement.getAttribute('data-theme');
    if(this.theme === 'dark') {
      this.modebtn.nativeElement.checked = true;
    }
  }

  contextAction($event: any): void{
    $event.target.parentElement.nextSibling.classList.toggle('display-context');
  }

  routeUrl(path: string){
    this.router.navigateByUrl(path);
  }

  addDashboard() {
    let id = this.dashboardService.addDashboard();
    this.routeUrl(`/add/${id}`);
  }

  setTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
  }
}
