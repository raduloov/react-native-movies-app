import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteMovieCard from '../components/FavoriteMovieCard';
import { FavoritesStackNavProps } from '../types/FavoritesParamList';

const FavoritesScreen = ({ navigation }: FavoritesStackNavProps<'Favorites'>) => {
  const { favorites } = useSelector((state: any) => state.api);

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          marginTop: 20,
          fontSize: 30,
          fontWeight: 'bold',
          color: '#000'
        }}
      >
        Favourites
      </Text>
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <FavoriteMovieCard
            onShowMovieDetails={() => {
              navigation.navigate('Details', {
                movieId: item.movieId
              });
            }}
            movieId={item.movieId}
            title={item.title}
            imageUrl={item.imageUrl}
            voteAverage={item.voteAverage}
            voteCount={item.voteCount}
          />
        )}
        ListFooterComponent={<></>}
        ListFooterComponentStyle={{ height: 100 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10
  }
});

export default FavoritesScreen;
