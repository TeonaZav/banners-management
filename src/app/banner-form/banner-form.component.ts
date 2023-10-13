import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

import { Banner } from '../banner.model';
import { BannerService } from '../banner.service';
import { FloatLabelType } from '@angular/material/form-field';

interface Channel {
  id: string;
  typeId: string;
  key: string;
  name: string;
}
interface Language {
  id: string;
  key: string;
  name: string;
  sortIndex: number;
  system: boolean;
  typeId: string;
}
interface Zone {
  id: string;
  typeId: string;
  key: string;
  name: string;
  sortIndex: number;
}
interface Label {
  id: string;
  typeId: string;
  key: string;
  name: string;
}

@Component({
  selector: 'app-banner-form',
  templateUrl: './banner-form.component.html',
  styleUrls: ['./banner-form.component.css'],
})
export class BannerFormComponent implements OnInit {
  minDate: Date = new Date();

  floatLabelControl = new FormControl('yes' as FloatLabelType);
  options = this.formBuilder.group({
    floatLabel: this.floatLabelControl,
  });

  bannerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private bannerService: BannerService
  ) {}
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || ('true' as FloatLabelType);
  }

  channels: Channel[] = [
    {
      id: '16000001',
      typeId: '1600',
      key: 'internet-bank',
      name: 'Internet Bank',
    },
    {
      id: '16000002',
      typeId: '1600',
      key: 'mobile-bank-ios',
      name: 'Mobile Bank IOS',
    },
    {
      id: '16000003',
      typeId: '1600',
      key: 'mobile-bank-android',
      name: 'Mobile Bank Android',
    },
  ];
  languages: Language[] = [
    {
      id: '29000001',
      key: 'ka',
      name: 'KA',
      sortIndex: 0,
      system: false,
      typeId: '2900',
    },
  ];
  zones: Zone[] = [
    {
      id: '17000001',
      typeId: '1700',
      key: 'dashboard-main',
      name: 'Dashboard Main',
      sortIndex: 0,
    },
    {
      id: '17000002',
      typeId: '1700',
      key: 'dashboard-right',
      name: 'Dashboard Right',
      sortIndex: 0,
    },
    {
      id: '17000003',
      typeId: '1700',
      key: 'dashboard-right-new',
      name: 'Dashboard Right New',
      sortIndex: 0,
    },
  ];

  labels: Label[] = [
    { id: '19000001', typeId: '1900', key: 'affluent', name: 'Affluent' },

    { id: '19000002', typeId: '1900', key: 'insider', name: 'Insider' },

    { id: '19000003', typeId: '1900', key: 'payroll', name: 'Payroll' },

    { id: '19000004', typeId: '1900', key: 'vip', name: 'VIP' },

    { id: '19000005', typeId: '1900', key: 'social', name: 'Social' },

    {
      id: '19000006',
      typeId: '1900',
      key: 'non-resident',
      name: 'Non Resident',
    },

    { id: '84839630', typeId: '1900', key: 'staff', name: 'Staff' },
  ];

  ngOnInit(): void {
    this.bannerForm = this.formBuilder.group({
      id: [],
      name: ['', Validators.required],
      uploadingImg: ['', Validators.required],
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
  uploadingImgUrl = null;
  onselectFile(e) {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.uploadingImgUrl = event.target.result;
      };
    }
  }
  onCreatePost(postData: Banner) {
    console.log(postData);
  }
}
