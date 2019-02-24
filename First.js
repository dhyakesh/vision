import React, { Component } from "react";
import {
  ScrollView,
  Image,
  TouchableHighlight,
  BackAndroid,
  BackHandler,
  ToastAndroid
} from "react-native";
import { DeviceEventEmitter } from "react-native";
import Tts from "react-native-tts";
import RNExitApp from "react-native-exit-app";
class First extends Component {
  constructor(props) {
    super(props);
  }
  //back button is masked and home button function is defined here
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    DeviceEventEmitter.addListener("ON_HOME_BUTTON_PRESSED", () => {
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
  //instructions are given which will be executed when before mounting
  componentWillMount() {
    Tts.setDefaultRate(0.4);
    Tts.speak(
      "Greeting welcome to vision app ,instruction in here you will use voice command , single tap , double tap and long press on screen"
    );
    Tts.speak(
      "single tap  the to input voice command , double tap the screen to hear the current menu again , press and hold to go back to previous screen"
    );
    Tts.speak("Now tap the screen to go to home page");
  }
  render() {
    return (
      <TouchableHighlight
        onPress={() => {
          Tts.stop();
          this.props.navigation.push("Home");
        }}
        onLongPress={() => {
          Tts.stop();
          Tts.speak("thanks for using the app , happy learning");
          BackAndroid.exitApp();
        }}
        style={{ flex: 1 }}
      >
        <Image
          source={require("./visionf.png")}
          style={{
            flex: 1,
            width: null,
            height: null,
            resizeMode: "contain"
          }}
        />
      </TouchableHighlight>
    );
  }
}

export default First;
