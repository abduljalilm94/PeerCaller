(function () {
    angular.module('starter')
    .controller('CallController', ['localStorageService', '$scope', '$ionicPopup', CallController]);

    function CallController(localStorageService, $scope, $ionicPopup) {

        $scope.username = localStorageService.get('username');

        var peer = new Peer($scope.username, {
            key: '18dend7xxp5sif6r',
            config: {
                'iceServers': [
                  { url: 'stun:stun1.l.google.com:19302' },
                  { url: 'turn:numb.viagenie.ca', credential: 'xerox', username: 'abduljalilm94@gmail.com' }
                ]
            }
        });

        function getAudio(successCallback, errorCallback) {
            navigator.webkitGetUserMedia({ audio: true, video: false }, successCallback, errorCallback);

        }


        function onReceiveCall(call) {

            $ionicPopup.alert({
                title: 'Incoming Call',
                template: 'Someone is calling you. Connecting now..'
            });

            getAudio(
                function (MediaStream) {
                    call.answer(MediaStream);
                },
                function (err) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'An error occurred while try to connect to the device mic'
                    });
                }
            );

            call.on('stream', onReceiveStream);
        }


        function onReceiveStream(stream) {
            var audio = document.getElementById('contact-audio');
            audio.src = window.URL.createObjectURL(stream);
            audio.onloadedmetadata = function (e) {
                audio.play();
                $ionicPopup.alert({
                    title: 'Call Ongoing',
                    template: 'Call has started. You can speak now'
                });
            }

        }

        $scope.startCall = function () {
            var contact_username = $scope.contact_username;

            getAudio(
                function (MediaStream) {

                    var call = peer.call(contact_username, MediaStream);
                    call.on('stream', onReceiveStream);
                },
                function (err) {
                    $ionicPopup.alert({
                        title: 'Error',
                        template: 'An error occurred while try to connect to the device mic'
                    });
                }
            );

        };

        peer.on('call', onReceiveCall);



    }

})();