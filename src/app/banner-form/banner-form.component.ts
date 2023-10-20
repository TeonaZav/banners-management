import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Subscription, Subject, Observable } from 'rxjs';
import { Banner } from '../models/banner.model';
import { FloatLabelType } from '@angular/material/form-field';
import { ApiService } from '../api.service';
import { UploadComponent } from '../upload/upload.component';
import * as fromAppReducer from '../app.reducer';
import * as UI from '../store/ui.actions';
import * as BannersActions from '../store/banner.actions';

import * as fromBannersReducer from '../app.reducer';

interface Type {
  id: string;
  typeId: string;
  key: string;
  name: string;
  sortIndex: number;
  system: boolean;
}

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css'],
})
export class BannerFormComponent implements OnInit, OnDestroy {
  @ViewChild(UploadComponent) uploadComponenRef: UploadComponent;
  @ViewChild('f', { static: false }) form: NgForm;
  closeDrawer = false;

  formOpen = false;
  path = '';

  subscription: Subscription;
  editMode = false;
  editedItemId: string;
  editedItem: any;

  channels: Type[] = [];
  languages: Type[] = [];
  zones: Type[] = [];
  labels: Type[] = [];
  minDate: Date = new Date();
  defaultStartDate: Date = new Date();
  defaultEndDate: Date = new Date();

  floatLabelControl = new FormControl('yes' as FloatLabelType);
  options = this.formBuilder.group({
    floatLabel: this.floatLabelControl,
  });
  isLoading$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private store: Store<fromBannersReducer.State>
  ) {}

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || ('true' as FloatLabelType);
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(select(fromAppReducer.getIsLoading));
    this.getTypesData();
    this.fillFormForEdit();
  }
  ngAfterInit() {
    this.apiService.startEditing.unsubscribe();
  }
  ngOnDestroy(): void {
    this.apiService.startEditing.unsubscribe();
  }

  onSaveBanner(postData: Banner) {
    console.log(postData);

    this.apiService.saveBanner(postData).subscribe({
      next: (data) => {
        const newDataDis = {
          ...data.data,
          imgPath: this.uploadComponenRef.uploadedImg,
        };
        if (this.editMode) {
          this.store.dispatch(
            new BannersActions.UpdateBanner({
              id: newDataDis.id,
              newBanner: newDataDis,
            })
          );
        } else {
          this.store.dispatch(new BannersActions.AddBanner(newDataDis));
        }
        this.editMode = false;
        this.store.dispatch(new UI.StopLoading());
      },
      error: (err) => {
        console.log(err);
        this.editMode = false;
        this.store.dispatch(new UI.StopLoading());
      },
    });
  }

  onCancel() {
    this.form.reset();
    this.form.form.patchValue({
      active: true,
      startDate: new Date(),
      endDate: new Date(),
      fileId: this.uploadComponenRef?.uploadedFileId,
      labels: [],
    });
    if (this.editMode) {
      this.editMode = false;
      this.path = '';
      this.formOpen = false;
    }
  }

  onClearLabels() {
    this.form.form.patchValue({
      labels: [],
    });
  }

  checkDates(f: NgForm) {
    let form = f.form;
    if (!form.value.startDate || !form.value.endDate) {
      return "Values can't be empty!";
    } else if (form.value.endDate < form.value.startDate) {
      return 'Invalid date range!';
    }

    return null;
  }

  getTypesData() {
    this.apiService.getTypes().subscribe({
      next: (data) => {
        const { entities: alltypes } = data.data;
        console.log(alltypes);
        this.channels = alltypes.filter((el: Type) => el.typeId === '1600');
        this.zones = alltypes.filter((el: Type) => el.typeId === '1700');
        this.labels = alltypes.filter((el: Type) => el.typeId === '1900');
        this.languages = alltypes.filter((el: Type) => el.typeId === '2900');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  fillFormForEdit() {
    this.apiService.startEditing.subscribe((obj) => {
      console.log(obj);
      this.editMode = true;
      this.formOpen = true;

      this.editedItemId = obj.id;
      this.path = obj.imgPath;
      if (obj?.id) {
        this.apiService.getOneBanner(obj.id).subscribe({
          next: (data) => {
            this.editedItem = data.data;
            console.log(data.data);
            const {
              id,
              name,
              fileId,
              channelId,
              active,
              startDate,
              endDate,
              labels,
              language,
              url,
              priority,
              zoneId,
            } = data.data;
            this.form.setValue({
              id: id,
              name: name,
              fileId: fileId,
              channelId: channelId,
              active: active,
              startDate: startDate,
              endDate: endDate,
              labels: labels,
              language: language,
              url: url,
              priority: priority,
              zoneId: zoneId,
            });
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
  }
}
