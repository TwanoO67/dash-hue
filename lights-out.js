var hue         = require("node-hue-api"),
    async       = require('async'),
    dash_button = require('node-dash-button'),
    HueApi      = hue.HueApi,
    lightState  = hue.lightState;

var host     = "192.168.0.14",
    username = "lklRF3zi-CtOPIsA-0NqNglarpDRmR0Ow6x6AgRN",
    api      = new HueApi(host, username);

//temps mini entre 2 requetes (pour filter les probes arp)
var timeout = 30000;

//lister tous les dash à ecoute
var dash_signal = "18:1e:78:d4:5f:94";
var dash = dash_button([dash_signal], null, timeout, "all");
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
      console.log('Toutes les lumiéres ont été éteintes!');
  }
}

dash.on("detected", function (dash_id){
    if (dash_id === dash_signal){
        console.log("Bouton d'extinction detecté");
        api.lights().then(turnOffAllLight).done();
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

/*//Detecter toutes les lampes
api.lights().then(displayResult).done();

//au debut j'allume le salon pour tester
var state = lightState.create().on();
api.setLightState(4, state)
.then(displayResult)
.fail(displayError)
.done();*/
