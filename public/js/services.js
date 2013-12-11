'use strict';

/* Services */

angular.module('chatApp.services',[])

  .factory('socket', function ($rootScope) {

    // I stole this factory from
    // http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/

    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  })
  .factory('insult', function(){

    // words stolen from
    // http://everything2.com/title/random+insult+generator

    var part1 = [
      "artless",
      "bawdy",
      "beslubbering",
      "bootless",
      "churlish",
      "cockered",
      "clouted",
      "craven",
      "currish",
      "dankish",
      "dissembling",
      "droning",
      "errant",
      "fawning",
      "fobbing",
      "froward",
      "frothy",
      "gleeking",
      "goatish",
      "gorbellied",
      "impertinent",
      "infectious",
      "jarring",
      "loggerheaded",
      "lumpish",
      "mammering",
      "mangled",
      "mewling",
      "paunchy",
      "pribbling",
      "puking",
      "puny",
      "qualling",
      "rank",
      "reeky",
      "roguish",
      "ruttish",
      "saucy",
      "spleeny",
      "spongy",
      "surly",
      "tottering",
      "unmuzzled",
      "vain",
      "venomed",
      "villainous",
      "warped",
      "wayward",
      "weedy",
      "yeasty"];

    var part2 = [
      "base-court",
      "bat-fowling",
      "beefwitted",
      "beetle-headed",
      "boil-brained",
      "clapper-clawed",
      "clay-brained",
      "common-kissing",
      "crook-pated",
      "dismal-dreaming",
      "dizzy-eyed",
      "doghearted",
      "dread-bolted",
      "earth-vexing",
      "elf-skinned",
      "fat-kidneyed",
      "fen-sucked",
      "flap-mouthed",
      "fly-bitten",
      "folly-fallen",
      "fool-born",
      "full-gorged",
      "guts-griping",
      "half-faced",
      "hasty-witted",
      "hedge-born",
      "hell-hated",
      "idle-headed",
      "ill-breeding",
      "ill-nurtured",
      "knotty-pated",
      "milk-livered",
      "motley-minded",
      "onion-eyed",
      "plume-plucked",
      "pottle-deep",
      "pox-marked",
      "reeling-ripe",
      "rough-hewn",
      "rude-growing",
      "rump-fed",
      "shard-borne",
      "sheep-biting",
      "spur-galled",
      "swag-bellied",
      "tardy-gaited",
      "tickle-brained",
      "toad-spotted",
      "unchin-snouted",
      "weather-bitten"];

    var part3 = [
      "apple-john",
      "baggage",
      "barnacle",
      "bladder",
      "bear-pig",
      "bugbear",
      "bum-bailey",
      "canker-blossom",
      "clack-dish",
      "clotpole",
      "coxcomb",
      "codpiece",
      "death-token",
      "dewberry",
      "flap-dragon",
      "flax-wench",
      "flirt-gill",
      "foot licker",
      "fustilarian",
      "giglet",
      "gudgeon",
      "haggard",
      "harpy",
      "hedge-pig",
      "horn-beast",
      "hugger-mugger",
      "joithead",
      "lewdster",
      "lout",
      "maggot pie",
      "malt-worm",
      "mammet",
      "measle",
      "minnow",
      "miscreant",
      "moldwarp",
      "mumble-news",
      "nut-hook",
      "pigeon egg",
      "pignut",
      "puttock",
      "pumpion",
      "ratsbane",
      "scut",
      "skainsmate",
      "strumpet",
      "varlet",
      "vassal",
      "whey-face",
      "wagtail"];

    return function(){
      var msg = 'I am a ' + part1[Math.floor(Math.random() * part1.length)];
      msg += ' ' + part2[Math.floor(Math.random() * part1.length)];
      msg += ' ' + part3[Math.floor(Math.random() * part1.length)] + '.';

      return msg;
    };
  });
