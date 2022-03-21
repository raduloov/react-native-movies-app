import React from 'react';
import WebView from 'react-native-webview';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer = ({ videoId }: VideoPlayerProps) => {
  return (
    <WebView
      automaticallyAdjustContentInsets={false}
      mediaPlaybackRequiresUserAction={true}
      style={{
        height: 300,
        width: '100%',
        alignSelf: 'center',
        alignContent: 'center'
      }}
      source={{ uri: `https://www.youtube.com/embed/${videoId}?rel=0` }}
    />
  );
};

export default VideoPlayer;
