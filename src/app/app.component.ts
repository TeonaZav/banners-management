import {
  Component,
  ViewChild,
  ChangeDetectorRef,
  SimpleChange,
} from '@angular/core';
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

  constructor(private cdref: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChange) {
    console.log(changes);
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
}
