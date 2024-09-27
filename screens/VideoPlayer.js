import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
const VideoPlayer = () => {
    const route = useRoute();
    const link=route.params?.link;
  return (
    <View style={styles.container}>
      <WebView
        scalesPageToFit={true}
        bounces={false}
        javaScriptEnabled
        style={styles.webview}
        source={{
          html: `
            <!DOCTYPE html>
            <html style="height: 100%;">
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
              </head>
              <body style="margin: 0; height: 100%; display: flex; justify-content: center; align-items: center;">
                <iframe src="${link}" allowfullscreen="" loading="lazy" style="width: 100%; height: 100%; border: none;" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </body>
            </html>
          `,
        }}
        automaticallyAdjustContentInsets={false}
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    width: width,
    height: height,
  },
});

export default VideoPlayer;
