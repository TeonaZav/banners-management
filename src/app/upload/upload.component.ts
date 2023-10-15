import { Component, OnInit, Input } from '@angular/core';

import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { FloatLabelType } from '@angular/material/form-field';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-upload-component',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  @Input()
  requiredFileType: string;
  uploadingImgUrl = null;
  fileName = '';
  fileId = '';
  uploadProgress: number;
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

  isDragover = false;
  file: File | null = null;
  alertMsg = 'Image is being uploaded...';
  alertColor = 'blue';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  showAlert = false;
  invalidImage = false;
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  uploadForm = new FormGroup({ title: this.title });

  ngOnInit(): void {}
  ngAfterViewInit() {}

  onFileSelect(e) {
    if (e.target.files) {
      this.file = e.target.files[0];
      this.readImage(this.file);
    }
  }
  onFileDrop($event: Event) {
    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;

    this.readImage(this.file);
  }

  readImage(file: File) {
    if (!file || file.type !== 'image/jpeg') {
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
    this.apiService.uploadImage(this.file).subscribe((res) => {
      console.log(res);
    });
  }
}
