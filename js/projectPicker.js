angular.module('conrep', ['ui.bootstrap'])
.controller('ProjectPickerController', function($scope, $dialog) {
    //initial load
    $scope.options = [{ name: "Wells Fargo - CORE",  value: 1, description:"Wells Description",
                        startDate:"2013-03-20", endDate:"2013-08-20"},
                      { name: "Another project",  value: 2, description: "Another Description",
                        startDate:"2013-01-20", endDate:"2013-09-20"}];

    $scope.selectedOption = null;
    $scope.showAddEditProject = function (action) {

        $scope.isEdit = function(){
            return action == "Edit";
        }

        $scope.dialogTitle =action;
        var selectedOption = null;

        if (action !== "Add"){
            selectedOption =$scope.selectedOption;
        }else{
            $scope.project = {};
        }

        var items = $scope.options;
        var options = {
            backdropFade: true,
            dialogFade: true,
            dialogClass: 'modal projectDialog',
            resolve: {
                selectedOption: function () { return selectedOption; },
                items: function () { return items; },
                $scope: function () { return $scope; }
            }
        };

        var dialog = $dialog.dialog(options).open('projectDialog.html', 'DialogAddEditController');
    };
})
.controller('DialogAddEditController', function ($scope, dialog, items, selectedOption) {

   if(selectedOption != null){
       $scope.project = {};
       $scope.project.name = selectedOption.name;
       $scope.project.description = selectedOption.description;
       $scope.project.value = selectedOption.value;
       $scope.project.startDate = selectedOption.startDate;
       $scope.project.endDate = selectedOption.endDate;
   }

    $scope.saveProject = function (project){
        if (project !== undefined){
            if (project.name == undefined) {
                alert("Missing Name!");
            } else {
                if(selectedOption !== null){
                    angular.forEach(items, function( object, key){
                        if (object.value === project.value){
                            items[key] = project;
                            return false;
                        }
                    });
                    alert("Project successfully updated!!");
                } else{
                    items.push({name:project.name, value: items.length + 1, description: project.description,
                                startDate:project.startDate, endDate:project.endDate});
                    alert("Project successfully added!!");
                }
                dialog.close(project);
                $scope.selectedOption = null;
            }
        }else {
            alert("Missing Name or Description!!");
        }
    }

    $scope.cancelProject = function (){
        dialog.close();
        $scope.selectedOption = null;
    }

    $scope.removeProject = function (project, event){
        if (project !== undefined){
            if(selectedOption !== undefined){
                var deleteProject = confirm('Are you sure to delete this project?');
                if (deleteProject) {
                    angular.forEach(items, function( object, key){
                        if (object.value === project.value){
                            items.splice(key ,1);
                            return false;
                        }
                    });
                    alert("Project successfully deleted!!");
                    dialog.close(project);
                    $scope.selectedOption = null;

                }
            }
        }
    }
})

.directive('ngConfirmClick', [
    function(){
        return {
            link: function (scope, element, attr) {
                var msg = attr.ngConfirmClick || "Are you sure?";
                var clickAction = attr.confirmedClick;
                element.bind('click',function (event) {
                    if ( window.confirm(msg) ) {
                        scope.$eval(clickAction)
                    }
                });
            }
        };
    }]);

