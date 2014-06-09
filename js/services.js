'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('HealthyHomes.services', []);
services.service('questionService', function($q, $rootScope) {
    this.getQuestions = function() { 
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.Questions = new Array();
        var getQuestionsSucceeded = function(sender, args, passArgs)
        {
            $rootScope.$apply(function() {
                var ListEnumerator = passArgs.allItems.getEnumerator();
                while (ListEnumerator.moveNext())
                {
                    var question = {};
                    var currentItem = ListEnumerator.get_current();
                    {id: 5, 
                 title: "testQuestion", 
                 mainText: "Is this a test questions?", 
                 explText: "This is a test.",
                 answerType: "Checklist"
                }

                    question.id = currentItem.get_item('ID');
                    question.title = currentItem.get_item('Title');
                    question.mainText = currentItem.get_item('mainText');
                    question.explText = currentItem.get_item('explText');
                    question.answerType = currentItem.get_item('answerType');

                    passArgs.Questions.push(question);
                }
//                              alert('as' + passArgs.Projects.length);
                deferred.resolve(passArgs);
            });
        }
        var getQuestionsFailed = function(sender, args) {
            deferred.reject('Request failed - please take a screenshot, try again and if this is the sencond time it happens send the screenshots to site admin: ' + args.get_message() + '\n' + args.get_stackTrace());
        }
        ExecuteOrDelayUntilScriptLoaded(function() {
            //alert('yeah');
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("Projects");
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml('<View Scope=\'Recursive\'>' +
                    '<ViewFields>' +
                    '<FieldRef Name=\'Title\'/>' +
                    '<FieldRef Name=\'ID\'/>' +
                    '<FieldRef Name=\'Customer_x003a_ID\'/>' +
                    '<FieldRef Name=\'Customer\'/>' +
                    '</ViewFields></View>');
            var passArgs = new Object();
            passArgs.allItems = list.getItems(camlQuery);
            passArgs.Projects = promise.Projects;
            context.load(passArgs.allItems, 'Include(ID,Title,Customer_x003a_ID,Customer)');
            context.executeQueryAsync(
                    Function.createDelegate(this,
                            Function.createCallback(getProjectsSucceeded, passArgs)),
                    Function.createDelegate(this,
                            Function.createCallback(getProjectsFailed)));
        }, "sp.js");
        return promise;
    };

    this.addProject = function(project) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("Projects");


            // create the ListItemInformational object
            var listItemInfo = new SP.ListItemCreationInformation();
            // add the item to the list
            var listItem = list.addItem(listItemInfo);
            // Assign Values for fields

            listItem.set_item('Title', project[0].title);
            //listItem.set_item('Customer_x003a_ID', project.customerId);
            var lookupValue1 = new SP.FieldLookupValue();

            lookupValue1.set_lookupId(project[0].customerId);
            //listItem.set_item('Customer_x003a_ID', lookupValue1);
            listItem.set_item('Customer', lookupValue1);

            listItem.update();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('added');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };

    this.updateQuestion = function(question) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("Projects");


            // get the item-id to the list
            var listItem = list.getItemById(project[0].id);
            // Assign Values for fields

            listItem.set_item('Title', project[0].title);
            //listItem.set_item('Customer_x003a_ID', project.customerId);
            var lookupValue1 = new SP.FieldLookupValue();

            lookupValue1.set_lookupId(project[0].customerId);
            //listItem.set_item('Customer_x003a_ID', lookupValue1);
            listItem.set_item('Customer', lookupValue1);

            listItem.update();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('edited');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };
    this.deleteQuestion = function(project) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("Projects");

            // get the item.id to the list
            var listItem = list.getItemById(project[0].id);

            listItem.deleteObject();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('deleted');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };
    
})
services.service('timesheetService', function($q, $rootScope) {
    this.getTimeSheets = function() { 
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.TimeSheets = new Array();
        var getTimeSheetsSucceeded = function(sender, args, passArgs)
        {
            $rootScope.$apply(function() {
                var ListEnumerator = passArgs.allItems.getEnumerator();
                while (ListEnumerator.moveNext())
                {
                    var timesheet = {};
                    var currentItem = ListEnumerator.get_current();

                    timesheet.id = currentItem.get_item('ID');
                    timesheet.status = currentItem.get_item('LinkTitle');
                    timesheet.start = currentItem.get_item('n9up');
                    timesheet.end = currentItem.get_item('t6h6');
                    timesheet.userId = currentItem.get_item('userId');

                    passArgs.TimeSheets.push(timesheet);
                }
//                              alert('as' + passArgs.Projects.length);
                deferred.resolve(passArgs);
            });
        }
        var getTimeSheetsFailed = function(sender, args) {
            deferred.reject('Request failed - please take a screenshot, try again and if this is the sencond time it happens send the screenshots to site admin: ' + args.get_message() + '\n' + args.get_stackTrace());
        }
        ExecuteOrDelayUntilScriptLoaded(function() {
            //alert('yeah');
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("TimeSheets");
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml('<View Scope=\'Recursive\'>' +
                    '<ViewFields>' +
                    '<FieldRef Name=\'title\'/>' +
                    '<FieldRef Name=\'ID\'/>' +
                    '<FieldRef Name=\'LinkTitle\'/>' +
                    '<FieldRef Name=\'n9up\'/>' +
                    '<FieldRef Name=\'t6h6\'/>' +
                    '<FieldRef Name=\'userId\'/>' +
                    '</ViewFields></View>');
            var passArgs = new Object();
            passArgs.allItems = list.getItems(camlQuery);

            //var listInfoArray = context.loadQuery(list, 'Include(Title,Fields.Include(Title,InternalName))');
            //alert("listItem"+listInfoArray[0]);

            passArgs.TimeSheets = promise.TimeSheets;
            context.load(passArgs.allItems, 'Include(ID,LinkTitle,n9up,t6h6,userId)');
            context.executeQueryAsync(
                    Function.createDelegate(this,
                            Function.createCallback(getTimeSheetsSucceeded, passArgs)),
                    Function.createDelegate(this,
                            Function.createCallback(getTimeSheetsFailed)));
        }, "sp.js");
        return promise;
    };

    this.addTimeSheet = function(timesheet) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("TimeSheets");


            // create the ListItemInformational object
            var listItemInfo = new SP.ListItemCreationInformation();
            // add the item to the list
            var listItem = list.addItem(listItemInfo);
            // Assign Values for fields

            listItem.set_item('LinkTitle', timesheet[0].status);
            listItem.set_item('n9up', timesheet[0].start);
            listItem.set_item('t6h6', timesheet[0].end);
            var lookupValue2 = new SP.FieldLookupValue();
            lookupValue2.set_lookupId(timesheet[0].userId);
            listItem.set_item('userId', lookupValue2);

            listItem.update();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('added');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };

    this.updateTimesheet = function(timesheet) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("TimeSheets");


            // get the item-id to the list
            var listItem = list.getItemById(timesheet[0].id);
            // Assign Values for fields

            listItem.set_item('LinkTitle', timesheet[0].status);
            listItem.set_item('n9up', timesheet[0].start);
            listItem.set_item('t6h6', timesheet[0].end);


            listItem.update();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('edited');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };
    this.deleteTimesheet = function(timesheet) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("TimeSheets");

            // get the item.id to the list
            var listItem = list.getItemById(timesheet[0].id);

            listItem.deleteObject();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('deleted');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };

})
services.service('projectTimesheetService', function($q, $rootScope) {
    this.getProjectTimeSheets = function() { 
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.ProjectTimeSheets = new Array();
        var getProjectTimeSheetsSucceeded = function(sender, args, passArgs)
        {
            $rootScope.$apply(function() {
                var ListEnumerator = passArgs.allItems.getEnumerator();
                while (ListEnumerator.moveNext())
                {
                    var projectTimesheet = {};
                    var currentItem = ListEnumerator.get_current();

                    projectTimesheet.id = currentItem.get_item('ID');
                    projectTimesheet.achievements = currentItem.get_item('Title');
                    projectTimesheet.risksIssues = currentItem.get_item('l3i1');
                    projectTimesheet.commentsActionItem = currentItem.get_item('wdkk');
                    projectTimesheet.projectId = currentItem.get_item('projectId');
                    projectTimesheet.timeSheetsId = currentItem.get_item('timeSheetsId');

                    passArgs.ProjectTimeSheets.push(projectTimesheet);
                }
                deferred.resolve(passArgs);
            });
        }
        var getProjectTimeSheetsFailed = function(sender, args) {
            deferred.reject('Request failed - please take a screenshot, try again and if this is the sencond time it happens send the screenshots to site admin: ' + args.get_message() + '\n' + args.get_stackTrace());
        }
        ExecuteOrDelayUntilScriptLoaded(function() {
            //alert('yeah');
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("ProjectTimeSheet");
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml('<View Scope=\'Recursive\'>' +
                    '<ViewFields>' +
                    '<FieldRef Name=\'ID\'/>' +
                    '<FieldRef Name=\'Title\'/>' +
                    '<FieldRef Name=\'l3i1\'/>' +
                    '<FieldRef Name=\'wdkk\'/>' +
                    '<FieldRef Name=\'projectId\'/>' +
                    '<FieldRef Name=\'timeSheetsId\'/>' +
                    '</ViewFields></View>');
            var passArgs = new Object();
            passArgs.allItems = list.getItems(camlQuery);


            passArgs.ProjectTimeSheets = promise.ProjectTimeSheets;
            context.load(passArgs.allItems, 'Include(ID,Title,l3i1,wdkk,projectId,timeSheetsId)');
            context.executeQueryAsync(
                    Function.createDelegate(this,
                            Function.createCallback(getProjectTimeSheetsSucceeded, passArgs)),
                    Function.createDelegate(this,
                            Function.createCallback(getProjectTimeSheetsFailed)));
        }, "sp.js");
        return promise;
    };

    
    this.getAllProjectTimesheetByTimeSheetId = function(timesheetId) { 
        var deferred = $q.defer();
        var promise = deferred.promise;

        promise.ProjectTimeSheets = new Array();
        var getProjectTimeSheetsSucceeded = function(sender, args, passArgs)
        {
            $rootScope.$apply(function() {
                var ListEnumerator = passArgs.allItems.getEnumerator();
                while (ListEnumerator.moveNext())
                {
                    var projectTimesheet = {};
                    var currentItem = ListEnumerator.get_current();
                    if (currentItem.get_item('timeSheetsId') === timesheetId) {
                        projectTimesheet.id = currentItem.get_item('ID');
                        projectTimesheet.achievements = currentItem.get_item('Title');
                        projectTimesheet.risksIssues = currentItem.get_item('l3i1');
                        projectTimesheet.commentsActionItem = currentItem.get_item('wdkk');
                        projectTimesheet.projectId = currentItem.get_item('projectId');
                        projectTimesheet.timeSheetsId = currentItem.get_item('timeSheetsId');

                        passArgs.ProjectTimeSheets.push(projectTimesheet);
                    }
                }
                deferred.resolve(passArgs);
            });
        }
        var getProjectTimeSheetsFailed = function(sender, args) {
            deferred.reject('Request failed - please take a screenshot, try again and if this is the sencond time it happens send the screenshots to site admin: ' + args.get_message() + '\n' + args.get_stackTrace());
        }
        ExecuteOrDelayUntilScriptLoaded(function() {
            //alert('yeah');
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("ProjectTimeSheet");
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml('<View Scope=\'Recursive\'>' +
                    '<ViewFields>' +
                    '<FieldRef Name=\'ID\'/>' +
                    '<FieldRef Name=\'Title\'/>' +
                    '<FieldRef Name=\'l3i1\'/>' +
                    '<FieldRef Name=\'wdkk\'/>' +
                    '<FieldRef Name=\'projectId\'/>' +
                    '<FieldRef Name=\'timeSheetsId\'/>' +
                    '</ViewFields></View>');
            var passArgs = new Object();
            passArgs.allItems = list.getItems(camlQuery);


            passArgs.ProjectTimeSheets = promise.ProjectTimeSheets;
            context.load(passArgs.allItems, 'Include(ID,Title,l3i1,wdkk,projectId,timeSheetsId)');
            context.executeQueryAsync(
                    Function.createDelegate(this,
                            Function.createCallback(getProjectTimeSheetsSucceeded, passArgs)),
                    Function.createDelegate(this,
                            Function.createCallback(getProjectTimeSheetsFailed)));
        }, "sp.js");
        return promise;
    };
    this.getAllTasksByProjectTimeSheetId = function(projectTimesheetId) { 
        var deferred = $q.defer();
        var promise = deferred.promise;

        promise.TasksArray = new Array();
        var getTasksSucceeded = function(sender, args, passArgs)
        {
            $rootScope.$apply(function() {
                var ListEnumerator = passArgs.allItems.getEnumerator();
                while (ListEnumerator.moveNext())
                {
                    var taskObject = {};
                    var currentItem = ListEnumerator.get_current();
                    if (currentItem.get_item('projectTimesheetId') === projectTimesheetId) {
                        taskObject.id = currentItem.get_item('ID');
                        taskObject.type = currentItem.get_item('Title');
                        taskObject.date = currentItem.get_item('qnsl');
                        taskObject.hours = currentItem.get_item('yvoh');
                        taskObject.description = currentItem.get_item('v1ku');
                        taskObject.projectTimesheetId = currentItem.get_item('projectTimesheetId');

                        passArgs.TasksArray.push(taskObject);
                    }
                }
//                              alert('as' + passArgs.Projects.length);
                deferred.resolve(passArgs);
            });
        }
        var getTasksFailed = function(sender, args) {
            deferred.reject('Request failed - please take a screenshot, try again and if this is the sencond time it happens send the screenshots to site admin: ' + args.get_message() + '\n' + args.get_stackTrace());
        }
        ExecuteOrDelayUntilScriptLoaded(function() {
            //alert('yeah');
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("Task");
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml('<View Scope=\'Recursive\'>' +
                    '<ViewFields>' +
                    '<FieldRef Name=\'ID\'/>' +
                    '<FieldRef Name=\'Title\'/>' +
                    '<FieldRef Name=\'qnsl\'/>' +
                    '<FieldRef Name=\'yvoh\'/>' +
                    '<FieldRef Name=\'v1ku\'/>' +
                    '<FieldRef Name=\'projectTimesheetId\'/>' +
                    '</ViewFields></View>');
            var passArgs = new Object();
            passArgs.allItems = list.getItems(camlQuery);


            passArgs.TasksArray = promise.TasksArray;
            context.load(passArgs.allItems, 'Include(ID,Title,qnsl,yvoh,v1ku,projectTimesheetId)');
            context.executeQueryAsync(
                    Function.createDelegate(this,
                            Function.createCallback(getTasksSucceeded, passArgs)),
                    Function.createDelegate(this,
                            Function.createCallback(getTasksFailed)));
        }, "sp.js");
        return promise;
    };
    this.getProjectByProjectTimeSheetId = function(projectTimeSheetId) { 
        var deferred = $q.defer();
        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("ProjectTimeSheet");
            // get the item-id to the list
            var listItem = list.getItemById(projectTimeSheetId);
            
            var list2 = web.get_lists().getByTitle("Projects");
            var listItem2 = list2.getItemById(listItem[0].projectId);
            context.load(listItem2);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('deleted');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");
        return deferred.promise;
        
    };
    
    this.addProjectTimeSheet = function(projectTimesheet) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("ProjectTimeSheet");


            // create the ListItemInformational object
            var listItemInfo = new SP.ListItemCreationInformation();
            // add the item to the list
            var listItem = list.addItem(listItemInfo);
            // Assign Values for fields

            listItem.set_item('Title', projectTimesheet[0].achievements);
            listItem.set_item('l3i1', projectTimesheet[0].risksIssues);
            listItem.set_item('wdkk', projectTimesheet[0].commentsActionItem);
            var lookupValue1 = new SP.FieldLookupValue();
            lookupValue1.set_lookupId(projectTimesheet[0].projectId);
            listItem.set_item('projectId', lookupValue1);
            var lookupValue2 = new SP.FieldLookupValue();
            lookupValue2.set_lookupId(projectTimesheet[0].timeSheetsId);
            listItem.set_item('timeSheetsId', lookupValue2);

            listItem.update();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('added');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };

    this.updateProjectTimesheet = function(projectTimesheet) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("ProjectTimeSheet");


            // get the item-id to the list
            var listItem = list.getItemById(projectTimesheet[0].id);
            // Assign Values for fields

            listItem.set_item('Title', projectTimesheet[0].achievements);
            listItem.set_item('l3i1', projectTimesheet[0].risksIssues);
            listItem.set_item('wdkk', projectTimesheet[0].commentsActionItem);
            var lookupValue1 = new SP.FieldLookupValue();
            lookupValue1.set_lookupId(projectTimesheet[0].projectId);
            listItem.set_item('projectId', lookupValue1);
            var lookupValue2 = new SP.FieldLookupValue();
            lookupValue2.set_lookupId(projectTimesheet[0].timeSheetsId);
            listItem.set_item('timeSheetsId', lookupValue2);


            listItem.update();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('edited');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };
    this.deleteProjectTimesheet = function(projectTimesheet) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("ProjectTimeSheet");

            // get the item.id to the list
            var listItem = list.getItemById(projectTimesheet[0].id);

            listItem.deleteObject();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('deleted');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };
})
services.service('taskService', function($q, $rootScope) {
    this.getTasks = function() { 
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.TasksArray = new Array();
        var getTasksSucceeded = function(sender, args, passArgs)
        {
            $rootScope.$apply(function() {
                var ListEnumerator = passArgs.allItems.getEnumerator();
                while (ListEnumerator.moveNext())
                {
                    var taskObject = {};
                    var currentItem = ListEnumerator.get_current();

                    taskObject.id = currentItem.get_item('ID');
                    taskObject.type = currentItem.get_item('Title');
                    taskObject.date = currentItem.get_item('qnsl');
                    taskObject.hours = currentItem.get_item('yvoh');
                    taskObject.description = currentItem.get_item('v1ku');
                    taskObject.projectTimesheetId = currentItem.get_item('projectTimesheetId');

                    passArgs.TasksArray.push(taskObject);
                }
//                              alert('as' + passArgs.Projects.length);
                deferred.resolve(passArgs);
            });
        }
        var getTasksFailed = function(sender, args) {
            deferred.reject('Request failed - please take a screenshot, try again and if this is the sencond time it happens send the screenshots to site admin: ' + args.get_message() + '\n' + args.get_stackTrace());
        }
        ExecuteOrDelayUntilScriptLoaded(function() {
            //alert('yeah');
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("Task");
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml('<View Scope=\'Recursive\'>' +
                    '<ViewFields>' +
                    '<FieldRef Name=\'ID\'/>' +
                    '<FieldRef Name=\'Title\'/>' +
                    '<FieldRef Name=\'qnsl\'/>' +
                    '<FieldRef Name=\'yvoh\'/>' +
                    '<FieldRef Name=\'v1ku\'/>' +
                    '<FieldRef Name=\'projectTimesheetId\'/>' +
                    '</ViewFields></View>');
            var passArgs = new Object();
            passArgs.allItems = list.getItems(camlQuery);


            passArgs.TasksArray = promise.TasksArray;
            context.load(passArgs.allItems, 'Include(ID,Title,qnsl,yvoh,v1ku,projectTimesheetId)');
            context.executeQueryAsync(
                    Function.createDelegate(this,
                            Function.createCallback(getTasksSucceeded, passArgs)),
                    Function.createDelegate(this,
                            Function.createCallback(getTasksFailed)));
        }, "sp.js");
        return promise;
    };

    this.addTask = function(taskObject) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("Task");


            // create the ListItemInformational object
            var listItemInfo = new SP.ListItemCreationInformation();
            // add the item to the list
            var listItem = list.addItem(listItemInfo);
            // Assign Values for fields

            listItem.set_item('Title', taskObject[0].type);
            listItem.set_item('qnsl', taskObject[0].date);
            listItem.set_item('yvoh', taskObject[0].hours);
            listItem.set_item('v1ku', taskObject[0].description);
            var lookupValue2 = new SP.FieldLookupValue();
            lookupValue2.set_lookupId(taskObject[0].projectTimesheetId);
            listItem.set_item('projectTimesheetId', lookupValue2);

            listItem.update();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('added');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };

    this.updateTask = function(taskObject) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("Task");


            // get the item-id to the list
            var listItem = list.getItemById(taskObject[0].id);
            // Assign Values for fields

            listItem.set_item('Title', taskObject[0].type);
            listItem.set_item('qnsl', taskObject[0].date);
            listItem.set_item('yvoh', taskObject[0].hours);
            listItem.set_item('v1ku', taskObject[0].description);
            var lookupValue2 = new SP.FieldLookupValue();
            lookupValue2.set_lookupId(taskObject[0].projectTimesheetId);
            listItem.set_item('projectTimesheetId', lookupValue2);

            listItem.update();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('edited');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };
    this.deleteTask = function(taskObject) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("Task");

            // get the item.id to the list
            var listItem = list.getItemById(taskObject[0].id);

            listItem.deleteObject();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('deleted');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };
})

