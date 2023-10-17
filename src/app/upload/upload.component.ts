import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FloatLabelType } from '@angular/material/form-field';
import { HttpEventType } from '@angular/common/http';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-upload-component',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  @Input() uploadedImg = '';

  isDragover = false;
  invalidImage = false;
  uploadingImgUrl = null;
  fileName = '';
  uploadedFileId = null;

  file: File | null = null;

  uploadProgress: number;
  uploadSub: Subscription;

  minDate: Date = new Date();
  showAlert = false;
  alertMsg = 'Image is being uploaded...';
  alertColor = 'blue';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;

  bannerForm!: FormGroup;

  floatLabelControl = new FormControl('yes' as FloatLabelType);
  options = this.formBuilder.group({
    floatLabel: this.floatLabelControl,
  });

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChange) {
    console.log(changes);
  }

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
        console.log(event);
      }
      this.apiService.getImage(this.uploadedFileId).subscribe((data) => {
        console.log(data);
        let reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = (event: any) => {
          let imgPath = event.target.result;
          console.log(imgPath);
          this.uploadedImg = imgPath;
        };
      });
    });
  }
}
