import { createSlice } from '@reduxjs/toolkit';
import { FavMovieProps } from '../types/types';

interface StateProps {
  favorites: FavMovieProps[];
}

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    favorites: []
  } as StateProps,
  reducers: {
    setFavorites(state, { payload }) {
      state.favorites = payload;
    },
    addFavorite(state, { payload }) {
      if (state.favorites) {
        const existingMovie = state.favorites.find(
          (movie: FavMovieProps) => movie.movieId === payload.movieId
        );

        if (!existingMovie) {
          state.favorites = [...state.favorites, payload];
        }
      }
    },
    removeFromFavorites(state, { payload }) {
      if (state.favorites) {
        state.favorites = state.favorites.filter(
          (movie: FavMovieProps) => movie.movieId !== payload
        );
      }
    }
  }
});

export const apiActions = apiSlice.actions;

export default apiSlice;
