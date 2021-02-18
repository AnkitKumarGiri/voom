import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import {
  mediaDevices,
  RTCView
} from 'react-native-webrtc';

import { connect } from 'react-redux';
import { joinRoom } from './src/store/actions/videoActions';


class App extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    let isFront = true;
    mediaDevices.enumerateDevices().then(sourceInfos => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 640,
          height: 480,
          frameRate: 30,
          facingMode: (isFront ? "user" : "environment"),
          deviceId: videoSourceId
        }
      })
        .then(stream => {
          this.props.joinRoom(stream);
        })
        .catch(error => {
          // Log error
        });
    });
  }

  render() {
    const { streams } = this.props.video
    console.log(streams)

    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', padding: 10 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            height: 90 * 0.5,
            borderColor: 'yellow',
            borderWidth: 4,
          }}>
          {this.props.video.myStream ? (
            <RTCView streamURL={this.props.video.myStream.toURL()}
              style={{ width: 180, height: 180 }}
            />
          ) : null}
        </View>
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <ScrollView horizontal style={{ padding: 10 }}>
            <>
              {streams.length > 0 ?
                <>
                  {streams.map((stream, index) => (
                    <View
                      key={index}
                      style={{
                        width: 200,
                        backgroundColor: 'red',
                        borderWidth: 1,
                        borderColor: '#fff',
                        marginRight: 10,
                        padding: 5,
                      }}
                    >
                      <RTCView streamURL={stream.toURL()}
                        style={{ width: 180, height: 180 }}
                      />

                    </View>
                  ))}
                </> : null}
            </>

            <>
              <View
                style={{
                  width: 280,
                  backgroundColor: 'blue',
                  borderWidth: 1,
                  borderColor: '#fff',
                  marginRight: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>

              </View>
            </>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ video }) => ({
  video,
})

export default connect(mapStateToProps, { joinRoom })(App);
