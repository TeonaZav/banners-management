import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { map, switchMap, concatMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Banner } from '../models/banner.model';
import { ApiService } from '../api.service';
import * as fromAppReducer from '../app.reducer';
import * as UI from '../store/ui.actions';
import * as BannersActions from '../store/banner.actions';
import * as fromBannersReducer from '../store/banner.reducers';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrls: ['./banner-list.component.css'],
})
export class BannerListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) paginator!: MatPaginator;

  isLoading$: Observable<boolean>;

  bannersChanged = new Subject<any[]>();
  subscription: Subscription;

  displaydColumns = [
    'url',
    'name',
    'active',
    'zoneId',
    'startDate',
    'endDate',
    'labels',
    'delete',
  ];

  dataSource = new MatTableDataSource<Banner>();

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private store: Store<fromBannersReducer.State>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.pipe(select(fromAppReducer.getIsLoading));
    this.getAllBanners();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.store.dispatch(new UI.StartLoading());
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.store.dispatch(new UI.StopLoading());
  }

  getRecord(row: any) {
    if (row) {
      console.log(row);
      this.apiService.startEditing.next({ id: row.id, imgPath: row.imgPath });
    }
  }

  getAllBanners() {
    return this.apiService
      .getAvailableBanners()
      .pipe(
        map((responseData) => {
          let { entities } = responseData.data;
          console.log(responseData);
          let newArr = [];
          let counter = 0;

          for (const el of entities) {
            counter++;
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

                  if (counter === entities.length) {
                    let arr = [...newArr];
                    this.store.dispatch(new BannersActions.SetBanners(arr));
                    this.store
                      .pipe(select(fromBannersReducer.getAvailableBanners))
                      .subscribe(
                        (banners: any) => (this.dataSource.data = banners)
                      );
                  }
                };
              },
              error: (err) => {
                console.log(err);
                newArr.push({
                  ...el,
                  startDate: new Date(startDate).toLocaleDateString(),
                  endDate: new Date(endDate).toLocaleDateString(),
                });
                console.log(newArr);
                let arr = [...newArr];
                this.store.dispatch(new BannersActions.SetBanners(arr));

                this.store
                  .pipe(select(fromBannersReducer.getAvailableBanners))
                  .subscribe(
                    (banners: any) => (this.dataSource.data = banners)
                  );
              },
            });
          }
          return newArr;
        })
      )
      .subscribe({
        next: (data) => {
          this.store.dispatch(new UI.StopLoading());
        },
        error: (err) => {
          console.log(err);
          this.store.dispatch(new UI.StopLoading());
        },
      });
  }
}
