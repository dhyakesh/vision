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
import RNExitApp from "react-native-exit-app";
import Tts from "react-native-tts";
import Voice from "react-native-voice";
class Storybooks extends Component {
  constructor() {
    super();
    //the speech results are bind which is declared below
    Voice.onSpeechResults = this.onSpeechResults;
  }
  componentDidMount() {
    //handle backpress and home button press is defined here
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
  //the available books is got from firebase (database) and the available options spoken out to users
  componentWillMount() {
    this.props.navigation.state.params.app
      .database()
      .ref("books/story")
      .once("value", snapshot => {
        this.setState({ books: this.snapshotToArray(snapshot) });
      })
      .then(this.onGoBack);
  }
  //when back after navigating the this function gets executed
  onGoBack = () => {
    Tts.setDefaultRate(0.4);
    Tts.speak("story books ,the available books are ");
    for (x in this.state.books) {
      Tts.speak(this.state.books[x].name);
    }
    Tts.speak(
      "tap the screen and select a book or to goback to previous menu long press"
    );
  };
  state = {
    name: " hai",
    books: [],
    results: [],
    select: "nothing"
  };
  //double tap method is implemented
  lastTap = null;
  handleDoubleTap = () => {
    const now = new Date().getTime();
    const DOUBLE_PRESS_DELAY = 700;
    x = this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY;
    if (x) {
      //if double tapped then repeat the instructions
      Voice.cancel();
      Tts.setDefaultRate(0.4);
      Tts.speak("story books ,the available books are ");
      for (x in this.state.books) {
        Tts.speak(this.state.books[x].name);
      }
      Tts.speak(
        "tap the screen and select a book or to goback to previous menu long press"
      );
    } else {
      //else voice command is accepted
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
  onSpeechResults = e => {
    console.log("onSpeechResults: ", e);
    this.setState({
      results: e.value
    });
    //if the commmands matches then navigation takes place else user is intimated with speak again
    var aa = 0;
    for (x in e.value) {
      for (cmd in this.state.books) {
        if (
          e.value[x].toUpperCase() === this.state.books[cmd].name.toUpperCase()
        ) {
          Tts.speak(
            "the selected menu is " +
              this.state.books[cmd].name +
              " navigating to the selected menu"
          );
          aa = 1;
          this.setState({ select: this.state.books[cmd].url });
          this.props.navigation.navigate("play", {
            url: this.state.books[cmd].url,
            onGoBack: this.onGoBack
          });
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
          this.props.navigation.push("Home");
        }}
        style={{ flex: 1 }}
      >
        <Image source={require("./vision.png")} />
      </TouchableHighlight>
    );
  }
  snapshotToArray = snapshot => {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      item.key = childSnapshot.key;

      returnArr.push(item);
    });

    return returnArr;
  };
}
export default Storybooks;
