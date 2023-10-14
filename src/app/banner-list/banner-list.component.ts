import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Banner } from '../banner.model';
import { ApiService } from '../api.service';

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

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    this.apiService
      .getAvailableBanners()
      .pipe(
        map((responseData) => {
          this.isLoading = true;
          let newArr = [];
          let { entities } = responseData.data;
          entities.forEach((el) => {
            const { startDate, endDate } = el;

            this.apiService.getImage(el.fileId).subscribe({
              next: (data) => {
                let reader = new FileReader();
                reader.readAsDataURL(data);
                reader.onload = (event: any) => {
                  let imgPath = event.target.result;
                  newArr.push({
                    imgPath: imgPath,
                    ...el,
                    startDate: new Date(startDate).toLocaleDateString(),
                    endDate: new Date(endDate).toLocaleDateString(),
                  });
                  event.target.result;
                  console.log(newArr);
                  if (newArr.length === entities.length) {
                    console.log(newArr);
                    this.dataSource.data = newArr;
                  }
                };
              },
              error: (err) => {
                console.log(err);
              },
            });
          });

          return newArr;
        })
      )
      .subscribe({
        next: (data) => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
        },
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
