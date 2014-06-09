'use strict';

/* Controllers */

angular.module('HealthyHomes.controllers', ['ui.bootstrap'])
    .controller('questionCtrl', ['$scope', 'questionService', function ($scope, homeService) {
        $scope.Questions = homeService.getQuestions().Questions;

        $scope.addQuestions = function ($event) {
            $event.preventDefault();
            var question = [
                {id: 5, 
                 title: "testQuestion", 
                 mainText: "Is this a test questions?", 
                 explText: "This is a test.",
                 answerType: "Checklist"
                }
            ];
            $scope.Questions.push(question);
            var promise = homeService.updateQuestions($scope);

            promise.then(function (message) {
                alert(message);
            }, function (reason) {
                alert(reason);
            });
        };

    }])
    .controller('HomeController', ['userService', '$location', 'homeService', function (userService, $location, homeService) {
        console.log('HomeController - created');
    }])
    .controller('FormController', [
            '$scope', '$window', '$http',
            function($scope, $window, $http) {
                $scope.messages = [];
// AngularJS will populate this object with input
// values based on the data-ng-model mappings.
                $scope.data = {};
                $scope.submit = function() {
                    $http({
                        method: 'POST', url: './form.do',
                        data: $scope.data
                    }).
                    success(function(data, status, headers, config) {
                        $window.location.replace('./confirm.html');
                    }).
                    error(function(data, status, headers, config) {
                        if(status == 400) {
                            $scope.messages = data;
                        } else {
                            alert('Unexpected server error.');
                        }
                    });
                };
            }]);

    /*.controller('MyCtrl2', [function () {

    }])*/
    .controller('TimesheetController', ['$scope', '$modal', '$routeParams', function ($scope, $modal, $routeParams) {

        var timesheetId = $routeParams.id;

        $scope.viewMode = $routeParams.mode != "edit";

        $scope.timeOffActive = true;
        $scope.addActive = false;

        $scope.timesheet = {
            startDate: Date.now(),
            endDate: Date.now(),
            status: "Current Period",
            timeoffHours: 0,
            totalTimeSheetHours: 0,
            timesheetProjects: []
        };

        $scope.projects = [
            { name: "Project X", id: 1, client: "Client A", totalHours: 0, active: false },
            { name: "Project Y", id: 2, client: "Client B", totalHours: 0, active: false },
            { name: "Project Z", id: 3, client: "Client C", totalHours: 0, active: false }
        ];

        $scope.recalculateTimesheetHours = function (timeoffH) {
            $scope.timesheet.totalTimeSheetHours = 0;
            for (var i = 0; i < $scope.timesheet.timesheetProjects.length; i++) {
                var prjx = $scope.timesheet.timesheetProjects[i];
                $scope.timesheet.totalTimeSheetHours += prjx.totalHours;
            }
            if (timeoffH != null) {
                $scope.timesheet.timeoffHours = timeoffH;
                $scope.timesheet.totalTimeSheetHours += timeoffH;
            } else {
                $scope.timesheet.totalTimeSheetHours += $scope.timesheet.timeoffHours;
            }
            $scope.timeOffActive = true;
            $scope.addActive = false;
        }

        $scope.removeTab = function (projectId) {
            if (confirm('Are you sure you want to remove the project?')) {
                var prjTmp = [];
                for (var i = 0; i < $scope.timesheet.timesheetProjects.length; i++) {
                    if ($scope.timesheet.timesheetProjects[i].id != projectId) {
                        prjTmp.push($scope.timesheet.timesheetProjects[i]);
                    } else {
                        $scope.projects.push($scope.timesheet.timesheetProjects[i]);
                    }
                }
                $scope.timesheet.timesheetProjects = prjTmp;
                $scope.recalculateTimesheetHours(null);
            }
        }

        $scope.addProject = function () {
            var modalInstance = $modal.open({
                templateUrl: 'projectSelector.html',
                controller: ModalInstanceCtrl,
                resolve: {
                    items: function () {
                        return $scope.projects;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                if (selectedItem == null) {
                    $scope.timeOffActive = true;
                } else {
                    selectedItem.active = true;
                    $scope.timesheet.timesheetProjects.push(selectedItem);

                    var prjTmp = [];
                    for (var i = 0; i < $scope.projects.length; i++) {
                        if ($scope.projects[i].id != selectedItem.id) {
                            prjTmp.push($scope.projects[i]);
                        }
                    }
                    $scope.projects = prjTmp;
                }
            });
        };
        var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

            $scope.projects = items;
            $scope.selectedPrj = $scope.projects[0];

            $scope.ok = function () {
                $modalInstance.close(this.selectedPrj);
            };

            $scope.cancel = function () {
                $modalInstance.close(null);
            };
        };
    }])
    .controller('ProjectTimesheetController', ['$scope', function ($scope) {

        $scope.project = $scope.prj;
        $scope.totalPrjHours = 0;
    }])
    .controller('TasksController', ['$scope', '$attrs', function ($scope, $attrs) {

        var taskCounter = 0;
        $scope.tasks = [];
        $scope.taskType = $attrs.type;

        $scope.noTasks = function () {
            return $scope.tasks.length == 0;
        };

        $scope.timeoffTasks = [
            {name: "Vacation", id: 1},
            {name: "Holiday", id: 2},
            {name: "Sick", id: 3},
            {name: "Payed timeoff", id: 4},
            {name: "Unpayed timeoff", id: 5}
        ];

        $scope.regularTasks = [
            {name: "Regular", id: 1},
            {name: "Overtime", id: 2},
            {name: "Doubletime", id: 3}
        ];

        $scope.recalculateHours = function () {
            var totalHours = 0;
            for (var i = 0; i < $scope.tasks.length; i++) {
                var taskx = $scope.tasks[i];
                if (taskx.hours < 0) {
                    taskx.hours = 0;
                } else if (taskx.hours > 24) {
                    taskx.hours = 24;
                }
                totalHours += taskx.hours;
            }
            if ($scope.taskType != "timeoffTasks") {
                $scope.project.totalHours = totalHours;
            }
            $scope.recalculateTimesheetHours($scope.taskType == "timeoffTasks" ? totalHours : null);
        }

        $scope.addItem = function () {
            var d = new Date();
            var curr_date = d.getDate();
            var curr_month = d.getMonth() + 1; //Months are zero based
            var curr_year = d.getFullYear();
            var dateStr = curr_year + "-" + (curr_month < 10 ? "0" + curr_month : curr_month) + "-" + (curr_date < 10 ? "0" + curr_date : curr_date);
            var defaultType = $scope.taskType == "timeoffTasks" ? "Vacation" : "Regular";
            $scope.tasks.push({id: taskCounter++, date: dateStr, hours: 0, type: defaultType, desc: "", selected: false});
        }

        $scope.removeItem = function (taskId) {
            for (var i = 0; i < $scope.tasks.length; i++) {
                var taskx = $scope.tasks[i];
                if (taskx.id == taskId) {
                    $scope.tasks.splice(i, 1);
                    break;
                }
            }

            $scope.recalculateHours();
        }

        $scope.removeSelected = function () {
            var auxTasks = [];
            for (var i = 0; i < $scope.tasks.length; i++) {
                var taskx = $scope.tasks[i];
                if (!taskx.selected) {
                    auxTasks.push(taskx);
                }
            }
            $scope.tasks = auxTasks;
            $scope.recalculateHours();
        }

        $scope.cloneSelected = function () {
            var auxTasks = [];
            for (var i = 0; i < $scope.tasks.length; i++) {
                var taskx = $scope.tasks[i];
                if (taskx.selected) {
                    var newTask = angular.copy(taskx);
                    newTask.id = taskCounter++;
                    auxTasks.push(newTask);
                }
            }
            for (var i = 0; i < auxTasks.length; i++) {
                var taskx = auxTasks[i];
                $scope.tasks.push(taskx);
            }
            $scope.recalculateHours();
        }

        $scope.selectAll = function () {
            for (var i = 0; i < $scope.tasks.length; i++) {
                var taskx = $scope.tasks[i];
                if ($scope.selectAllVar) {
                    taskx.selected = true;
                } else {
                    taskx.selected = false;
                }
            }
        }

        $scope.selectOne = function () {
            var allSelected = true;
            for (var i = 0; i < $scope.tasks.length; i++) {
                var taskx = $scope.tasks[i];
                if (!taskx.selected) {
                    allSelected = false;
                    break;
                }
            }
            if (allSelected) {
                $scope.selectAllVar = true;
            } else {
                $scope.selectAllVar = false;
            }
        }

        var init = function () {
            if ($scope.taskType == "timeoffTasks") {
                $scope.taskTypes = $scope.timeoffTasks;
            } else if ($scope.taskType == "regularTasks") {
                $scope.taskTypes = $scope.regularTasks;
            }
        };

        init();
    }])
    .controller('PageSummaryController', ['$scope', 'timesheetService', function ($scope, timesheetService) { //, Timesheets, UserService

        $scope.timesheets = {};
        $scope.timesheets = [
            { status: 'Current Period', start: new Date(), end: new Date()},
            { status: 'Accepted', start: new Date(), end: new Date()},
            { status: 'Submitted', start: new Date(), end: new Date()},
            { status: 'Submitted', start: new Date(), end: new Date()},
            { status: 'Accepted', start: new Date(), end: new Date()},
            { status: 'Submitted', start: new Date(), end: new Date()},
        ];//Timesheets.getByUser(UserService.getCurrentUser());


        $scope.selectedSheets = [];

        $scope.editTimeSheet = function (sheet) {
            console.dir(sheet);

        };


        $scope.viewTimeSheet = function (sheet) {
            console.dir(sheet);
        };


        //$scope.toggleSelect = function(sheet) {
        //$scope.selectedSheets.push(sheet);
        //};


    }])
    .controller('intProjectTimeEntryController', ['$scope', function ($scope) { //, Timesheets, UserService
        console.log('intProjectTimeEntryController - created');
        $scope.userTasks = [];
        $scope.taskTypes = [
            {name: 'Task', id: 1},
            {name: 'Meeting', id: 2},
            {name: 'Technical Downtime', id: 3},
            {name: 'Idle Time', id: 4},
            {name: 'Out of office', id: 5}
        ];
        for (var i = 0; i < 3; i++) {
            var task = {};
            task.taskType = 2;
            var today = new Date();
            task.taskDate = getFormattedDate(new Date());//today.getFullYear()+'-'+today.getMonth()+'-'+today.getDay();//'2014-01-16';
            task.taskHours = 0;
            task.taskDescription = 'a description';
            $scope.userTasks.push(task);
        }
        $scope.addTask = function () {
            var task = {};
            task.taskType = '';
            task.taskDate = '';
            task.taskHours = '';
            task.taskDescription = '';
            $scope.userTasks.push(task);
        };
        $scope.removeTask = function ($index) {
            $scope.userTasks.splice($index, 1);
        };
        $scope.saveTasks = function () {
            console.log("save user tasks some place");
            console.log($scope.userTasks);
        };
        $scope.userTaskType = [];
        $scope.userDate = [];
        $scope.userTaskHours = [];
        $scope.userDescription = [];

        function getFormattedDate(dateObj) {
            var m = today.getMonth() + 1 < 10 ? '0' + today.getMonth() : today.getMonth();
            var d = today.getDate() < 10 ? '0' + today.getDay() : today.getDay();
            return dateObj.getFullYear() + '-' + m + '-' + d;
        }

        console.log('intProjectTimeEntryController - finished');
    }])
    .controller('ProfileController', ['$scope', '$location', 'userService', function ($scope, $location, userService) {
        console.log('ProfileController - created');

        $scope.user = userService.getUserProfile();

        $scope.saveProfile = function () {
            console.log('ProfileController - Saved!');
            userService.saveProfile($scope.user);
        };
    }])
    .controller('ChangePasswordController', ['$scope', '$location', 'userService', function ($scope, $location, userService) {
        console.log('ChangePasswordController - created');

        $scope.user={};
        $scope.user.currentPassword='';
        $scope.user.newPassword='';
        $scope.user.newPasswordMatch='';

        $scope.changePassword = function () {
            console.log('password - changed');
            userService.changePassword($scope.user);
            $location.path('/myprofile');
        };
    }])
    .controller('LoginController', ['$scope', '$location', 'userService', 'homeService', function ($scope, $location, userService, homeService) {
        console.log('LoginController - created');

        $scope.user = userService.getUserProfile();

        $scope.login = function(){
            //if (userService.authenticateUser($scope.user)){
                $location.path('/home');
            //}
        };

    }]);

