import { Component, OnInit, Input, ViewChild } from '@angular/core';

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
export class BannerFormComponent implements OnInit {
  @ViewChild(UploadComponent) uploadComponenRef: UploadComponent;
  @ViewChild('f') form: NgForm;

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

  channels: Type[] = [];
  languages: Type[] = [];
  zones: Type[] = [];
  labels: Type[] = [];

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
  }
  ngAfterInit() {}
  onCreatePost(postData: Banner) {
    console.log(postData);
    console.log(this.form);
    this.apiService.createBanner(postData).subscribe(
      (responseData) => {
        console.log(responseData);
      },
      (error) => {
        console.log(error);
      }
    );
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
