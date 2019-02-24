const firebase = require("firebase");
//the config for the firebase
var config = {
  apiKey: "AIzaSyDO6tNkGcSGQVunHyNeEo-GAJDeNFoU2Vc",
  authDomain: "vision-43124.firebaseapp.com",
  databaseURL: "https://vision-43124.firebaseio.com",
  projectId: "vision-43124",
  storageBucket: "vision-43124.appspot.com",
  messagingSenderId: "519317610341"
};
const app = firebase.initializeApp(config);
const data=(str)=>{
    this.app
    .database()
    .ref(str)
    .once("value", snapshot => {
      return(snapshotToArray(snapshot))
    })
}
const  wtitedata=(str,Aname,Bname,reason,url)=>{
    this.app.database().ref("reports/").push({str,Aname,Bname,reason,url})
  }
class Fire {
    app = firebase.initializeApp(config);
     data=(str)=>{
        this.app
        .database()
        .ref(str)
        .once("value", snapshot => {
          return( snapshotToArray(snapshot))
        })
    }
    wtitedata=(str,Aname,Bname,reason,url)=>{
        this.app.database().ref("reports/").push({str,Aname,Bname,reason,url})
      }
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
//initialize the firebase
export default {data,wtitedata,app};