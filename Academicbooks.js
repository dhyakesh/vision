import React, { Component } from "react";
import {
  Text,
  ScrollView,
  TouchableHighlight,
  Image,
  BackHandler,
  BackAndroid,
  ToastAndroid
} from "react-native";
import { DeviceEventEmitter } from "react-native";
import Tts from "react-native-tts";
import Voice from "react-native-voice";
import { StackActions, NavigationActions } from "react-navigation";
import RNExitApp from "react-native-exit-app";
class Academicbooks extends Component {
  constructor() {
    super();
    Voice.onSpeechResults = this.onSpeechResults;
  }
  //the backbutton is masked and home button function is defined
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
  // the books in academic area got from firebase (database)
  componentWillMount() {
    this.props.navigation.state.params.app
      .database()
      .ref("books/academic")
      .once("value", snapshot => {
        this.setState({ books: this.snapshotToArray(snapshot) });
      })
      .then(this.onGoBack);
  }
  navigateToWalkthrough = () => {
    const navigateAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "story" })]
    });

    this.props.navigation.dispatch(navigateAction);
  };
  //the back from screen, then this will be executed
  onGoBack = () => {
    Tts.setDefaultRate(0.4);
    Tts.speak("Academic books ,the available books are ");
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
  //double tap function is defined here
  lastTap = null;
  handleDoubleTap = () => {
    const now = new Date().getTime();
    const DOUBLE_PRESS_DELAY = 700;
    x = this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY;
    if (x) {
      Voice.cancel();
      Tts.setDefaultRate(0.4);
      Tts.speak("academic books ,the available books are ");
      for (x in this.state.books) {
        Tts.speak(this.state.books[x].name);
      }
      Tts.speak(
        "tap the screen and select a book or to goback to previous menu long press"
      );
    } else {
      //single tap is used to input the voice command
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
    var aa = 0;
    //the entred command is checked with the availabe commands if present then navigated else try again is spoken
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
      <ScrollView>
        <Text>Academicbooks</Text>
        <Text>the available books are </Text>
        {this.state.books.map((book, index) => (
          <Text key={index}>{book.name}</Text>
        ))}
        <TouchableHighlight
          onPress={this.handleDoubleTap}
          onLongPress={() => {
            Tts.stop();
            this.props.navigation.push("Home");
          }}
        >
          <Image source={require("./vision.png")} />
        </TouchableHighlight>
        {this.state.results.map((result, index) => {
          return <Text key={`result-${index}`}>{result}</Text>;
        })}
      </ScrollView>
    );
  }
  //snapshot is converted to the array
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
export default Academicbooks;
