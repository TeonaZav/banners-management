import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatSortModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSidenavModule,
    MatRadioModule,
    MatProgressSpinnerModule,
  ],
})
export class MaterialModule {}
