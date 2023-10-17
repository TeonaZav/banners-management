import {
  Component,
  OnInit,
  Input,
  Inject,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { FormControl, FormBuilder, FormGroup, NgForm } from '@angular/forms';

import { Subscription } from 'rxjs';
import { Banner } from '../banner.model';
import { FloatLabelType } from '@angular/material/form-field';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api.service';
import { UploadComponent } from '../upload/upload.component';

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

  path = '';
  channels: Type[] = [];
  languages: Type[] = [];
  zones: Type[] = [];
  labels: Type[] = [];

  subscription: Subscription;
  editMode = false;
  editedItemId: string;
  editedItem: any;

  @Input()
  uploadSub: Subscription;

  minDate: Date = new Date();
  defaultStartDate: Date = new Date();
  defaultEndDate: Date = new Date();

  floatLabelControl = new FormControl('yes' as FloatLabelType);
  options = this.formBuilder.group({
    floatLabel: this.floatLabelControl,
  });

  bannerForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {}
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || ('true' as FloatLabelType);
  }

  ngOnInit(): void {
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

    this.apiService.startEditing.subscribe((obj) => {
      console.log(obj);
      this.editMode = true;
      this.editedItemId = obj.id;
      this.path = obj.imgPath;
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
    });
  }

  ngOnDestroy(): void {
    this.apiService.startEditing.unsubscribe();
  }

  onCreatePost(postData: Banner) {
    console.log(postData);
    console.log(this.form);
    this.apiService.createBanner(postData).subscribe(
      (responseData) => {
        console.log(responseData);
        this.editMode = false;
      },
      (error) => {
        console.log(error);
        this.editMode = false;
      }
    );
  }
  onClear() {
    this.form.reset();
    this.form.form.patchValue({
      active: true,
      startDate: new Date(),
      endDate: new Date(),
      fileId: this.uploadComponenRef?.uploadedFileId,
      labels: [],
    });
    this.editMode = false;
    this.path = '';
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
}
