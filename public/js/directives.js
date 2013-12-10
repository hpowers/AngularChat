'use strict';

/* Directives */

angular.module('chatApp.directives',[])
  // format a chat msg to be either text or an embedded image
  .directive('formatMsg', function(){
    return {
      restrict: 'E',
      // default template
      template: '{{msg}}',
      scope: {
        msg: '=msg'
      },
      link: function(scope, element, attrs){

        // try to extract an image
        var imgUrl = scope.msg.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]).(?:jpg|gif|png)/gi);

        // if found, replace content with message
        if (imgUrl) {
          element.replaceWith('<img src="' + imgUrl[0] + '">');
        }
        // otherwise just use the template
      }
    };
  });
