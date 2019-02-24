import React, { Component } from "react";
import { DeviceEventEmitter,AsyncStorage } from "react-native";
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
import Voice from "react-native-voice";
import Double from "./SingleDouble"
var voices =false;
var fini="done";
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
 componentWillMount= async()=> {
    await AsyncStorage.getItem(this.props.navigation.state.params.name).then((value) => this.setState({ 'previous': JSON.parse(value) }))
    //the instructions for the page is given here
    if(this.state.previous!==null)
    {
      Tts.speak("you previous paused this video, tap the screen and say continue to resume or rewind to rewind the audiobook")
       //the song to be played is loaded based on the selected option from the previous page
      this.setState({
        results: []
      });
      voices=true;
    }
    else
    {
      Tts.speak(
        "Tap the screen to play or pause and press and hold the screen to go back previous "
      );
    }
    this.props.navigation.state.params.app
    .database()
    .ref("books/story")
    .once("value", snapshot => {
      this.setState({ books: this.snapshotToArray(snapshot) });
    })
    //this.writedata("daa")
    Sound.setCategory("Playback");
  }
  writedata=(str)=>{
    this.props.navigation.state.params.app.database().ref("reports/"+this.props.navigation.state.params.key).set({str:this.props.navigation.state.params.str,Bname:this.props.navigation.state.params.name,Aname:this.props.navigation.state.params.aname,url:this.props.navigation.state.params.url})
  }
  constructor(props) {
    super(props);
    this.state = {
      url: this.props.navigation.state.params.url,
      rewindpos: false
    };
    song = new Sound(this.state.url, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("failed to load the sound", error);
        return;
      }
    });
    Voice.onSpeechResults = this.onSpeechResults;
  }
  lastTap = null;
  pressed = () => {
    const now = new Date().getTime();
    const DOUBLE_PRESS_DELAY = 700;
    x = this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY;
    if (x) {
      //double tapped
      Voice.cancel();
      Tts.speak("report");
      Tts.stop();
      song.pause();
      fini="not"
      this.setState({ pause: "paused" });
      Tts.speak( "report reporting")
      this.writedata("data")
    }
    else{
      this.lastTap = now;
    if(voices==true)
    {
      try {
        Voice.start("en-US");
      } catch (e) {
        console.error(e);
      }
    }
    else{
      //when button is pressed the if any instructions that is being said currently is stopped
    Tts.stop();
    if (this.state.rewindpos) {
      //if the button is pressed then if the all the play is already completed then rewinded
      song.play(success => {
        if (success) {
          //if completed then tell the user the song has been ended
          Tts.speak(
            "sucessfully completed the audio, now tap the screen to play again"
          );
          fini="done";
          this.setState({ rewindpos: true });
        }
      });
      this.setState({ pause: "playing" });
      this.setState({ rewindpos: false });
    } else {
      //is the current state is playing then the song is paused and state is updated
      if (this.state.pause === "playing") {
        song.pause();
        fini="not"
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
            fini="done";
          }
        });
        this.setState({ pause: "playing" });
      }
    }
    }
  }
  };
  long = async() => {
    //when long pressed the app takes the user one step back screen
    Tts.stop();
    song.pause();
    if(fini=="done")
    {
      await AsyncStorage.removeItem(this.props.navigation.state.params.name);
    }
    else{
      await song.getCurrentTime((seconds) =>{
        AsyncStorage.setItem(this.props.navigation.state.params.name, JSON.stringify(seconds))});
        
    }
    this.props.navigation.push("story", { app: this.props.navigation.state.params.app })
    }
    
  onSpeechResults = async(e) => {
    console.log("onSpeechResults: ", e);
    this.setState({
      results: e.value
    });
    Tts.speak("results are got")
    let test=false;
    for(x in e.value)
    {
      if(e.value[x].toUpperCase()==="CONTINUE")
      {
        song.setCurrentTime(this.state.previous);
        //await Tts.speak("resumed form were you left");
        song.play(success => {
          if (success) {
            //if completed then tell the user the song has been ended
            Tts.speak(
              "sucessfully completed the audio, now tap the screen to play again"
            );
            fini=true;
            this.setState({ rewindpos: true });
          }
        });
        this.setState({ pause: "playing" });
        voices=false;
      }
      else if(e.value[x].toUpperCase()==="REWIND")
      {
        voices=false;
        //await Tts.speak("rewinded");
        this.pressed();
      }
     
    }
    if(voices)
    {
      Tts.speak("no such options try again")
    }
  }
  continue=()=>{
    
  }
  render() {
    return (
      <TouchableHighlight
        onPress={this.pressed}
        onLongPress={this.long}
        style={{ flex: 1 }}
      >
        <Image
          source={require("./visionp.png")}
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
export default Play;
