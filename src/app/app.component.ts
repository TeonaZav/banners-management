import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BannerFormComponent } from './banner-form/banner-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'banners-management-optio';
  @ViewChild(BannerFormComponent) bannerFormComponentRef: BannerFormComponent;

  bannerFormType = 'New';
  cancelEdit = false;

  constructor(private cdref: ChangeDetectorRef) {}

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  onCancel() {
    this.cancelEdit = true;
  }
}
