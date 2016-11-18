var hue         = require("node-hue-api"),
    async       = require('async'),
    dash_button = require('node-dash-button'),
    HueApi      = hue.HueApi,
    lightState  = hue.lightState;

var host     = "192.168.0.14",
    username = "lklRF3zi-CtOPIsA-0NqNglarpDRmR0Ow6x6AgRN",
    api      = new HueApi(host, username),
    offDash  = dash_button("18:1e:78:d4:5f:94"),
    onDash   = dash_button("18:1e:78:d4:5f:11");

// 1) Trouver l'ip du hub hue avec : https://www.meethue.com/api/nupnp
// 2) Aller sur <ip hub>/debug/clip.html
// 3) créer un user pour l'appli, en appuyant sur le bouton hub, puis POST sur /api avec contenu: {"devicetype":"my_hue_app#iphone peter"}
// 4) dans la reponse récupérer le username pour service clé ici

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
      console.log('On éteins toutes les lumiéres!');
  }
}

//when press detected, turns off all the lights
offDash.on("detected", function (){
  api.lights().then(turnOffAllLight).done();
});

onDash.on("detected", function (){
  var state = lightState.create().on();
  api.setLightState(4, state, function(result){
    console.log("Allumer le salon");
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
