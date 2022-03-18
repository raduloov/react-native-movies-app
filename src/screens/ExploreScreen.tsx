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

const ExploreScreen = ({ navigation }: ExploreStackNavProps<'Explore'>) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [movies, setMovies] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Popular');
  const [loading, setLoading] = useState<boolean>(true);

  const getMovies = useCallback(
    async (category: string) => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/movie/${category}${key}`);
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

  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <View>
          <Searchbar
            placeholder="Search"
            onChangeText={text => setSearchTerm(text)}
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
      {!loading ? (
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
          ListFooterComponentStyle={{ height: 200 }}
          ListFooterComponent={<></>}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
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
