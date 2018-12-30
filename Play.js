import React, { Component } from "react";
import { DeviceEventEmitter } from "react-native";
import {
  Text,
  ScrollView,
  TouchableHighlight,
  Image,
  BackHandler,
  BackAndroid,
  ToastAndroid
} from "react-native";
import Tts from "react-native-tts";
var Sound = require("react-native-sound");
import RNExitApp from "react-native-exit-app";
class Play extends Component {
  componentDidMount() {
    //the back button is masked and the home button is pressed the app is terminated
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    DeviceEventEmitter.addListener("ON_HOME_BUTTON_PRESSED", () => {
      console.log("You tapped the home button!");
      Tts.stop();
      RNExitApp.exitApp();
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    return true;
  }
  componentWillMount() {
    //the instructions for the page is given here
    Tts.speak(
      "Tap the screen to play or pause and press and hold the screen to go back"
    );
    Sound.setCategory("Playback");
  }
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.navigation.state.params.url,
      rewindpos: false
    };
    //the song to be played is loaded based on the selected option from the previous page
    song = new Sound(this.state.url, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
    });
  }
  pressed = () => {
    //when button is pressed the if any instructions that is being said currently is stopped
    Tts.stop();
    if (this.state.rewindpos) {
      //if the button is pressed then if the all the play is already completed then rewinded
      song.play();
      this.setState({ rewindpos: false });
    } else {
      //is the current state is playing then the song is paused and state is updated
      if (this.state.pause === "playing") {
        song.pause();
        this.setState({ pause: "paused" });
      } else {
        //is then song is set to play and state is updated
        song.play(success => {
          if (success) {
            //if completed then tell the user the song has been ended
            Tts.speak(
              "sucessfully completed the audio, now tap the screen to play again"
            );
            this.setState({ rewindpos: true });
          }
        });
        this.setState({ pause: "playing" });
      }
    }
  };
  long = () => {
    //when long pressed the app takes the user one step back screen
    Tts.stop();
    song.pause();
    this.props.navigation.state.params.onGoBack();
    this.props.navigation.goBack();
  };
  render() {
    return (
      <TouchableHighlight
        onPress={this.pressed}
        onLongPress={this.long}
        style={{ flex: 1 }}
      >
        <Image source={require("./vision.png")} />
      </TouchableHighlight>
    );
  }
}
export default Play;
