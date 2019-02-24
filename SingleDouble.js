import React, {Component} from 'react';
import {View, PanResponder, Alert} from 'react-native';
import PropTypes from 'prop-types';
var release=false;
class DoubleClicker extends Component {
  constructor() {
    super();

    this.myPanResponder = {};

    this.prevTouchInfo = {
      prevTouchX: 0,
      prevTouchY: 0,
      prevTouchTimeStamp: 0,
    };

    // number of clicks
    this.clicks = 0;

    this.handlePanResponderGrant = this.handlePanResponderGrant.bind(this);
    this.handlePanResponderRelease=this.handlePanResponderRelease.bind(this);
  }

  componentWillMount() {
    this.myPanResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderRelease:this.handlePanResponderRelease
    });
  }

  distance(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  }

  isDoubleTap(currentTouchTimeStamp, {x0, y0}) {
    const {prevTouchX, prevTouchY, prevTouchTimeStamp} = this.prevTouchInfo;
    const dt = currentTouchTimeStamp - prevTouchTimeStamp;
    const {delay, radius} = this.props;

    return dt < delay && this.distance(prevTouchX, prevTouchY, x0, y0) < radius;
  }

  handlePanResponderGrant(evt, gestureState) {
    const currentTouchTimeStamp = Date.now();

    // if (this.isDoubleTap(currentTouchTimeStamp, gestureState)) {
    //   this.props.onClick(evt, gestureState);
    // }
   
    // check for single or double click
    this.clicks++;
    if (this.clicks === 1) {
      this.single_press_timeout = setTimeout((release) => {
        if (this.clicks === 1) {  
           this.props.onClick(evt, gestureState);
        }else {
          this.props.onDoubleClick(evt, gestureState);
        }
        this.clicks = 0;
      }, this.props.delay || 300);
    }
    this.long_press_timeout = setTimeout(function(){
      if(this.clicks===1)
      clearTimeout(this.single_press_timeout);
      this.props.onLongpress(evt,gestureState);
  }, 
   200);
    this.prevTouchInfo = {
      prevTouchX: gestureState.x0,
      prevTouchY: gestureState.y0,
      prevTouchTimeStamp: currentTouchTimeStamp,
    };
  }
  handlePanResponderMove(e, gestureState) {
    clearTimeout(this.long_press_timeout);
}
handlePanResponderRelease(e, gestureState){
    clearTimeout(this.long_press_timeout);
    console.log('Touch released');
}
handlePanResponderEnd(e, gestureState) {
    clearTimeout(this.long_press_timeout);
    console.log('Finger pulled up from the image');
}
  render() {
    return (
      <View {...this.props} {...this.myPanResponder.panHandlers}>
        {this.props.children}
      </View>
    );
  }
}

DoubleClicker.defaultProps = {
  delay: 300,
  radius: 20,
  onClick: () => Alert.alert('Press me once'),
  onDoubleClick: () => Alert.alert('Double Tap Succeed'),
  onLongpress:()=>Alert.alert('long press')
};

DoubleClicker.propTypes = {
  delay: PropTypes.number,
  radius: PropTypes.number,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onLongpress:PropTypes.func
};

module.exports = DoubleClicker;