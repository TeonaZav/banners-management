import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'dialog-delete-component',
  template: `<h1 mat-dialog-title>{{ data.message }}</h1>

    <mat-dialog-actions align="end">
      <button mat-raised-button color="warn" [mat-dialog-close]="true">
        Delete
      </button>
      <button
        mat-raised-button
        mat-dialog-close
        [mat-dialog-close]="false"
        cdkFocusInitial
        color="primary"
      >
        Cancel
      </button>
    </mat-dialog-actions>`,
})
export class DialogDeleteComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
