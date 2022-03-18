import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableNativeFeedback
} from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

interface MovieCardProps {
  title: string;
  imageUrl: string;
  voteAverage: number;
  voteCount: number;
  onShowMovieDetails: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  imageUrl,
  voteAverage,
  voteCount,
  onShowMovieDetails
}) => {
  return (
    <TouchableNativeFeedback onPress={onShowMovieDetails}>
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
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 175,
    margin: 10
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
