import { View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MapScreen({ address }: { address: string }) {
  const encoded = encodeURIComponent(address);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
          }
          iframe {
            border: 0;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <iframe
          src="https://www.google.com/maps?q=${encoded}&output=embed"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1, borderRadius: 20, overflow: 'hidden' }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ height: 200 }}
      />
    </View>
  );
}
