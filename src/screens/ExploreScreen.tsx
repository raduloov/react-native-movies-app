import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { baseUrl, key } from '../api/themoviesdb';
import { ExploreStackNavProps } from '../types/ExploreParamList';
import { ScrollView } from 'react-native-gesture-handler';
import { Searchbar } from 'react-native-paper';
import MovieCard from '../components/MovieCard';
import CategoryItem from '../components/CategoryItem';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { auth, db } from '../firebase/firebase-config';
import { apiActions } from '../store/apiSlice';

interface MovieProps {
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string | null;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

const ExploreScreen = ({ navigation }: ExploreStackNavProps<'Explore'>) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [favorites, setFavorites] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Popular');
  const [loading, setLoading] = useState<boolean>(true);

  const { currentUser } = auth;

  const dispatch = useDispatch();

  useEffect(() => {
    const getFavorites = async () => {
      if (currentUser) {
        const favsRef = doc(db, 'users', currentUser?.uid);
        const favsSnap = (await getDoc(favsRef)).data();
        const favs = favsSnap?.favorites;
        console.log(favs);

        setFavorites(favs);
        dispatch(apiActions.setFavorites(favs));
      }
    };

    getFavorites();
  }, []);

  const getMovies = useCallback(
    async (category: string, searchTerm?: string) => {
      setLoading(true);

      let url: string;
      if (!searchTerm) {
        url = `${baseUrl}/movie/${category}${key}`;
      } else {
        url = `${baseUrl}/search/movie${key}&query=${searchTerm}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();

        setMovies(data.results);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw error;
      }
    },
    [baseUrl, key]
  );

  useEffect(() => {
    getMovies('popular');
  }, [getMovies]);

  const searchHandler = async (searchTerm: string) => {
    setSearchTerm(searchTerm);
    getMovies('', searchTerm);
  };

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <View>
          <Searchbar
            placeholder="Search"
            onChangeText={text => {
              searchHandler(text);
            }}
            value={searchTerm}
          />
        </View>
        <ScrollView horizontal>
          <CategoryItem
            name="Now Playing"
            pickCategory={() => {
              getMovies('now_playing');
              setSelectedCategory('Now Playing');
            }}
          />
          <CategoryItem
            name="Popular"
            pickCategory={() => {
              getMovies('popular');
              setSelectedCategory('Popular');
            }}
          />
          <CategoryItem
            name="Top Rated"
            pickCategory={() => {
              getMovies('top_rated');
              setSelectedCategory('Top Rated');
            }}
          />
          <CategoryItem
            name="Upcoming"
            pickCategory={() => {
              getMovies('upcoming');
              setSelectedCategory('Upcoming');
            }}
          />
        </ScrollView>
        <Text
          style={{
            marginTop: 20,
            fontSize: 30,
            fontWeight: 'bold',
            color: '#000'
          }}
        >
          {selectedCategory}
        </Text>
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {!movies && (
        <View style={[styles.moviesContainer, { marginHorizontal: 20 }]}>
          <FontAwesomeIcon
            name="heart-broken"
            size={60}
            color="red"
            style={{ marginBottom: 20 }}
          />
          <Text style={{ fontSize: 20, color: '#000' }}>Nothing to show.</Text>
          <Text
            style={{
              marginTop: 20,
              fontSize: 16,
              color: '#000',
              textAlign: 'center'
            }}
          >
            Select a category or type something in the search bar.
          </Text>
        </View>
      )}
      {!loading && (
        <FlatList
          nestedScrollEnabled
          data={movies}
          renderItem={({ item }) => (
            <MovieCard
              onShowMovieDetails={() => {
                navigation.navigate('Details', {
                  movieId: item.id
                });
              }}
              title={item.title}
              imageUrl={item.poster_path}
              voteAverage={item.vote_average}
              voteCount={item.vote_count}
            />
          )}
          numColumns={2}
          ListFooterComponent={<></>}
          ListFooterComponentStyle={{ height: 200 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 20,
    marginHorizontal: 10
  },
  moviesContainer: {
    marginTop: 50,
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  loadingContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ExploreScreen;
