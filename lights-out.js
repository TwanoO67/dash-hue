var config = require("./config");

console.log(config.hue.hub_ip);

//Les pré-requis
var hue         = require("node-hue-api"),
    async       = require('async'),
    dash_button = require('node-dash-button'),
    HueApi      = hue.HueApi,
    lightState  = hue.lightState;
var api      = new HueApi(config.hue.hub_ip, config.hue.username);

//lister tous les dash à ecouter
var dash = dash_button(config.dash.listen, null, config.dash.timeout, "all");

/* Display Helper */
var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};
var displayError = function(err) {
    console.log(err);
};

/* Turn off all lights in a list. */

var turnOffAllLight = function(result){

  //turn them off.
  var state = lightState.create().off();

  //setup queue
  var q = async.queue(function (light, callback) {
      api.setLightState(light.id, state, callback);
  }, 3);

  //add to queue
  result.lights.forEach(function(light){
      //je ne selectionne que les lampes
      if(
        light.type === "Dimmable light"
        || light.type === "Color light"
        || light.type === "Extended color light"
      ){
        q.push(light);
      }
  });

  //drain queue
  q.drain = function() {
      console.log('Toutes les lumiéres ont été éteintes!');
  }
}

dash.on("detected", function (dash_id){
    if (dash_id === config.dash.buttons.signal){
        console.log("Bouton d'extinction detecté");
        api.lights().then(turnOffAllLight).done();
        pusher.note(sony, "Dash Button", "Signal a été cliqué!", function(error, response) {
          // response is the JSON response from the API
        });

    } else if (dash_id === "2e:3f:20:33:54:22"){
        console.log("un autre bouton");
        var state = lightState.create().on();
        api.setLightState(4, state, function(result){
          console.log("Allumer le salon");
        });
    }
    else{
      console.log("un autre truc");
    }
});

console.log("DASH BUTTON - Mode écoute: ")
console.log('PushBullet: Token '+config.pushbullet.apikey)

//COnfiguration de pushbullet
var PushBullet = require('pushbullet');
var pusher = new PushBullet(config.pushbullet.apikey);
var sony = "";
pusher.devices(function(error, response) {
    console.log(error);
    if(typeof response !== "undefined")
    response.devices.forEach(function(data,index){
      if(data.nickname === config.pushbullet.device_nickname){
        console.log("PushBullet associé au "+config.pushbullet.device_nickname);
        sony = data.iden;
      }
    });
});


/*//Detecter toutes les lampes
api.lights().then(displayResult).done();

//au debut j'allume le salon pour tester
var state = lightState.create().on();
api.setLightState(4, state)
.then(displayResult)
.fail(displayError)
.done();*/