services.service('timeOffService', function($q, $rootScope) {
    this.getTimeOffs = function() { 
        var deferred = $q.defer();
        var promise = deferred.promise;
        promise.TimeOffArray = new Array();
        var getTimeOffSucceeded = function(sender, args, passArgs)
        {
            $rootScope.$apply(function() {
                var ListEnumerator = passArgs.allItems.getEnumerator();
                while (ListEnumerator.moveNext())
                {
                    var timeOff = {};
                    var currentItem = ListEnumerator.get_current();

                    timeOff.id = currentItem.get_item('ID');
                    timeOff.type = currentItem.get_item('Title');
                    timeOff.date = currentItem.get_item('qe7g');
                    timeOff.hours = currentItem.get_item('vpgi');
                    timeOff.description = currentItem.get_item('10yv');
                    timeOff.timeSheetsId = currentItem.get_item('timeSheetsId');

                    passArgs.TimeOffArray.push(timeOff);
                }
                deferred.resolve(passArgs);
            });
        }
        var getTimeOffFailed = function(sender, args) {
            deferred.reject('Request failed - please take a screenshot, try again and if this is the sencond time it happens send the screenshots to site admin: ' + args.get_message() + '\n' + args.get_stackTrace());
        }
        ExecuteOrDelayUntilScriptLoaded(function() {
            //alert('yeah');
            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("timeOff");
            var camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml('<View Scope=\'Recursive\'>' +
                    '<ViewFields>' +
                    '<FieldRef Name=\'ID\'/>' +
                    '<FieldRef Name=\'Title\'/>' +
                    '<FieldRef Name=\'qe7g\'/>' +
                    '<FieldRef Name=\'vpgi\'/>' +
                    '<FieldRef Name=\'10yv\'/>' +
                    '<FieldRef Name=\'timeSheetsId\'/>' +
                    '</ViewFields></View>');
            var passArgs = new Object();
            passArgs.allItems = list.getItems(camlQuery);


            passArgs.TimeOffArray = promise.TimeOffArray;
            context.load(passArgs.allItems, 'Include(ID,Title,qe7g,vpgi,10yv,timeSheetsId)');
            context.executeQueryAsync(
                    Function.createDelegate(this,
                            Function.createCallback(getTimeOffSucceeded, passArgs)),
                    Function.createDelegate(this,
                            Function.createCallback(getTimeOffFailed)));
        }, "sp.js");
        return promise;
    };

    this.addTimeOff = function(timeOff) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("timeOff");


            // create the ListItemInformational object
            var listItemInfo = new SP.ListItemCreationInformation();
            // add the item to the list
            var listItem = list.addItem(listItemInfo);
            // Assign Values for fields

            listItem.set_item('Title', timeOff[0].type);
            listItem.set_item('qe7g', timeOff[0].date);
            listItem.set_item('vpgi', timeOff[0].hours);
            listItem.set_item('10yv', timeOff[0].description);
            var lookupValue2 = new SP.FieldLookupValue();
            lookupValue2.set_lookupId(timeOff[0].timeSheetsId);
            listItem.set_item('timeSheetsId', lookupValue2);

            listItem.update();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('added');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };

    this.updateTimeOff = function(timeOff) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("timeOff");


            // get the item-id to the list
            var listItem = list.getItemById(timeOff[0].id);
            // Assign Values for fields

            listItem.set_item('Title', timeOff[0].type);
            listItem.set_item('qe7g', timeOff[0].date);
            listItem.set_item('vpgi', timeOff[0].hours);
            listItem.set_item('10yv', timeOff[0].description);
            var lookupValue2 = new SP.FieldLookupValue();
            lookupValue2.set_lookupId(timeOff[0].timeSheetsId);
            listItem.set_item('timeSheetsId', lookupValue2);

            listItem.update();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('edited');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };
    this.deleteTimeOff = function(timeOff) { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var web = context.get_web();
            var list = web.get_lists().getByTitle("timeOff");

            // get the item.id to the list
            var listItem = list.getItemById(timeOff[0].id);

            listItem.deleteObject();//list
            context.load(listItem);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('deleted');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };
})
services.service('userService', function($q, $rootScope) {
    console.log('userService - created')
        this.getUser = function() { 
        var deferred = $q.defer();


        ExecuteOrDelayUntilScriptLoaded(function() {

            var context = new SP.ClientContext.get_current();
            var user = context.get_web().get_currentUser();
            alert ("user email" + user.get_email() + " userId:" + user.get_userId());
            context.load(user);
            context.executeQueryAsync(
                    Function.createDelegate(this, function() {
                        $rootScope.$apply(function() {

                            deferred.resolve('user is loaded');
                        });
                    }),
                    Function.createDelegate(this, function(args) {
                        $rootScope.$apply(function() {
                            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
                        });
                    })
                    );
        }, "sp.js");

        return deferred.promise;
    };

    $rootScope.loggedIn = false;


    this.getLoggedIn = function(){
        return $rootScope.loggedIn;
    };

    this.authenticateUser = function(user){
        console.log('user authenticated!');
        $rootScope.loggedIn = true;
        return $rootScope.loggedIn;
    };

    this.getUserProfile = function() {
        if ($rootScope.user == null){
            /** Pull the user data from the services in backend ldap maybe??? **/
            var user={};
            user.userName='jaime';
            user.firstName='Jaime M';
            user.lastName='Martinez';
            user.email='jaime.martinez@intertecintl.com';
            user.password='123Cheese';
            $rootScope.user = user;
        }
        return $rootScope.user;

    };
    this.saveProfile = function (user) {
        console.log('userProfileService - saveProfile');
        /** Call backend to save user profile**/
    };

    this.changePassword = function(user){
        console.log('userProfileService - changePassword!' + user);
    };
});

services.service('homeService', function($rootScope, $location, userService){
    console.log('homeService - created');
    /* has to figure out where include this global listener */
    $rootScope.$on("$routeChangeStart", function(event, next, current){
        console.log('checking authentication...');
        if (next != null && next.$$route != null &&
            next.$$route.templateUrl === 'partial/login.html'){
            console.log('Avoid recursive loop here.');
        }
        else if (userService.getLoggedIn() === false){
            console.log('User no authenticated - redirecting...');
            $location.path('/login');
        }
    });
    $rootScope.$broadcast('$routeChangeStart');
});

