(function () {

'use strict';

/**
 * Non Ionic drawer
 * v. 0.2
 */
angular.module('bootstrap.drawer', [])

    .controller('drawerCtrl', ['$element', '$attrs', function ($element, $attr) {
        var el = $element[0];

        var SIDE_LEFT = 'left';
        var SIDE_RIGHT = 'right';
        var STATE_CLOSE = 'close';
        var STATE_OPEN = 'open';

        var side = $attr.side === SIDE_LEFT ? SIDE_LEFT : SIDE_RIGHT;

        // Current State of Drawer
        var drawerState = STATE_CLOSE;

        // Drawer overlay
        var $overlay = angular.element('<div class="drawer-overlay" />');
        var overlayEl = $overlay[0];
        var overlayState = STATE_CLOSE;

        $element.parent().prepend(overlayEl);

        var toggleOverlay = function (state) {
            if (overlayState !== state) {
                window.requestAnimationFrame(function () {
                    var translateX = state === STATE_CLOSE ? '-100' : '0';
                    overlayEl.style[window.CSS.TRANSFORM] = 'translate3d(' + translateX + '%, 0, 0)';
                });
                overlayState = state;
            }
        };

        var enableAnimation = function () {
            $element.addClass('animate');
            $overlay.addClass('animate');
        };

        var isOpen = function () {
            return drawerState === STATE_OPEN;
        };

        this.close = function () {
            drawerState = STATE_CLOSE;
            enableAnimation();
            toggleOverlay(STATE_CLOSE);

            window.requestAnimationFrame(function () {
                overlayEl.style.opacity = 0;
                el.style[window.CSS.TRANSFORM] = 'translate3d(' + (side === SIDE_LEFT ? '-' : '') + '100%, 0, 0)';
            });
        };

        this.open = function () {
            drawerState = STATE_OPEN;
            enableAnimation();
            toggleOverlay(STATE_OPEN);
            window.requestAnimationFrame(function () {
                overlayEl.style.opacity = 1;
                el.style[window.CSS.TRANSFORM] = 'translate3d(0, 0, 0)';
            });
        };

        this.isOpen = isOpen;
        $overlay.on('click', this.close);
    }])

    .directive('drawer', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            controller: 'drawerCtrl',
            link: function ($scope, $element, $attr, ctrl) {
                $element.addClass($attr.side);

                $rootScope.openDrawer = function () {
                    ctrl.open();
                };

                $rootScope.closeDrawer = function () {
                    ctrl.close();
                };

                $rootScope.toggleDrawer = function () {
                    if (ctrl.isOpen()) {
                        ctrl.close();
                    } else {
                        ctrl.open();
                    }
                };

                // PIERO: chiude drawer ad ogni cambio di state
                $rootScope.$on('$stateChangeStart',
                    function (event, toState, toParams, fromState, fromParams) {
                        ctrl.close();
                    });

            }
        }
    }]);

})();


// The requestAnimationFrame polyfill
// Put it on window just to preserve its context
// without having to use .call
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 16);
            };
})();
  
  
window.CSS = {};
(function () {

    // transform
    var i, keys = ['webkitTransform', 'transform', '-webkit-transform', 'webkit-transform',
        '-moz-transform', 'moz-transform', 'MozTransform', 'mozTransform', 'msTransform'];

    for (i = 0; i < keys.length; i++) {
        if (document.documentElement.style[keys[i]] !== undefined) {
            window.CSS.TRANSFORM = keys[i];
            break;
        }
    }
})();
