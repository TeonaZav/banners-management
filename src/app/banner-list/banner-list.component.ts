import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Banner } from '../banner.model';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.css'],
})
export class BannerListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true })
  isLoading = false;
  paginator!: MatPaginator;
  displaydColumns = [
    'id',
    'url',
    'name',
    'active',
    'zoneId',
    'startDate',
    'endDate',
    'labels',
  ];

  dataSource = new MatTableDataSource<Banner>();
  bannersChanged = new Subject<any[]>();

  constructor() {}

  async ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
