import React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { View, StyleSheet } from 'react-native';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer = ({ videoId }: VideoPlayerProps) => {
  return (
    <View style={styles.container}>
      <YoutubePlayer height={300} play={true} videoId={videoId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {}
});

export default VideoPlayer;
