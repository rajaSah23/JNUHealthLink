let sharedData="";
let success="";
let error="";
let warning="";

let msgType="";
let message="";

//work in progress
function getSharedData() {
  
//   console.log(type,msg);
  return {msgType,message};
}
function setSharedData(type,msg) {
    msgType=type;
    message=msg;
    console.log(type,msg);
  }


// function setSharedData(data) {
//   sharedData = data;
// }

module.exports = {
  getSharedData,
  setSharedData,
};