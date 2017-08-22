'use strict'


let app = angular.module("myTodoList", []);
app.controller("myTodoCtrl", function($scope) {
  let selectedList = -1;
  let selected = false;
  let innerLength = 0;
  let selectedInner = false;
  let valid = 0;
  let selectedListInner = 0;
    if (localStorage.getItem('myNotes')) {
        $scope.list = JSON.parse(localStorage.getItem('myNotes'))
    }
    else{
        $scope.list = []
    }

    $scope.addToList = function(index) {
      if ($scope.addValue) {
        $scope.exists = false;
          for (let i of $scope.list){
            if (i.value == $scope.addValue) {
              $scope.exists = true;
              return false;
            }
          }

          let record = {
              value:$scope.addValue,
              completed:false,
              sublist:[]
          };
          if(index >= 0){
            $scope.list[index].sublist.push(record);
            innerLength++;
          }else {
            $scope.list.push(record);
          }
          localStorage.setItem('myNotes', angular.toJson($scope.list))
          $scope.addValue = "";
      } 
    }

    $scope.addToListEnter = function(key) {
      if(selected && key.which === 13){
        $scope.addToList(selectedList);
      }
      else if (key.which === 13) {
        $scope.addToList();
      }
      else if (key.Key && (key.which == 49 || key.which == 50 || key.which == 51 || key.which == 52 || key.which == 53)) {
        event.preventDefault()
        if($scope.list[$scope.numberToIndex(key.which)]) {
          $scope.addToList($scope.numberToIndex(key.which));
        }
      }

    }

    $scope.removeItem = function(px,x,sub) {
      if (sub) {
        $scope.list[px].sublist.splice(x,1)
      } else {
        $scope.list.splice(px,1)
      }
    localStorage.setItem('myNotes', angular.toJson($scope.list))
    }

    $scope.updateItem = function(px,x, sub){
        $scope.completed = !$scope.completed
        if (sub) {
          $scope.list[px].sublist[x].completed = $scope.completed
        } else {
          $scope.list[px].completed = $scope.completed
        }
      localStorage.setItem('myNotes', angular.toJson($scope.list))
    }

    $scope.numberToIndex = function(key){
      switch (key) {
        case 49:
          return 0;
        break;
        case 50:
          return 1;
        break;
        case 51:
          return 2;
        break;
        case 52:
          return 3;
        break;
        case 53:
          return 4;
        break;
        case 54:
          return 5
        break;
        case 55:
          return 6
        break;
      }
    }

    $scope.pickTask = function(key){
      let length = window.sortable.children.length - 1;
      let inner = 0;
      if(key.which == 27 || length < 0 || selectedList > length){
        selected = false;
        selectedInner = false;
        for(let i of window.sortable.children){
          i.classList.remove('selected')
          for(let a of i.children){
            a.classList.remove('selectedInner')
          }
        }
      }
      if(key.which == 67 && key.ctrlKey){
        key.preventDefault();
        if(selected && !selectedInner){
          if($scope.list[selectedList].completed){
            $scope.list[selectedList].completed = false;
            } else {
            $scope.list[selectedList].completed = true;
            }
          localStorage.setItem('myNotes', angular.toJson($scope.list))
        } else if(selected && selectedInner){
          if($scope.list[selectedList].sublist[selectedListInner].completed){
            $scope.list[selectedList].sublist[selectedListInner].completed = false            
          }else{
            $scope.list[selectedList].sublist[selectedListInner].completed = true         
          }
          localStorage.setItem('myNotes', angular.toJson($scope.list))
        }
      }
        if(key.which == 38){
          //console.log(up);
          if(!selectedInner){
             selected = true;
            selectedList--;
            if(selectedList < 0){
              selectedList = length
            }
            if(selectedList >= 0){
              console.log(selectedList)
             innerLength = window.sortable.children[selectedList].querySelectorAll('ul').length -1;
            }
          } else {
            selectedListInner--;
            if(selectedListInner < 0){
              selectedListInner = innerLength
            }
          }

          if(!selectedInner){
            for(let i of window.sortable.children){
            i.classList.remove('selected')
            window.sortable.children[selectedList].classList.add('selected')
            }
          } else {
            for(let i of window.sortable.children[selectedList].children){
              i.classList.remove('selectedInner')
            }
             let inners = window.sortable.children[selectedList].querySelectorAll('ul');
              console.log(inners)
              inners[selectedListInner].classList.add('selectedInner')
          }
        }
        else if (key.which == 40) {
          //console.log(down);
          if(!selectedInner){
             selected = true;
            selectedList++;
            if(selectedList > length){
              selectedList = 0;
            }
             if(selectedList >= 0){
              console.log(selectedList)
             innerLength = window.sortable.children[selectedList].querySelectorAll('ul').length -1;
            }
          }else {
            selectedListInner++;
            if(selectedListInner > innerLength){
              selectedListInner = 0;
            }
          }
          if(!selectedInner){
            for(let i of window.sortable.children){
            i.classList.remove('selected')
            window.sortable.children[selectedList].classList.add('selected')
            }
          } else {
            for(let i of window.sortable.children[selectedList].children){
              i.classList.remove('selectedInner')
            }
              let inners = window.sortable.children[selectedList].querySelectorAll('ul');
              inners[selectedListInner].classList.add('selectedInner')
          }
        }

        if(selected){
          if(key.which == 46){
            if(!selectedInner){
             if($scope.list[selectedList].completed){
              $scope.removeItem(selectedList)
              }
            }else {
              if($scope.list[selectedList].sublist[selectedListInner].completed){
                $scope.removeItem(selectedList,selectedListInner, true)
                innerLength--;
            }
          }
        }
      }
        // if(selected && key.which == 39){
        //   window.sortable.children[selectedList].children[inner].add('selectedInner')
        // }
        if(selected){
          if(key.ctrlKey && key.which == 69){
            key.preventDefault();
            $scope.list[selectedList].value = $scope.addValue
            $scope.addValue = "";
            localStorage.setItem('myNotes', angular.toJson($scope.list))
          }
        }

        if(selected){
          if(key.which == 39){
            selectedInner = true;
            let inners = window.sortable.children[selectedList].querySelectorAll('ul');
            inners[selectedListInner].classList.add('selectedInner')
          }
        }

        if(selected && selectedInner == true){
          if(key.which == 37){
            selectedInner = false;
            let inners = window.sortable.children[selectedList].querySelectorAll('ul');
            for(let i of inners){
              i.classList.remove('selectedInner')
            }
          }
        }
    }



});
