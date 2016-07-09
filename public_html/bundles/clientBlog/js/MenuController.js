'use strict';

app.run(function($rootScope) {
    $rootScope.$on('scope.stored', function(event, data) {
        console.log("scope.stored", data);
    });
});

app  //menus
        .controller('menu', ['$rootScope', '$scope', '$window', '$cookies', 'Hello', 'Salt', '$http', 'TokenHandler', 'Scopes', function($rootScope, $scope, $window, $cookies, Hello, Salt, $http, TokenHandler, Scopes) {
                // If auth information in cookie
                if (typeof $cookies.username != "undefined" && typeof $cookies.secret != "undefined") {
                    $rootScope.userAuth = {username: $cookies.username, secret: $cookies.secret};
                }

//    // If not authenticated, go to login
                if (typeof $rootScope.userAuth == "undefined") {
                    $window.location = '#/login';
                    return;
                }
                //Show Title And Tooltip
                $scope.titleTitle = words.title;
                $scope.sortAscTitle = words.sortAsc;
                $scope.sortDescTitle = words.sortDesc;
                $scope.deleteBtnTitle = words.deleteBtn;
                $scope.showBtnTitle = words.showBtn;
                $scope.editBtnTitle = words.editBtn;
                $scope.indexTitle = words.index;
                $scope.idTitle = words.id;
                $scope.parentTitle = words.parent;
                $scope.actionTitle = words.action;
                $scope.pageTitle = words.page;
                $scope.createdAtTitle = words.createdAt;
                $scope.updatedAtTitle = words.updatedAt;
                $scope.orderListTitle = words.orderList;
                $scope.activeTitle = words.active;
                
                //accept to another controller for this controller Function 
                Scopes.store('menu', $scope);
                var count, orderBy, field;
                orderBy = '';
                field = '';
                var row = new Array();
                // count all menus
                $http.get(BaseUrl + "api/menus/count.json",
                        {headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}}).success(function(response) {

                    count = response.count;
                    var CountPaginate = Math.round(count / 10);
                    $scope.CountPaginate = CountPaginate;
                    for (var i = 0; i < CountPaginate; i++) {
                        row[i] = i + 1;
                    }
                    $scope.Allpaginate = row;
                });
                //current offset
                var current;

                //function paginate
                $scope.paginate = function(offset) {
                    if (orderBy === '') {
                        orderBy = "asc";
                    }

                    if (field === '') {
                        field = 'id';
                    }

                    current = offset;
                    offset = offset * 10 - 10;
                    $http.get(BaseUrl + "api/menus/-1/filters/" + offset + "/offsets/10/limits/" + field + "/orders/" + orderBy + ".json",
                            {headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}}).success(function(response) {
                        $scope.content = response;
                    });
                };
                //next offset
                $scope.pageNext = function() {
                    $scope.paginate(current + 1);
                };

                //preview offset
                $scope.pagePreview = function() {
                    if (current > 1) {
                        $scope.paginate(current - 1);
                    }
                };

                //first query
                $http.get(BaseUrl + "api/menus/0/offsets/" + 10 + "/limit.json",
                        {headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}}).success(function(response) {
                    current = 1;
                    $scope.content = response;
                });

                // Sort Order By desc
                $scope.sortDesc = function(field_in) {
                    field = field_in;
                    orderBy = "desc";
                    $scope.desc = true;
                    $scope.asc = false;
                    var offset = current * 10 - 10;
                    $http.get(BaseUrl + "api/menus/-1/filters/" + offset + "/offsets/10/limits/" + field + "/orders/desc.json",
                            {headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}}).success(function(response) {
                        $scope.content = response;
                    });
                };

                //Sort Order By Asc
                $scope.sortAsc = function(field_in) {
                    field = field_in;
                    orderBy = "asc";
                    var offset = current * 10 - 10;
                    $scope.asc = true;
                    $scope.desc = false;
                    $http.get(BaseUrl + "api/menus/-1/filters/" + offset + "/offsets/10/limits/" + field + "/orders/asc.json",
                            {headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}}).success(function(response) {
                        $scope.content = response;
                    });
                };
            }]) //Menu Add
        .controller('menuAdd', ['$rootScope', '$scope', '$window', '$cookies', 'Hello', 'Salt', '$http', 'TokenHandler', function($rootScope, $scope, $window, $cookies, Hello, Salt, $http, TokenHandler) {
                // If auth information in cookie
                if (typeof $cookies.username != "undefined" && typeof $cookies.secret != "undefined") {
                    $rootScope.userAuth = {username: $cookies.username, secret: $cookies.secret};
                }
//    
//    // If not authenticated, go to login
                if (typeof $rootScope.userAuth == "undefined") {
                    $window.location = '#/login';
                    return;
                }
                var menu = new Array();
                //read Category Data
                $http.get(BaseUrl + "api/menus.json",
                        {headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}}).success(function(response) {
                    $scope.menuAll = response;
//                    alert(response["id"]);
                    for (var i = 0; i < response.length; i++) {
                        try {
                            menu[i] = response[i].page.id;
//                        alert(response[i].page.id);
                        } catch (error) {

                        }
                    }
                });

                var page = new Array();
                $http.get(BaseUrl + "api/pages.json",
                        {headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}}).success(function(response) {


                    for (var i = 0; i < response.length; i++) {

                        for (var j = 0; j < menu.length; j++) {
                            if (menu.indexOf(response[i].id) === -1) {
                                if (page.indexOf(response[i].id) === -1) {
                                    page.push(response[i].id);
                                }
                            }

                        }
                    }
                    var pageAll = new Array();
                    for (var y = 0; y < response.length; y++) {
                        if (page.indexOf(response[y].id) !== -1) {
                            pageAll.push(response[y]);
                        }
                    }
                    $scope.pageAll = pageAll;
                });
                //Add menu Value
                $scope.SubmitAdd = function() {
                    var title, page, order_list, parent;
                    title = $scope.title;// $('#EditTitle').val();
                    page = $scope.page;//$('#EditctgId').val();
                    order_list = $scope.order_list;//$('#Editorder_list').val();
                    parent = $scope.parentmenu;
//            alert('title is : '+title+' menu is : '+menu+' order_list is : '+order_list+' category is : '+category );
                    $http({
                        method: 'POST',
                        data: {"menu": {
                                "title": title,
                                "orderList": order_list,
                                "page": page,
                                "parent": parent
                            }},
                        url: BaseUrl + 'api/menus.json',
                        headers: {'Content-Type': 'application/json;charset=utf-8', 'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}
                    }).then(function successCallback(response) {
                        alert('اطلاعات با موفقیت ثبت شد');
                    }, function errorCallback(response) {
                        alert('مشکل در ثبت اطلاعات با پشتیبانی تماس بگیرید');
                    });
                };


            }]) //menuEdit
        .controller('menuEdit', ['$rootScope', '$scope', '$window', '$cookies', 'Hello', 'Salt', '$http', 'TokenHandler', 'Scopes', function($rootScope, $scope, $window, $cookies, Hello, Salt, $http, TokenHandler, Scopes) {
                // If auth information in cookie
                if (typeof $cookies.username != "undefined" && typeof $cookies.secret != "undefined") {
                    $rootScope.userAuth = {username: $cookies.username, secret: $cookies.secret};
                }

                // If not authenticated, go to login
                if (typeof $rootScope.userAuth == "undefined") {
                    $window.location = '#/login';
                    return;
                }
                Scopes.store('menuEdit', $scope);
                //read Category Data


                var menu = new Array();
                //read Category Data
                $http.get(BaseUrl + "api/menus.json",
                        {headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}}).success(function(response) {
                    $scope.menuAll = response;
                    for (var i = 0; i < response.length; i++) {
                        try {
                            menu[i] = response[i].page.id;
                        } catch (error) {

                        }
                    }
                });

                var page = new Array();
                $http.get(BaseUrl + "api/pages.json",
                        {headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}}).success(function(response) {


                    for (var i = 0; i < response.length; i++) {

                        for (var j = 0; j < menu.length; j++) {
                            if (menu.indexOf(response[i].id) === -1) {
                                if (page.indexOf(response[i].id) === -1) {
                                    page.push(response[i].id);
                                }
                            }

                        }
                    }
                    var pageAll = new Array();
                    for (var y = 0; y < response.length; y++) {
                        if (page.indexOf(response[y].id) !== -1) {
                            pageAll.push(response[y]);
                        }
                    }
                    $scope.pageAll = pageAll;
                });

                $scope.SubmitEdit = function() {
                    var id = $('#EditId').val();
                    var title, parent, page, order_list;
                    title = $('#EditTitle').val();
                    parent = $('#EditMenu').val();
                    order_list = $('#Editorder_list').val();
                    page = $('#EditPage').val();

                    if (page === '? undefined:undefined ?') {
                        page = $('#EditpageId').val();
                    }
                    if (parent === '? undefined:undefined ?') {
                        parent = $('#EditmenuId').val();
                    }
//                    alert("id is : "+id+" titlt is : "+title+" parent is : "+parent+
//                            " orderList is :"+order_list+" page is : "+page);
//              alert(menu);
                    // Simple GET request example:
                    $http({
                        method: 'PUT',
                        data: {"menu": {
                                "title": title,
                                "orderList": order_list,
                                "parent": parent,
                                "page": page
                            }
                        },
                        url: BaseUrl + 'api/menus/' + id + '.json',
                        headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}
                    }).then(function successCallback(response) {
                        alert('اطلاعات با موفقیت ویرایش شد');
                        Scopes.get('menu').sortAsc('id');
                    }, function errorCallback(response) {
                        alert('مشکل در ارسال اطلاعات با پشتیبانی تماس بگیرید');
                    });
                };

            }]) //menuDelete
        .controller('menuDelete', ['$rootScope', '$scope', '$window', '$cookies', 'Hello', 'Salt', '$http', 'TokenHandler', function($rootScope, $scope, $window, $cookies, Hello, Salt, $http, TokenHandler) {
                // If auth information in cookie
                if (typeof $cookies.username != "undefined" && typeof $cookies.secret != "undefined") {
                    $rootScope.userAuth = {username: $cookies.username, secret: $cookies.secret};
                }

//    // If not authenticated, go to login
                if (typeof $rootScope.userAuth == "undefined") {
                    $window.location = '#/login';
                    return;
                }
                $scope.SubmitDelete = function() {
                    var id = $('#DeleteId').val();
                    // Simple GET request example:
                    $http({
                        method: 'DELETE',
                        url: BaseUrl + 'api/menus/' + id + '.json',
                        headers: {'x-wsse': TokenHandler.getCredentials($rootScope.userAuth.username, $rootScope.userAuth.secret)}
                    }).then(function successCallback(response) {
                        $('#' + id).hide();
                        $('#CloseDeleteBtn').click();
                    }, function errorCallback(response) {
                        alert('No Deleted');
                    });
                };

            }]);
