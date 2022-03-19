import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type FavoritesParamList = {
  Favorites: undefined;
  Details: {
    movieId: number;
  };
};

export type FavoritesStackNavProps<T extends keyof FavoritesParamList> = {
  navigation: StackNavigationProp<FavoritesParamList, T>;
  route: RouteProp<FavoritesParamList, T>;
};
