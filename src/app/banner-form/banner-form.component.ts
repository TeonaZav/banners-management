import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FormControl, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Banner } from '../models/banner.model';
import { FloatLabelType } from '@angular/material/form-field';
import { ApiService } from '../api.service';
import * as fromAppReducer from '../store/app.reducer';
import * as UI from '../store/ui.actions';
import * as BannersActions from '../store/banner.actions';
import * as fromBannersReducer from '../store/app.reducer';
import { HttpEventType } from '@angular/common/http';

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
  // @ViewChild(UploadComponent) uploadComponenRef: UploadComponent;
  @ViewChild('f', { static: false }) form: NgForm;
  closeDrawer = false;

  formOpen = false;

  uploadedImg = '';

  isDragover = false;
  invalidImage = false;
  uploadingImgUrl = null;
  fileName = '';
  uploadedFileId = null;

  file: File | null = null;

  uploadProgress: number;

  showAlert = false;
  alertMsg = 'Image is being uploaded...';
  alertColor = 'blue';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  isLoading$: Observable<boolean>;

  bannerForm!: FormGroup;

  floatLabelControl = new FormControl('yes' as FloatLabelType);
  options = this.formBuilder.group({
    floatLabel: this.floatLabelControl,
  });
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
    this.apiService.saveBanner(postData).subscribe({
      next: (data) => {
        const newDataDis = {
          ...data.data,
          imgPath: this.uploadedImg,
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
      },
      error: (err) => {
        console.log(err);
        this.editMode = false;
      },
    });
  }

  onCancel() {
    this.form.reset();
    this.form.form.patchValue({
      active: true,
      startDate: new Date(),
      endDate: new Date(),
      fileId: '',
      labels: [],
    });
    this.uploadingImgUrl = null;

    this.fileName = '';
    this.uploadedImg = '';
    if (this.editMode) {
      this.editMode = false;
      this.formOpen = false;
      this.uploadedImg = '';
    }
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
            this.uploadedImg = obj.imgPath;
          },
          error: (err) => {
            console.log(err);
          },
        });
      }
    });
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

  onFileSelect(e) {
    this.store.dispatch(new UI.StartLoading());
    if (e.target.files) {
      this.file = e.target.files[0];
      this.readImage(this.file);
    }
    this.store.dispatch(new UI.StopLoading());
  }

  onFileDrop($event: Event) {
    this.store.dispatch(new UI.StartLoading());
    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;

    this.readImage(this.file);
    this.store.dispatch(new UI.StopLoading());
  }

  readImage(file: File) {
    const format = file?.type.substring(0, 5);
    if (!file || format !== 'image') {
      this.invalidImage = true;
      return;
    }
    this.fileName = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event: any) => {
      this.uploadingImgUrl = event.target.result;
    };
  }

  onUpload() {
    this.showAlert = true;
    this.apiService.uploadImage(this.file).subscribe((event) => {
      console.log(event);
      this.uploadedFileId = event.data.id;
      if (event.type === HttpEventType.UploadProgress) {
        console.log(
          'upload Progress: ' +
            Math.round((event.loaded / event.total) * 100) +
            '%'
        );
        this.uploadProgress = Math.round((event.loaded / event.total) * 100);
      } else if (event.type === HttpEventType.Response) {
      }
      this.apiService.getImage(this.uploadedFileId).subscribe((data) => {
        let reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = (event: any) => {
          let imgPath = event.target.result;
          this.uploadedImg = imgPath;
        };
      });
    });
  }
}
