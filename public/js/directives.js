'use strict';

/* Directives */

// angular.module('myApp.directives', []).
//   directive('appVersion', ['version', function(version) {
//     return function(scope, elm, attrs) {
//       elm.text(version);
//     };
//   }]);

angular.module('chatApp.directives',[])
  .directive('formatMsg', function(){
    return {
      restrict: 'E',
      // default template
      template: '{{msg}}',
      scope: {
        msg: '=msg'
      },
      link: function(scope, element, attrs){

        // console.log('msg',scope.msg);

        // try to extract an image
        var imgUrl = scope.msg.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]).(?:jpg|gif|png)/gi);

        console.log('imgUrl', imgUrl);

        // if we found one, replace content with message
        if (imgUrl) {
          element.replaceWith('<img src="' + imgUrl[0] + '">');
        }
      }
    };
  });
