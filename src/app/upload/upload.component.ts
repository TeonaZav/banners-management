import { Component, OnInit, Input, SimpleChange } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subscription, Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { HttpEventType } from '@angular/common/http';
import { ApiService } from '../api.service';
import * as fromAppReducer from '../app.reducer';
import * as UI from '../store/ui.actions';

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

  minDate: Date = new Date();
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

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private store: Store<fromAppReducer.State>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(select(fromAppReducer.getIsLoading));
  }

  ngOnChanges(changes: SimpleChange) {
    console.log(changes);
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
        this.store.dispatch(new UI.StopLoading());
      });
    });
  }
}
