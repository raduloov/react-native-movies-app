import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type ExploreParamList = {
  Explore: undefined;
  Details: {
    movieId: number;
  };
};

export type ExploreStackNavProps<T extends keyof ExploreParamList> = {
  navigation: StackNavigationProp<ExploreParamList, T>;
  route: RouteProp<ExploreParamList, T>;
};
