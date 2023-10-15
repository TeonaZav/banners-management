import { Component, OnInit, Input } from '@angular/core';

import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { Banner } from '../banner.model';
import { FloatLabelType } from '@angular/material/form-field';
import { ApiService } from '../api.service';

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
  @Input()
  uploadSub: Subscription;

  minDate: Date = new Date();

  floatLabelControl = new FormControl('yes' as FloatLabelType);
  options = this.formBuilder.group({
    floatLabel: this.floatLabelControl,
  });

  bannerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {}
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || ('true' as FloatLabelType);
  }

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  uploadForm = new FormGroup({ title: this.title });

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
    this.bannerForm = this.formBuilder.group({
      id: [],
      name: ['', Validators.required],
      channelId: ['', Validators.required],
      fileId: ['', Validators.required],
      language: ['', Validators.required],
      zoneId: ['', Validators.required],
      startDate: ['', { Validators: this.checkDates }, Validators.required],
      endDate: ['', { Validators: this.checkDates }],
      url: ['', Validators.required],
      active: ['', Validators.required],
      priority: ['', Validators.required],
      labels: ['', Validators.required],
    });
  }

  checkDates(group: FormGroup) {
    if (group.controls.endDate.value < group.controls.startDate.value) {
      return { notValid: true };
    }
    return null;
  }
}
