import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, IconButton } from 'react-native-paper';
import { baseUrl, key } from '../api/themoviesdb';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';

const MovieDetailsScreen = ({ route }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [movie, setMovie] = useState<any>({});

  useEffect(() => {
    const getMovie = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}/movie/${route.params.movieId}${key}`
        );
        const data = await response.json();

        console.log(data);

        setMovie(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    };

    getMovie();
  }, []);
  console.log(movie);

  return (
    <ScrollView>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View>
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
              }}
              style={{ height: 300 }}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text style={{ fontSize: 25, textAlign: 'center' }}>{movie.title}</Text>
          </View>
          <TouchableOpacity>
            <Button>
              Add to Favorites <FontAwesomeIcon name="heart" size={15} />
            </Button>
          </TouchableOpacity>
          <View style={styles.container}>
            <Text style={styles.head}>Genre</Text>
            <View style={{ flexDirection: 'row' }}>
              {movie.genres.map((movie: { id: number; name: string }) => (
                <Text>{movie.name} </Text>
              ))}
            </View>
          </View>
          <View style={styles.container}>
            <Text style={styles.head}>Overview</Text>
            <Text>{movie.overview}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 15
  },
  container: {
    marginTop: 30,
    marginHorizontal: 10
  },
  head: {
    fontSize: 20,
    marginBottom: 5
  }
});

export default MovieDetailsScreen;
