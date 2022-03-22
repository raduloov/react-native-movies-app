import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import moment from 'moment';
import VideoPlayer from '../components/VideoPlayer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { baseUrl, key } from '../api/themoviesdb';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { ExploreStackNavProps } from '../types/ExploreParamList';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase-config';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { apiActions } from '../store/apiSlice';
import { FavMovieProps, MovieInfoProps } from '../types/types';

interface VideoProps {
  id: string;
  iso_3166_1: string;
  iso_639_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

const MovieDetailsScreen = ({ route }: ExploreStackNavProps<'Details'>) => {
  const [movieInfo, setMovieInfo] = useState<MovieInfoProps>();
  const [trailer, setTrailer] = useState<string>('');
  const [playTrailer, setPlayTrailer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const { movieId } = route.params;
  const { currentUser } = auth;

  const dispatch = useDispatch();

  const { favorites } = useSelector((state: RootStateOrAny) => state.api);

  useEffect(() => {
    setIsFavorite(
      !!favorites.find((movie: FavMovieProps) => movie.movieId === movieId)
    );
  }, [favorites]);

  const formatDate = (date?: string | null) => {
    if (date) {
      const dateString = date.replace(/-/g, '');
      const formattedDate = moment(dateString, 'YYYYMMDD').format('MMM Do YYYY');
      return formattedDate;
    }
  };

  useEffect(() => {
    const getMovie = async () => {
      setLoading(true);
      try {
        const movieDetailsRes = await fetch(`${baseUrl}/movie/${movieId}${key}`);
        const movieData = await movieDetailsRes.json();

        const videosRes = await fetch(`${baseUrl}/movie/${movieId}/videos${key}`);
        const videosData = await videosRes.json();

        setMovieInfo(movieData);

        setTrailer(
          videosData.results.find(
            (video: VideoProps) =>
              video.site === 'YouTube' && video.type === 'Trailer'
          ).key
        );

        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    };

    getMovie();
  }, [trailer]);

  const addToFavorites = async () => {
    setButtonLoading(true);
    try {
      if (movieInfo) {
        const movieData = {
          movieId,
          title: movieInfo.title,
          imageUrl: movieInfo.poster_path,
          voteAverage: movieInfo.vote_average,
          voteCount: movieInfo.vote_count
        };

        if (currentUser) {
          await updateDoc(doc(db, 'users', currentUser?.uid), {
            favorites: [...favorites, movieData]
          });
          dispatch(apiActions.addFavorite(movieData));
        }
      }

      setButtonLoading(false);
    } catch (error) {
      console.log('💥', error);
      setButtonLoading(false);
      throw error;
    }
  };

  const removeFromFavorites = async () => {
    setButtonLoading(true);
    try {
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser?.uid), {
          favorites: favorites.filter(
            (movie: FavMovieProps) => movie.movieId !== movieId
          )
        });
        dispatch(apiActions.removeFromFavorites(movieId));
        setButtonLoading(false);
      }
    } catch (error) {
      setButtonLoading(false);
      console.log(error);
      throw error;
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.detailsContainer}>
            <TouchableOpacity onPress={() => setPlayTrailer(true)}>
              {!playTrailer ? (
                <>
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/w500${
                        movieInfo && movieInfo.backdrop_path
                      }`
                    }}
                    style={{ height: 300 }}
                  />
                  <View style={styles.playButton}>
                    <FontAwesomeIcon name="play-circle" color="#fff" size={60} />
                  </View>
                </>
              ) : (
                <VideoPlayer videoId={trailer} />
              )}
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <Text style={{ fontSize: 25, textAlign: 'center', color: '#000' }}>
                {movieInfo && movieInfo.title}
              </Text>
              <Text>{formatDate(movieInfo?.release_date)}</Text>
            </View>
            <View style={styles.buttonContainer}>
              {buttonLoading && <ActivityIndicator size="small" />}
              {!buttonLoading && !isFavorite && (
                <TouchableOpacity onPress={addToFavorites}>
                  <Button>
                    Add to Favorites <FontAwesomeIcon name="heart" size={15} />
                  </Button>
                </TouchableOpacity>
              )}
              {!buttonLoading && isFavorite && (
                <TouchableOpacity onPress={removeFromFavorites}>
                  <Button>
                    Remove from Favorites{' '}
                    <FontAwesomeIcon name="heart-broken" size={15} />
                  </Button>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.container}>
              <Text style={styles.head}>Genre</Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: '#000' }}>
                  {movieInfo &&
                    movieInfo.genres
                      .map((movie: { id: number; name: string }) => `${movie.name}`)
                      .join(', ')}
                </Text>
              </View>
            </View>
            <View style={styles.container}>
              <Text style={styles.head}>Overview</Text>
              <Text style={{ color: '#000' }}>
                {movieInfo && movieInfo.overview}
              </Text>
            </View>
            <View style={styles.container}>
              <Text style={styles.head}>Production</Text>
              <Text style={{ color: '#000' }}>
                <Text>
                  {movieInfo &&
                    movieInfo.production_companies
                      .map(
                        (company: {
                          id: number;
                          logo_path: string | null;
                          name: string;
                          origin_country: string;
                        }) => `${company.name}`
                      )
                      .join(', ')}
                </Text>
              </Text>
            </View>
            <View style={styles.container}>
              <Text style={styles.head}>Budget / Revenue</Text>
              <Text style={{ color: '#000' }}>
                ${movieInfo && movieInfo.budget} / ${movieInfo && movieInfo.revenue}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  },
  backgroundVideo: {
    width: '100%',
    height: '100%'
  },
  detailsContainer: {
    marginBottom: 50
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default MovieDetailsScreen;
