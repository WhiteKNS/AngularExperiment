/**
 * Created by Natalya on 10/1/2015.
 */
(function(){
var app = angular.module("Experiment", []);


    var MainController = function ($scope, $http){
        $scope.PointsForPlayer1 =0;
        $scope.PointsForPlayer2 =0;
        // создать подключение
        var socket = new WebSocket("ws://localhost:8081");
        console.log("here");

        var Field = matrixArray();
        var X = 20, Y = 20;
        var canvas = document.getElementById('MyCanvas');
        var context = canvas.getContext('2d');
        var radius = 40;
        var setX=null, setY=null;
        for (var i = 0; i < 10; i++) {

            for (var j = 0; j < 10; j++) {
                var x = X + i * 40;
                var y = Y + j * 40;
                context.beginPath();
                context.rect(x, y, radius, radius);
                context.fillStyle = 'yellow';
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = '#F0F8FF';
                context.stroke();
            }
            Y = 20;
            X += 1;
        }

        canvas.addEventListener("mousedown", getPosition, false);
        function getPosition(event) {

            var x = parseInt((event.pageX - 490) / 41);
            var y = parseInt((event.pageY - 20) / 41);
            if (x<0||x>9||y<0||y>9) {alert("Try again! Wrong data!!!");

            }
            setX = x;
            setY = y;
            Field[y][x] = 1;
            PaintCircle1();
        }



        function matrixArray(){
            var Field = [];
            for(var i=0; i<10; i++){
                Field[i] = [];
                for(var j=0; j<10; j++){
                    Field[i][j] = 0;
                }
            }
            return Field;
        }

        function PaintCircle1() { //здесь прорисовка точек
            var X1 = 40, Y1 = 40;
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    var x1 = X1 + i * 40;
                    var y1 = Y1 + j * 40;

                    if (Field[j][i] == 1) {
                        context.beginPath();
                        context.arc(x1, y1, 20, 0, Math.PI * 2, false);
                        context.fillStyle = 'red';
                        context.fill();
                        context.lineWidth = 2;
                        context.strokeStyle = '#F0F8FF';
                        context.stroke();
                    }
                    if (Field[j][i] == 2) {
                        context.beginPath();
                        context.arc(x1, y1, 20, 0, Math.PI * 2, false);
                        context.fillStyle = 'blue';
                        context.fill();
                        context.lineWidth = 2;
                        context.strokeStyle = '#F0F8FF';
                        context.stroke();
                    }
                    if (Field[j][i] == 6 || Field[j][i] == 7) {
                        context.beginPath();
                        context.arc(x1, y1, 20, 0, Math.PI * 2, false);
                        context.fillStyle = 'black';
                        context.fill();
                        context.lineWidth = 2;
                        context.strokeStyle = '#F0F8FF';
                        context.stroke();

                    }
                }
                X1 += 1;
                Y1 = 40;
            }

        }

        var onUserComplete = function(response){
            $scope.user = response.data;
            $http.get($scope.user.PointPlayer1).then(function(response){//получаем данные PointPlayer1
                $scope.PointPlayer1 = response.data;
            });
            $http.get($scope.user.PointPlayer2).then(function(response){//получаем данные PointPlayer2
                $scope.PointPlayer2 = response.data;
            });
            $http.get($scope.user.Field).then(onField, onError);
        }

        var onField = function(response){ //получаем данные Field
            $scope.Field1 = response.data;
        }

        var onError = function(reason){
            $scope.error = "Couldn't fetch the data";
        }

        //получаем данные с сервера
        $scope.getServerInfo = function(){
          //  $http.get("ws://localhost:8081").then(onUserComplete, onError);
            socket.onmessage = function(event) {
                var incomingMessage = event.data;
                console.log(incomingMessage);
            };
        }

        $scope.Go = function(){

            var dataToPost = {
                ChoiseLines: setY,
                ChoiseColumns: setX
            };
            var str = JSON.stringify(dataToPost);
            socket.send(str);

            socket.onmessage = function(event) {
                var incomingMessage = event.data;
                console.log(incomingMessage);
                var  data =  JSON.parse(incomingMessage);
                console.log(data);
                Field = data.Field;
                //console.log(Field);
                $scope.PointsForPlayer1 = data.PointsForPlayer1;
                $scope.PointsForPlayer2 = data.PointsForPlayer2;
               // console.log(PointsForPlayer1);
                PaintCircle1();
            };

           // var dataToPost = '{"ChoiseLines": seY, "ChoiseColumns": setX}';
        /*var user = '{ "name": "Вася", "age": 35, "isAdmin": false, "friends": [0,1,2,3] }';

         $http.post("localhost:8081",dataToPost ).success(function(serverResponse, status, headers, config) {
            // Updating the $scope postresponse variable to update the view
            $scope.postresponse = serverResponse.data.ChoiseLines + " " + serverResponse.data.ChoiseColumns;
        }).error(function(serverResponse, status, headers, config) {
                alert("failure " + status);
            }
        );*/

         //   dataToPost = JSON.parse(dataToPost);

    }



}
    app.controller("MainController",["$scope", "$http", MainController]);
})();
