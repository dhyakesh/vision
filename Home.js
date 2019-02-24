import React, { Component } from "react";
import { DeviceEventEmitter } from "react-native";
import {
  Text,
  ScrollView,
  Image,
  TouchableHighlight,
  BackHandler,
  BackAndroid,
  ToastAndroid
} from "react-native";
import RNExitApp from "react-native-exit-app";
import Voice from "react-native-voice";
import Tts from "react-native-tts";
const firebase = require("firebase");
//the config for the firebase
var config = {
  apiKey: "AAAAAAAAAA",
  authDomain: "vAAAAAAAAAA",
  databaseURL: "AAAAAAAAAA",
  projectId: "vAAAAAAAAAA",
  storageBucket: "vAAAAAAAAAA",
  messagingSenderId: "AAAAAAAAAA1"
};
//initialize the firebase
const app = firebase.initializeApp(config);
class Home extends Component {
  state = {
    results: [],
    availablecommands: ["story", "academic"]
  };
  //the available commands are set as story and academic for working prototype
  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    DeviceEventEmitter.addListener("ON_HOME_BUTTON_PRESSED", () => {
      Tts.stop();
      RNExitApp.exitApp();
    });
  }
  // masking the physical backbutton
  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }
  handleBackButton() {
    return true;
  }
  constructor() {
    super();
    //the speech resuts function is bind
    Voice.onSpeechResults = this.onSpeechResults;
  }
  //the double tap function and single tap function
  lastTap = null;
  handleDoubleTap = () => {
    const now = new Date().getTime();
    const DOUBLE_PRESS_DELAY = 700;
    x = this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY;
    if (x) {
      Voice.cancel();
      Tts.setDefaultRate(0.4);
      Tts.speak("HOME ,the available commands are ");
      for (x in this.state.availablecommands) {
        Tts.speak(this.state.availablecommands[x]);
      }
      Tts.speak(
        "tap the screen and enter the command to go back long press the screen"
      );
    } else {
      this.lastTap = now;
      this.setState({
        results: []
      });

      try {
        Tts.stop();
        Voice.start("en-US");
      } catch (e) {
        console.error(e);
      }
    }
  };
  //instructing the user the available commands
  componentWillMount() {
    Tts.setDefaultRate(0.4);
    Tts.speak("HOME ,the available commands are ");
    for (x in this.state.availablecommands) {
      Tts.speak(this.state.availablecommands[x]);
    }
    Tts.speak(
      "tap the screen and enter the command to go back long press the screen"
    );
    Voice.destroy().then(Voice.removeAllListeners);
  }
  onSpeechResults = e => {
    console.log("onSpeechResults: ", e);
    this.setState({
      results: e.value
    });
    //is the entered command is available navigated based on that else the user is notified by to try again
    var aa = 0;
    for (x in e.value) {
      for (cmd in this.state.availablecommands) {
        if (e.value[x] === this.state.availablecommands[cmd]) {
          Tts.speak(
            "the selected menu is " +
              this.state.availablecommands[cmd] +
              " navigating to the selected menu"
          );
          str = e.value[x];
          str = str.replace(/\s/g, "");
          this.props.navigation.push(str, { app: app });
          Tts.speak("done");
          aa = 1;
        }
      }
    }
    if (aa == 0) {
      Tts.speak("sorry no such options try again");
    }
  };

  render() {
    return (
      <TouchableHighlight
        onPress={this.handleDoubleTap}
        onLongPress={() => {
          Tts.stop();
          this.props.navigation.push("First");
        }}
        style={{ flex: 1 }}
      >
        <Image
          source={require("./visionh.png")}
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

export default Home;
