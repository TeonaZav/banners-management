import {
  BannersActions,
  SET_BANNERS,
  ADD_BANNER,
  UPDATE_BANNER,
  REMOVE_BANNER,
  FILTER_BANNERS,
} from './banner.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromApp from '../app.reducer';

export interface BannersState {
  availableBanners: any[];
  sortDirection: string;
  sortKey: string;
}
export interface State extends fromApp.State {
  banner: BannersState;
}

const initialState: BannersState = {
  availableBanners: [],
  sortDirection: '',
  sortKey: '',
};

export function bannerReducer(state = initialState, action: BannersActions) {
  switch (action.type) {
    case SET_BANNERS:
      return {
        ...state,
        availableBanners: [...action.payload],
      };
    case ADD_BANNER:
      return {
        ...state,
        availableBanners: [...state.availableBanners, action.payload],
      };
    case UPDATE_BANNER:
      const updatedBanners = {
        ...state.availableBanners.filter(
          (banner) => banner.id !== action.payload.id
        ),
        ...action.payload.newBanner,
      };
      // const updatedBanners = [...state.availableBanners];
      // updatedBanners[action.payload.id] = updatedBanner;
      return {
        ...state,
        updatedBanners,
      };
    case REMOVE_BANNER:
      return {
        ...state,
        availableBanners: state.availableBanners.filter(
          (banner) => banner.id !== action.payload
        ),
      };
    case FILTER_BANNERS:
      return {
        ...state,
        availableBanners: state.availableBanners.filter(
          (banner) => banner.id !== action.payload
        ),
      };

    default:
      return state;
  }
}

export const getBannerState = createFeatureSelector<BannersState>('banners');

export const getAvailableBanners = createSelector(
  getBannerState,
  (state: BannersState) => state.availableBanners
);
