import { createStackNavigator, createAppContainer } from "react-navigation";
import Storybooks from "./Storybooks";
import Academicbooks from "./Academicbooks";
import First from "./First";
import Home from "./Home";
import Play from "./Play";
//import Sample from "./App";
const AppNavigator = createStackNavigator(
  {
    First: {
      screen: First
    },
    Home: {
      screen: Home
    },
    story: {
      screen: Storybooks
    },
    academic: {
      screen: Academicbooks
    },
    play: {
      screen: Play
    }
  },
  { headerMode: "none" }
);
const Appcontainer = createAppContainer(AppNavigator);

export default Appcontainer;
