angular.module('ats')
.directive('inputItem',['DataService','$http', '$compile','$window','$timeout', 
  function( DataService, $http, $compile, $window, $timeout){
    return {
      restrict: 'E',
      
      templateUrl:'/admin/modules/editor/templates/inputItemTemplate.html',
      
      /*kepsType: OBJECT: 
      Property- displayAs: Optional, used for modifying reference types
      Property- displayType: Optional, will define field type, set to type if not provided
      Property- options: Optional, array of id/value that matches the reference type
      Property- name: Not Optional, will be used as label if no displayAs
      Property- type: Not Optional, will be field type if no displayType provided
      Property- model: Not Optional, value or false if not a reference field*/

      scope:{
        kepsType:"=",
        kepsModel:"=",
        kepsName:"=",
        kepsFramework:"="
      },

      link: function(scope,element,attrs){
        console.log(scope.kepsName);
        scope.data = {};
        if (scope.kepsModel) {
          if (scope.kepsType.type && scope.kepsType.type === 'image') {
            scope.data.value = scope.kepsModel;
          } else if (scope.kepsType.type && scope.kepsType.type === 'file') {
            scope.data.value = scope.kepsModel;
          } else if (scope.kepsType.type && scope.kepsType.type === 'datetime') {
            //changing date ms number to display as date/time fields
            scope.data.date = new Date(scope.kepsModel);
            scope.data.time = new Date(scope.kepsModel);
          } else {
            scope.data.value = scope.kepsModel;            
          }
        }

        scope.$watch('data.value', function(newVal) {
          if (typeof newVal !== 'undefined') {
            scope.kepsModel = newVal; 
          }
        });

        scope.typeError = false;
        /*### TYPE: array stuff ### */
        if(scope.kepsType.constructor === Array){
          var size = 0;
          for (var i in scope.kepsType[0]) {
            size++;
          }
          //this should hold an array of objects or single data types
          if(typeof scope.data.value === 'undefined' || scope.data.value.length < 1){
            //add clone of object
            scope.data.value = [];

          }
          var appendHTML = "<div style='width:95%;margin-left:auto;margin-right:auto;display:block;'>";
          scope.addArrayItem = function(){
            if(typeof scope.data.value === 'undefined' || scope.data.value.length < 1){
              //add clone of object
              scope.data.value = [];
            }
            if(size === 1){
              scope.data.value.push('');
            } else {
              scope.data.value.push({});
            }
          }
          scope.removeArrayItem = function(index){
            scope.data.value.splice(index,1);
          }

          if(size === 1){
            appendHTML += "<ul class='collection'><li class='collection-item' style='text-align:right;'>";
            appendHTML += "<a href='' ng-click='addArrayItem()' class='btn-floating green' title='add item' style='text-align:center;font-size:24px;'>+</a></li>"
            appendHTML += "<li class='collection-item' ng-repeat='obj in data.value track by $index'>"
            appendHTML += "<a  href='' ng-click='removeArrayItem($index)' class='btn-floating red' style='text-align:center;float:right;font-size:24px;' title='remove item' >-</a>"
            appendHTML += "<div style='margin-top:10px;'><span class='input-group-addon' id='counter'>{{$index}}</span>"
            appendHTML += "<input type='text' style='height:30px;' class='form-control' aria-describedby='counter' ng-model='data.value[$index]'></div>"
            appendHTML += "</li></ul>"
            element.append(appendHTML);
            $compile(element.contents())(scope);
          }else{
            scope.data.showArray = {};
            appendHTML += "<ul class='collection'><li class='collection-item' style='text-align:right;'><a href='' ng-click='addArrayItem()' class='btn-floating green' title='add item' style='font-size:24px;text-align:center;'>+</a>" 
            appendHTML += "</li><li class='collection-item' ng-repeat='obj in data.value track by $index'>";
            appendHTML += "<a href='' style='color:inherit;' ng-click='data.showArray[$index] = !data.showArray[$index]'>";
            appendHTML += "{{$index}} {{data.showArray[$index] ? 'Hide Contents' : 'Show Contents'}}</a><a href='' ng-click='removeArrayItem($index)' title='remove item' class='btn-floating red' style='font-size:24px;text-align:center;float:right;'>-</a>"
            appendHTML += "<div ng-show='data.showArray[$index]'><form><keps-form keps-name='kepsName+\".\"' keps-data='kepsType[0]' keps-model='data.value[$index]'></keps-form></form></div></li></ul></div>";
            element.append(appendHTML);
            $compile(element.contents())(scope);
          }
        } else if(typeof scope.kepsType.type === 'undefined' && typeof scope.kepsType === 'object'){
          var appendHTML = "<div style='width:95%;margin-left:auto;margin-right:auto;display:block;'>";
          appendHTML += "<form><keps-form keps-name='kepsName+\".\"' keps-data='kepsType' keps-model='data.value'></keps-form></form>";
          element.append(appendHTML);
          $compile(element.contents())(scope);
        } else if(typeof scope.kepsType.type !== 'undefined' && scope.kepsType.type.indexOf(':') > -1){
          DataService.getQuery('admin/rest/' + scope.kepsType.type.slice(1) +'s', {})
          .then(function(data){
            scope.data.options = data;
          });

          scope.setReferenceData = function(){
            for(var x in scope.data.options){
              if(scope.data.options[x].value === scope.data.value){
                scope.kepsModel = scope.data.options[x].id;
              }
            }
          };
        } else if (typeof scope.kepsType.type !== 'undefined') {

          //constants
          var itemTypes=["html","url","geopoint","email","datetime",
                  "image","file","string","number","buffer","boolean","enum","multi",
                  "address","phone"];

          //resolve type of field
          if(typeof scope.kepsType.type !== 'undefined'){
            scope.kepsType.type = scope.kepsType.type.toLowerCase();
          }


          if(itemTypes.indexOf(scope.kepsType.type) === -1){
            scope.typeError = true;
            scope.kepsType.type = "string";
          }
          if (scope.kepsType.type === 'image') {
            //already have a canvas for array objects with multiple images :(
            scope.kepsType.randomCanvasId = Math.random().toString()
    
            if(typeof scope.kepsModel === 'object'){
              if(scope.kepsModel.absoluteFilePath !== 'undefined'){
                var img = new Image();
                img.src = scope.kepsModel.filePath;
                img.onload = function(){
                  scope.drawToCanvas(img, scope.data.randomCanvasId(scope.data.randomCanvasId.length));
                }
              }
            }
          } else if(scope.kepsType.type === 'datetime'){
            /*### TYPE: DATETIME STUFF ###*/
            //blur function to combine date/time strings to ms number
            scope.makeTime = function(){
              if(scope.data.time && scope.data.date){
                scope.kepsModel = 
                 new Date(scope.data.date.toString().slice(0,15) + scope.data.time.toString().slice(15)).getTime();
                 scope.validation()

              }
            }

          } else if(scope.kepsType.type === 'multi'){
              scope.data.value = [];
          }else{

          }
        }

        /*### TYPE: IMAGE STUFF ###*/
        scope.imageFileChanged = function(evt){
          var formdata = new FormData();

          var filetype;
          var ctx;  

          if(evt.target.files[0].name.includes('.jpg')){
            filetype ="image/jpg";
          }else if(evt.target.files[0].name.includes('.png')){
            filetype = "image/png";
          }else{
            alert('image filetype not recognized')
          }
          
          //draw image preview
            var img = new Image;
            img.src = URL.createObjectURL(evt.target.files[0]);
            img.onload = function() {
              var valid = scope.validation(evt.target.files[0]);
              if(valid){
                scope.drawToCanvas(img);
                
                formdata.append('file', evt.target.files[0]);
                formdata.append('data', evt.target.files[0]);
                //formdata.append('filename', evt.target.files[0].name);
                //formdata.append('size', evt.target.files[0].size);
                var request = new XMLHttpRequest();
                request.onreadystatechange = function(){
                  if(request.readyState === 4){
                    scope.kepsModel = JSON.parse(request.responseText);
                    scope.$apply();
                  }
                }
                request.open('POST', '/admin/upload/image', true);
                request.send(formdata);
              }
            }

        }
        scope.getImageUrl = function(){
          if(scope.data.imageUrl.match(/(\S+\.[^/\s]+(\/\S+|\/|))/g)){
            
            var width = document.createAttribute('width');
            var height = document.createAttribute('height'); 
            var canvas = document.getElementById('previewCanvas');
            var filetype;
            var ctx;  
            
            var img = new Image();
            img.src = scope.data.imageUrl;
            img.onload = function(){
              //send url to backend, get image data
              var formdata = new FormData();
              formdata.append('url', scope.data.imageUrl);
              var request = new XMLHttpRequest();
              request.onreadystatechange = function(){
                if(request.readyState === 4){
                  scope.kepsModel = JSON.parse(request.responseText);
                  scope.$apply();
                }
              }
              request.open('POST', '/admin/upload/image', true);
              request.send(formdata);
            
              scope.drawToCanvas(img);
            };            
          }
        }

        scope.drawToCanvas = function(img, canvasId){
          var width = document.createAttribute('width');
          var height = document.createAttribute('height'); 
          var canvas = document.getElementById(canvasId || scope.kepsType.randomCanvasId);
          var ctx;
          //scale images reasonably
            if(img.width > img.height){ 
              width.value =  (img.width > 300)  ? 300 : img.width;
              height.value = (img.width > 300)  ? img.height/img.width * 300 : img.height;
            }else if(img.height > img.width){
              height.value = (img.height > 300) ? 300 : img.height;
              width.value =  (img.height > 300) ? img.width/img.height * 300 : img.width;
          }

          canvas.setAttributeNode(width);
          canvas.setAttributeNode(height);
          ctx = canvas.getContext('2d');
          ctx.drawImage(img,0,0,width.value,height.value);
          ctx.fillStyle = "black";
          ctx.font = "bold 16px serif";
          ctx.fillText(img.height + ' X ' + img.width, width.value * 0.5, height.value - 5);
        };

        /*### TYPE: FILE stuff ###*/
        scope.fileChanged = function(evt){
          var formdata = new FormData();
          formdata.append('file', evt.target.files[0]);
          if(scope.validation(evt.target.files[0])){
            var request = new XMLHttpRequest();
            request.onreadystatechange = function(){
              if(request.readyState === 4){
                console.log(request.responseText);
                scope.kepsModel = JSON.parse(request.responseText);
                scope.$apply();
              }
            }
            request.open('POST', '/admin/upload/file', true);
            request.send(formdata);
          }
        };


        /*###TYPE: GEOPOINT stuff ###*/
        var firstMapRun = true;
        var map;
        var marker;
        scope.testLatLng = function(){
          if(scope.kepsModel){
            //normalize lat/lng for google map max/min
            if(scope.kepsModel.lat && scope.kepsModel.lng){
              
              if(scope.kepsModel.lat < -85){ scope.kepsModel.lat = -85}
              else if(scope.kepsModel.lat > 85){scope.kepsModel.lat = 85};

              if(scope.kepsModel.lng < -180){scope.kepsModel.lng = -180}
              else if(scope.kepsModel.lng > 180){scope.kepsModel.lng = 180}; 

            }
            if(scope.kepsModel.lat && scope.kepsModel.lng && firstMapRun){
              $window.initMap = function(){
                var latLng = new google.maps.LatLng(scope.kepsModel.lat, scope.kepsModel.lng);
                  map = new google.maps.Map(document.getElementById('map'),
                  {
                    center:latLng,
                    zoom:6
                  });
                  marker = new google.maps.Marker(
                  {
                    position: latLng,
                    map: map,
                  });
                firstMapRun = false;
              }
              if(typeof(google) === 'undefined'){
                var s = document.createElement('script');
                s.src = "https://maps.googleapis.com/maps/api/js?callback=initMap"
                document.body.appendChild(s);
              }else{
                initMap();
              }

            }else{
              if(scope.kepsModel.lat && scope.kepsModel.lng){
                var latLng = new google.maps.LatLng(scope.kepsModel.lat, scope.kepsModel.lng);
                marker.setMap(null)
                marker = new google.maps.Marker({
                  position:latLng,
                  map:map
                })
                map.setCenter(marker.getPosition());
              }
            }
          }

        }

        /*###TYPE email stuff ###*/
        scope.testEmail = function(){
          if(scope.kepsModel === undefined) scope.kepsModel = '';
          if(scope.kepsModel.match(/.+@.+\..+/)){
            scope.data.emailCorrect = true;
          }else{
            scope.data.emailCorrect = false;
          }
        }

        
        /*### TYPE address stuff ###*/
        var timeoutPromise;
        scope.checkAddress = function(evt){

          if(scope.data.address1 && scope.data.city && scope.data.state){
            if(scope.data.address1.length > 3 && scope.data.city.length > 2 && scope.data.state.length > 0){
              if(timeoutPromise){
                $timeout.cancel(timeoutPromise)
              }

              timeoutPromise = $timeout(function(){
                $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + scope.data.address1 + ',+' + scope.data.city + ',+' + scope.data.state)
                  .then(function(mapInfo){

                    if(mapInfo.status === 200){
                      var addressInfo = mapInfo.data.results[0].address_components;
                      for(var x in addressInfo){
                        if(addressInfo[x].types[0] === 'postal_code'){
                          scope.data.zip = addressInfo[x].long_name;
                          if(scope.kepsFramework === 'materialize') document.getElementById('zipLabel').className = "active";
                        } else if(addressInfo[x].types[0] === 'country'){
                          scope.data.country = addressInfo[x].long_name;
                          if(scope.kepsFramework === 'materialize') document.getElementById('countryLabel').className = "active";
                        }
                      }
                      $window.initMapAddress = function(){
                        var latLng = new google.maps.LatLng( mapInfo.data.results[0].geometry.location.lat,
                                                             mapInfo.data.results[0].geometry.location.lng);

                        var addressMap = new google.maps.Map(document.getElementById('addressMap'),
                          {
                            center:latLng,
                            zoom:8
                          });
                        var marker = new google.maps.Marker(
                          {
                            position: latLng,
                            map: addressMap,
                          });
                      }
                      if(typeof(google) === 'undefined'){
                        var s = document.createElement('script');
                        s.src = "https://maps.googleapis.com/maps/api/js?callback=initMapAddress"
                        document.body.appendChild(s);
                      }else{
                        initMapAddress();
                      }
                    }
                  })
              }, 1000);

            }
          }
        }

        /*####TYPE: multi stuff####*/
        scope.checkMulti = function(option){
          var index = scope.kepsModel.indexOf(option);
          if(index > -1){
            console.log('removin', option)
            scope.kepsModel.splice(index,1);
          }else{
            scope.kepsModel.push(option);
          }
        }


        /*### VALIDATION stuff ###*/
        scope.validation = function(file){
          //standard types
          if(scope.kepsModel){
            scope.showValidationError = false;
            scope.kepsType.errorMsg = scope.kepsType.msgPrefix || '';
            switch(scope.kepsType.type){
              case('string'):
                stringValidation();
                break;
              case('number'):
                numberValidation();
                break;
              case('datetime'):
                dateValidation();
                break;
              case('image'):
                imageValidation();
                break;
              case('geopoint'):
                geoValidation();
                break;
              case('multi'):
                multiValidation();
                break;
            }
            //check arr special condition
            if(scope.kepsType.constructor === Array){
              arrayValidation();
            }
          }
          //special consideration for file
          if(file){
              scope.kepsType.errorMsg = scope.kepsType.msgPrefix || '';
              scope.showValidationError = false;
              return fileValidation(file);
          }
        }

        var stringValidation = function(){
          var validatorArr;
          if(scope.kepsType.hasOwnProperty('minlength')){
            if(scope.kepsModel.length < scope.kepsType.minLength){
              scope.kepsType.errorMsg += ' needs to be at least ' + scope.kepsType.minlength + ' characters.';
              scope.showValidationError = true;
            }
          }
          if(scope.kepsType.hasOwnProperty('maxlength')){
            if(scope.kepsModel.length > scope.kepsType.maxlength){
              scope.kepsType.errorMsg += ' exceeds max character length ' + scope.kepsType.maxlength;
              scope.showValidationError = true;
            }
          }
          if(scope.kepsType.hasOwnProperty('illegal')){
            validatorArr = scope.kepsType.illegal.split(',');
            for(var i=0;i<validatorArr.length;i++){
              if(scope.kepsModel.indexOf(validatorArr[i]) > -1){
                scope.kepsType.errorMsg += ' contains illegal character ' + validatorArr[i] + '.';
                scope.showValidationError = true;
              }
            }
          }
          if(scope.kepsType.hasOwnProperty('enum')){
            validatorArr = scope.kepsType.enum.split(',');
            for(var i=0;i<validatorArr.length;i++){
              if(scope.kepsModel.indexOf(validatorArr[i]) === -1){
                scope.kepsType.errorMsg += ' must contain ' + validatorArr[i] + '.';
                scope.showValidationError = true;
              }
            }
          }
          if(scope.kepsType.hasOwnProperty('match')){
            var regex = new RegExp(scope.kepsType.match);
            if(new RegExp(scope.kepsType.match).test(scope.kepsModel)){
            }else{
              scope.kepsType.errorMsg += ' does not match pattern ' + scope.kepsType.match;
              scope.showValidationError = true;
            }
          }
        }

        var numberValidation = function(){
          if(scope.kepsType.hasOwnProperty('max')){
            if(scope.kepsModel > scope.kepsType.max){
              scope.kepsType.errorMsg += ' cannot be greater than ' + scope.kepsType.max;
              scope.showValidationError = true;
            }
          }
          if(scope.kepsType.hasOwnProperty('min')){
            if(scope.kepsModel < scope.kepsType.min){
              scope.kepsType.errorMsg += ' cannot be less than ' + scope.kepsType.min;
              scope.showValidationError = true;
            }
          }
        }

        var fileValidation = function(file){
          var validated = true;
          if(scope.kepsType.hasOwnProperty('filetype')){
            if(file.type !== scope.kepsType.filetype){
              scope.kepsType.errorMsg += ' Incorrect filetype:' + file.type + ' , must be of type ' + scope.kepsType.filetype ;
              scope.showValidationError = true;
              validated = false;
            }
          }
          if(scope.kepsType.hasOwnProperty('maxsize')){
            if(file.size > scope.kepsType.maxsize){
              scope.kepsType.errorMsg += '. File size too large, max size ' + scope.kepsType.maxsize;
              scope.showValidationError = true;
              validated = false;
            }
          }
          scope.$apply();
          return validated;
        }

        var dateValidation = function(){
          if(scope.kepsType.hasOwnProperty('min')){
            if(scope.kepsModel < new Date(scope.kepsType.min).getTime()){
              scope.kepsType.errorMsg += '. Minimum date: ' + scope.kepsType.min;
              scope.showValidationError = true;
            }
          }
          if(scope.kepsType.hasOwnProperty('max')){
            if(scope.kepsModel > new Date(scope.kepsType.max).getTime()){
              scope.kepsType.errorMsg += '.  Max date: ' + scope.kepsType.max;
              scope.showValidationError = true;
            }
          }
        }

        var geoValidation = function(){
          console.log(scope.kepsModel);
          if(scope.kepsModel.lat && scope.kepsModel.lng){
            if(scope.kepsType.hasOwnProperty('minlng')){
              if(scope.kepsModel.lng < scope.kepsType.minlng){
                scope.kepsType.errorMsg += '.  Minimum lng: ' + scope.kepsType.minlng;
                scope.showValidationError = true;
              }
            }
            if(scope.kepsType.hasOwnProperty('maxlng')){
              if(scope.kepsModel.lng > scope.kepsType.maxlng){
                scope.kepsType.errorMsg += '.  Max lng: ' + scope.kepsType.maxlng;
                scope.showValidationError = true;
              }
            }
            if(scope.kepsType.hasOwnProperty('minlat')){
              if(scope.kepsModel.lat < scope.kepsType.minlat){
                scope.kepsType.errorMsg += '.  Minimum lat: ' + scope.kepsType.minlat;
                scope.showValidationError = true;
              }
            }
            if(scope.kepsType.hasOwnProperty('maxlat')){
              if(scope.kepsModel.lat > scope.kepsType.maxlat){
                scope.kepsType.errorMsg += '.  Max lat: ' + scope.kepsType.maxlat;
                scope.showValidationError = true;
              }
            }
          }
        }

        var multiValidation = function(){
          if(scope.kepsType.hasOwnProperty('maxselected')){
            if(scope.kepsModel.length > scope.kepsType.maxselected){
              scope.kepsType.errorMsg += ' Max Selections: ' + scope.kepsType.maxselected;
              scope.showValidationError = true;
            }
          }
        }

      }
    };
  }]);