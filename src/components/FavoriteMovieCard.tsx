import { updateDoc, doc } from 'firebase/firestore';
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Alert
} from 'react-native';
import { Button } from 'react-native-paper';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { auth, db } from '../firebase/firebase-config';
import { apiActions } from '../store/apiSlice';
import { FavMovieProps } from '../types/types';
import Swipeable from 'react-native-gesture-handler/Swipeable';

interface FavoriteMovieCardProps {
  movieId: number;
  title: string;
  imageUrl: string;
  voteAverage: number;
  voteCount: number;
  onShowMovieDetails: () => void;
}

const RightActions = (progress: any, dragX: any) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  return (
    <View style={styles.rightAction}>
      <Animated.Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#fff',
          transform: [{ scale }]
        }}
      >
        Remove
      </Animated.Text>
    </View>
  );
};

const FavoriteMovieCard = ({
  movieId,
  title,
  imageUrl,
  voteAverage,
  voteCount,
  onShowMovieDetails
}: FavoriteMovieCardProps) => {
  const { currentUser } = auth;
  const { favorites } = useSelector((state: RootStateOrAny) => state.api);
  const dispatch = useDispatch();

  const swipableRef = useRef<any>(null);

  const removeFromFavorites = async () => {
    try {
      if (currentUser) {
        await updateDoc(doc(db, 'users', currentUser?.uid), {
          favorites: favorites.filter(
            (movie: FavMovieProps) => movie.movieId !== movieId
          )
        });
        dispatch(apiActions.removeFromFavorites(movieId));
        Alert.alert(title, 'Removed from favorites.');
        swipableRef.current.close();
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <Swipeable
      ref={swipableRef}
      renderRightActions={RightActions}
      onSwipeableOpen={removeFromFavorites}
    >
      <View style={styles.container}>
        <View>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${imageUrl}` }}
            style={{
              width: 100,
              height: 150,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10
            }}
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
              <FontAwesomeIcon name="star" color="#000" /> {voteAverage} ({voteCount}
              )
            </Text>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FontAwesomeIcon name="arrow-left" />
              <Text
                style={{
                  fontSize: 18
                }}
              >
                {' '}
                Swipe to remove
              </Text>
            </View>
            <TouchableOpacity onPress={onShowMovieDetails}>
              <Button>View Details</Button>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={removeFromFavorites}>
              <Button>Remove from Favorites</Button>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#e6e6e6',
    width: '100%'
  },
  detailsContainer: {
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flex: 1
  },
  rightAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 30,
    marginVertical: 5,
    backgroundColor: 'red',
    flex: 1
  }
});

export default FavoriteMovieCard;
