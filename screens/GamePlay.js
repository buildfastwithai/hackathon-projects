import React from 'react';
import { WebView } from 'react-native-webview';

const WebPage = ({route}) => {
    const link=route.params?.link;
  return (
    <WebView
      source={{ uri: link }}
      style={{ flex: 1 }}
    />
  );
};

export default WebPage;
