import { updateDoc, doc } from 'firebase/firestore';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { auth, db } from '../firebase/firebase-config';
import { apiActions } from '../store/apiSlice';

interface FavoriteMovieCardProps {
  movieId: number;
  title: string;
  imageUrl: string;
  voteAverage: number;
  voteCount: number;
  onShowMovieDetails: () => void;
}

const FavoriteMovieCard = ({
  movieId,
  title,
  imageUrl,
  voteAverage,
  voteCount,
  onShowMovieDetails
}: FavoriteMovieCardProps) => {
  const { currentUser } = auth;
  const { favorites } = useSelector((state: any) => state.api);
  const dispatch = useDispatch();

  const removeFromFavorites = async () => {
    try {
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser?.uid), {
          favorites: favorites.filter((movie: any) => movie.movieId !== movieId)
        });
        dispatch(apiActions.removeFromFavorites(movieId));
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${imageUrl}` }}
          style={{ width: 100, height: 150 }}
        />
      </View>
      <View style={styles.detailsContainer}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 5
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                fontSize: 20,
                marginBottom: 5,
                flex: 1,
                textAlign: 'center'
              }}
            >
              {title}
            </Text>
          </View>
          <Text>
            <FontAwesomeIcon name="star" color="#000" /> {voteAverage} ({voteCount})
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={onShowMovieDetails}>
            <Button>View Details</Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={removeFromFavorites}>
            <Button>Remove from Favorites</Button>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
    borderWidth: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#e6e6e6',
    width: '100%'
  },
  detailsContainer: {
    paddingHorizontal: 20,
    justifyContent: 'space-between'
  },
  buttonsContainer: {}
});

export default FavoriteMovieCard;
