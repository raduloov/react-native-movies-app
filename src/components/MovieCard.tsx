import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { apiActions } from '../store/apiSlice';
import { FavMovieProps } from '../types/types';

interface MovieCardProps {
  movieId: number;
  title: string;
  imageUrl: string | null;
  voteAverage: number;
  voteCount: number;
  onShowMovieDetails: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movieId,
  title,
  imageUrl,
  voteAverage,
  voteCount,
  onShowMovieDetails
}) => {
  const dispatch = useDispatch();

  const { favorites } = useSelector((state: RootStateOrAny) => state.api);
  const isFavorite = !!favorites.find(
    (movie: FavMovieProps) => movie.movieId === movieId
  );

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onShowMovieDetails}
      onLongPress={() =>
        Alert.alert(title, '', [
          {
            text: `${isFavorite ? 'Remove from' : 'Add to'} favorites`,
            onPress: () => {
              if (!isFavorite) {
                const movieData = {
                  movieId,
                  title,
                  imageUrl,
                  voteAverage,
                  voteCount
                };
                dispatch(apiActions.addFavorite(movieData));
                Alert.alert(title, 'Added to Favorites');
              } else {
                dispatch(apiActions.removeFromFavorites(movieId));
                Alert.alert(title, 'Removed from Favorites');
              }
            }
          },
          {
            text: 'View Details',
            onPress: onShowMovieDetails
          },
          {
            text: 'Cancel',
            style: 'destructive'
          }
        ])
      }
    >
      <Card style={styles.container}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${imageUrl}`
          }}
          style={{ height: 300 }}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} />
          <Text style={{ marginLeft: 5 }}>
            {voteAverage} ({voteCount})
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 175,
    margin: 10,
    flex: 1
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5
  },
  title: {
    fontSize: 16,
    color: '#000'
  },
  ratingContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5
  }
});

export default MovieCard;
