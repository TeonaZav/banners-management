import { Action } from '@ngrx/store';

export const SET_BANNERS = '[Banners] Set Banners';
export const ADD_BANNER = '[Banners] Add Banner';
export const UPDATE_BANNER = '[Banners] Update Banner';
export const REMOVE_BANNER = '[Banners] Remove Banner';
export const FILTER_BANNERS = '[Banners] Filter Banners';
export const SORT_BANNERS = '[Banners] Sort Banners';

export class SetBanners implements Action {
  readonly type = SET_BANNERS;

  constructor(public payload: any[]) {}
}
export class AddBanner implements Action {
  readonly type = ADD_BANNER;

  constructor(public payload: any) {}
}
export class UpdateBanner implements Action {
  readonly type = UPDATE_BANNER;

  constructor(public payload: { id: number; newBanner: any }) {}
}

export class RemoveBanner implements Action {
  readonly type = REMOVE_BANNER;

  constructor(public payload: string) {}
}

export class FilterBanner implements Action {
  readonly type = FILTER_BANNERS;

  constructor(public payload: string) {}
}

export type BannersActions =
  | SetBanners
  | AddBanner
  | UpdateBanner
  | RemoveBanner
  | FilterBanner;
