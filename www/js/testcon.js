angular.module('starter.controllers', [])
.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $cookies, Data, $ionicLoading, $state, $ionicHistory, $ionicModal, DataOrder) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;

        var chUser = $cookies.get('name');
        if (chUser) {
            console.log('logon true');
            if ($cookies.get('mastertype') == 3 || $cookies.get('mastertype') == 2) {
                Data.logontype = true;
            } else {
                Data.logontype = false;
            }
            Data.logonstatus = false;
            Data.mastertype = $cookies.get('mastertype'); //set default null
            Data.termas = $cookies.get('territoryid'); //A02
            Data.Tername = $cookies.get('name');
            Data.territoryadjust = $cookies.get('territoryid'); //A02
        } else {
            Data.logonstatus = true;
            console.log('logon false');
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.playlists', {}, {
                reload: true
            });
        }
        $scope.showLoadingProperTimesReg = function (txtname) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner><div class="row">' +
                    '<div class="col"><h4>กรุณารอสักครู่กำลังบันทึกข้อมูลเอกสาร ' + txtname + ' อาจใช้เวลา 1-2 นาทีในการบันทึก</h4></div>' +
                    '</div>',
                noBackdrop: true
            });
        };
        $scope.showLoadingProperTimesRegter = function (txt) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner><div class="row">' +
                    '<div class="col"><h4>กรุณารอสักครู่ ' + txt + '</h4></div>' +
                    '</div>',
                noBackdrop: true
            });
        };
        $scope.showLoadGPS = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner><div class="row">' +
                    '<div class="col"><h4>โปรดรอสักครู่ กำลังโหลดข้อมูล GPS อยู่อาจใช้เวลา 1-2 นาทีในการโหลดข้อมูล</h4></div>' +
                    '</div>',
                noBackdrop: true
            });
        };
        $scope.showLoadingProperTimesRegterComplete = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner><div class="row">' +
                    '<div class="col"><h4>บันทึกข้อมูลเสร็จแล้ว</h4></div>' +
                    '</div>',
                noBackdrop: true
            });
        };
        $scope.showLoadingComplete = function (txt) {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles"  class="success text-l spinner-energized"></ion-spinner><div class="row">' +
                    '<div class="col"><h4>' + txt + '</h4></div>' +
                    '</div>',
                noBackdrop: true
            });
        };
        $scope.showLoadingProperTimesRegAll = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner><div class="row">' +
                    '<div class="col"><h4>กรุณารอสักครู่กำลังบันทึกข้อมูลอาจใช้เวลา 1-2 นาทีในการบันทึก</h4></div>' +
                    '</div>',
                noBackdrop: true
            });
        };
        $scope.showLoadingProperTimes = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="bubbles" class="success text-l spinner-energized"></ion-spinner>',
                noBackdrop: true
            });
        };
        $scope.showLoading = function(txt) {
                 $ionicLoading.show({
                 template:   '<ion-spinner icon="bubbles" class="spinner-energized"></ion-spinner><div class="row">'+
                             '<div class="col"><h4>'+txt+'</h4></div>'+
                             '</div>',
                 noBackdrop: true
               });
         };
        setTimeout(function () {
            $ionicLoading.hide();
        }, 3000);
        $scope.showLoadingProperTimes();
        GetGPSLocation(function (res) {
            Data.latitude = res.latitude;
            Data.longitude = res.longitude;
        });
        // Form data for the login modal
        $scope.loginData = {};

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function () {
            $scope.modal.hide();
        };
        // Open the login modal
        $scope.login = function () {
            $scope.modal.show();
        };
        // Perform the login action when the user submits the login form
        $scope.doLogin = function () {
            var username = $scope.loginData.username;
            var pwdname = $scope.loginData.password;
            if (!username || !pwdname) {
                alert('กรุณากรอกข้อมูลให้ครบด้วย');
            } else {
                console.log('Doing login', $scope.loginData);
                $cookies.username = username;
                $cookies.pwdname = pwdname;
            }
            $timeout(function () {
                $scope.closeLogin();
            }, 1000);
        };
        $scope.setdmaster = function (id) {
            Data.mastertype = id;
        }
        $scope.calldoc = function (cClick, ethis) {
            $('#' + cClick).trigger('click');
        }
        $scope.InAnnoteAttract = function (table, id, base64String, title, objid, callback) {
            $scope.showLoadingProperTimesReg(title);
            try {
                var note = MobileCRM.DynamicEntity.createNew("annotation");
                note.properties.objectid = new MobileCRM.Reference(table, id);
                note.properties.notetext = objid;
                note.properties.subject = title;
                note.properties.documentbody = base64String;
                note.properties.mimetype = fileType;
                note.properties.isdocument = true;
                note.properties.filesize = parseInt(sizeKB);
                note.properties.filename = fileName;
                note.save(
                    function (er) {
                        if (er) {
                            alert(title + '\n' + er);
                            //callback('null ' + er);
                        } else {
                          setTimeout(function(){
                            callback();
                          },3000);
                        }
                    });
            } catch (er) {
                alert('insert doc ' + title + '\n' + er);
            }
        };
        $scope.InAnnoteAttractUpdate = function (table, id, base64String, title, objid, callback) {
            $scope.showLoadingProperTimesReg(title);
            try {
                var note = MobileCRM.DynamicEntity.createNew("annotation",id);
                note.properties.notetext = objid;
                note.properties.subject = title;
                note.properties.documentbody = base64String;
                note.properties.mimetype = fileType;
                note.properties.isdocument = true;
                note.properties.filesize = parseInt(sizeKB);
                note.properties.filename = fileName;
                note.save(
                    function (er) {
                        if (er) {
                            alert(title + '\n' + er);
                            //callback('null ' + er);
                        } else {
                          setTimeout(function(){
                            callback();
                          },3000);
                        }
                    });
            } catch (er) {
                alert('insert doc ' + title + '\n' + er);
            }
        };

        $scope.clicklnk = function (id) {
            if (id == 1 || id == '1') {
                $state.go('app.openaccount', {
                    territoryid: Data.termas,
                    mastertype: Data.mastertype,
                    getguid: guid(),
                    pricelevel: Data.pricelevel,
                    transactioncurrency: Data.transactioncurrency
                }, {
                    reload: true
                });
            }
        };
        $scope.clicklogout = function () {
            $state.go('app.logout', {}, {
                reload: true
            });
        };
        $scope.clicktaccountlist = function () {
            $state.go('app.accountlist', {
                terriid: Data.termas,
                mastertype: Data.mastertype
            }, {
                reload: true
            });
        };
        $scope.clickter = function () {
            $state.go('app.accountlistsup', {
                terriid: Data.termas,
                mastertype: Data.mastertype
            }, {
                reload: true
            });
        };

        $scope.sendmailtosup = function (id, title, txt, callback) {
            getTerEmp(id, function (data) {
                if (data) {
                  switch (data[0].name) {
                    case 'U01':
                    case 'U02':
                    case 'U03':
                    case 'U04':
                              var text = "เรียน  Manager./Directer, รบกวนดำเนินการอนุมัติ" + title+"เขตการขาย " + data[0].name+txt + "ให้ด้วยครับ  ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                              SendMail(data[0].ivz_leadermail, title, text);
                              setTimeout(function () {
                                  callback();
                              }, 2000);
                      break;
                    default:
                            var text = "เรียน  Sup./Sales Manger, รบกวนดำเนินการอนุมัติ" + title+"เขตการขาย " + data[0].name+txt + "ให้ด้วยครับ  ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                            SendMail(data[0].ivz_leadermail, title, text);
                            setTimeout(function () {
                                callback();
                            }, 2000);
                  }
                }
            });
        }
        $scope.sendmailtosales = function (id, title, txt, callback) {
            getTerEmp(id, function (data) {
                if (data) {
                    var text = "เรียน  พนักงานขายเขต " + data[0].name + ' Sup./Sales Manger,' + txt + "  ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                    SendMail(data[0].ivz_emailcontact, title, text);
                    setTimeout(function () {
                        callback();
                    }, 2000);
                }
            });
        }
        $scope.confirmrejectadjust = function (id, txt, callback) {
            console.log(id + '::::' + txt);
        }
        $scope.confirmordercart = function () {
            if (DataOrder.order.length > 0) {
                $state.go('app.listorder', {}, {
                    reload: true
                });
            } else {
                alert('ไม่พบรายการเปิดใบสั่งขาย');
            }
        }
        $scope.orderlink = function (expression) {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            switch (expression) {
            case 1:
                var getguid = guid();
                $state.go('app.productlist', {
                    accountid: null,
                    mastertype: Data.mastertype,
                    ordertype: 0,
                    getguid: getguid
                }, {
                    reload: true
                });
                break;
            case 2:
                $state.go('app.orderlistpending', {
                    terid: $cookies.get('territoryid'),
                    mastertype: Data.mastertype,
                    ordertype: 0
                }, {
                    reload: true
                });
                break;
            default:

            }
        }
        $scope.reback = function(){
          $ionicHistory.goBack(-1);
        }
        $scope.reload = function(){

        };
    })
    /*-------------- เข้าสู่ระบบ -------------------*/
    .controller('PlaylistsCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, datauser, $ionicScrollDelegate, $ionicModal)  {
        $state.reload();
        Data.showcart = false;
        $ionicHistory.clearHistory();

        $scope.scrolling = 0;
        var a = [];
        var j = 1;
        $scope.logscroll = function () {
        }
        $scope.$on("$ionicView.enter", function () {
            console.log('reload complete');
        });
        $scope.clicknext = function () {
            $state.go('app.orderlist', {
                terid: 12345,
                mastertype: 1,
                ordertype: 1
            }, {
                reload: true
            });
        }
        var chUser = $cookies.get('ivz_empid');
        if (chUser) {
            if ($cookies.get('mastertype') == 3 || $cookies.get('mastertype') == 2) {
                Data.logontype = true;
            } else {
                Data.logontype = false;
            }
            Data.logonstatus = false;
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.browse', {}, {
                reload: true
            });
        } else {
            $scope.Data = Data;
            datauser.territoryid = '';
            datauser.ivz_empname = '';
            datauser.ivz_empid = '';
            datauser.ivz_password = '';
            datauser.ivz_emailcontact = '';
            datauser.ivz_leadermail = '';
            datauser.ivz_ccmail = '';
            datauser.name = '';
            datauser.description = '';
            datauser.ivz_statusempid = '';
            $scope.chk = {
                check: true,
                checknull: true
            };
            $scope.user = {
                txtname: '',
                pwdname: ''
            };
            Data.logonstatus = true;
            $scope.checkuser = function (user, pwd) {
                console.log(user + '::' + pwd);
                if (!(user) && !(pwd)) {
                    $scope.chk.checknull = false;
                    $scope.user.txtname = '';
                    $scope.user.pwdname = '';
                    console.log('null');
                } else {
                    $scope.chk.checknull = true;
                    console.log('ok');
                    $scope.showLoadingProperTimesRegter('กำลังตรวจสอบผู้ใช้งานอยู่ .');
                    getUserCheck(user, pwd, function (data) {
                      //alert(data.length);
                        if (data.length > 0) {
                            var x = 0;
                            var loopArray = function (arr) {
                                chkuser(x, function () {
                                    x++;
                                    if (x < arr.length) {
                                        loopArray(arr);
                                    } else {
                                        $scope.chk.check = true;
                                        Data.logonstatus = false;
                                        setTimeout(function () {
                                            $ionicLoading.hide();
                                            $scope.user.txtname = '';
                                            $scope.user.pwdname = '';
                                            $ionicHistory.nextViewOptions({
                                                disableBack: true
                                            });
                                            $state.go('app.browse', {}, {
                                                reload: true
                                            });
                                        }, 2000);
                                    }
                                });
                            };
                            loopArray(data);

                            function checkmatch(str) {
                                if (str) {
                                    if (str.match('M')) {
                                        return 3;
                                    } else if (str.match('U')) {
                                        return 2;
                                    } else {
                                        return 1;
                                    }
                                }
                            }

                            function chkuser(i, callback) {
                                $scope.showLoadingProperTimesRegter('กำลังตรวจสอบผู้ใช้งานอยู่ ..');
                                var dType = checkmatch(data[i].ivz_name);
                                Data.mastertype = checkmatch(data[i].ivz_name);
                                if (dType == 3 || dType == 2) {
                                    Data.logontype = true;
                                } else {
                                    Data.logontype = false;
                                }
                                try {
                                    var d = new Date();
                                    var exp = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1);//set 24 hour
                                    $cookies.put('mastertype', checkmatch(data[i].ivz_name), {'expires': exp});
                                    Data.Empid = data[i].ivz_empid;
                                    Data.Tername = data[i].ivz_name;
                                    Data.termas = data[i].territoryid;
                                    $cookies.put('territoryid', data[i].territoryid, {'expires': exp});
                                    $cookies.put('ivz_empname', data[i].ivz_empname, {'expires': exp});
                                    $cookies.put('ivz_empid', data[i].ivz_empid, {'expires': exp});
                                    $cookies.put('ivz_password', data[i].ivz_password, {'expires': exp});
                                    $cookies.put('ivz_emailcontact', data[i].ivz_emailcontact, {'expires': exp});
                                    $cookies.put('ivz_leadermail', data[i].ivz_leadermail, {'expires': exp});
                                    $cookies.put('ivz_ccmail', data[i].ivz_ccmail, {'expires': exp});
                                    $cookies.put('name', data[i].ivz_name, {'expires': exp});
                                    $cookies.put('description', data[i].ter_description, {'expires': exp});
                                    $cookies.put('ivz_statusempid', data[i].ivz_statusempid, {'expires': exp});
                                    getCountry(function(data){
                                      $cookies.put('countryid', data[i].ivz_addresscountryid, {'expires': exp});
                                      $cookies.put('countryname', data[i].ivz_name, {'expires': exp});
                                    });
                                    datauser.territoryid = data[i].territoryid;
                                    datauser.ivz_empname = data[i].ivz_empname;
                                    datauser.ivz_empid = data[i].ivz_empid;
                                    datauser.ivz_password = data[i].ivz_password;
                                    datauser.ivz_emailcontact = data[i].ivz_emailcontact;
                                    datauser.ivz_leadermail = data[i].ivz_leadermail;
                                    datauser.ivz_ccmail = data[i].ivz_ccmail;
                                    datauser.name = data[i].ivz_name;
                                    datauser.description = data[i].ter_description;
                                    datauser.ivz_statusempid = data[i].ivz_statusempid;
                                } catch (er) {
                                    alert('error logon ' + er);
                                }
                                setTimeout(function () {
                                    $ionicLoading.hide();
                                    $scope.showLoadingProperTimesRegter('กำลังตรวจสอบผู้ใช้งานอยู่ ...');
                                    callback();
                                }, 2000);
                            }
                        } else {
                            $scope.chk.check = false;
                            $ionicLoading.hide();
                        }
                        if($scope.$phase){$scope.$apply();}
                    });
                }
            }
        }
    })
    /*--------------------------------------------*/

.controller('ProfileCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, datauser, $ionicScrollDelegate, $ionicModal)  {
        $scope.Data = Data;
        Data.showcart = false;
        $state.reload();
        $ionicHistory.clearHistory();
        $scope.user = {
            territoryid: $cookies.get('territoryid'),
            ivz_empname: $cookies.get('ivz_empname'),
            ivz_empid: $cookies.get('ivz_empid'),
            ivz_password: $cookies.get('ivz_password'),
            ivz_emailcontact: $cookies.get('ivz_emailcontact'),
            ivz_leadermail: $cookies.get('ivz_leadermail'),
            ivz_ccmail: $cookies.get('ivz_ccmail'),
            name: $cookies.get('name'),
            description: $cookies.get('description'),
            ivz_statusempid: $cookies.get('ivz_statusempid'),
            masterterid:returnmastername($cookies.get('territoryid')),
            passwd:'',
            passwd1:'',
            passwd2:''
        };
        $scope.setdivname = function(ttrue){
          console.log(ttrue +'::'+!(ttrue));
          $scope.user.divname = !(ttrue);
          switch (ttrue) {
            case false:
              console.log('update name');
              break;
            default:

          }
        }
        $scope.callfile = function(){
          alert('ขอ อภัย ขณะนี้อยู่ในช่วงการปรับปรุงข้อมูล');
          //$('#idfile').trigger('click');
        }
        $scope.$on('$ionicView.enter',function(){
          try{
            var n = new MobileCRM.FetchXml.Entity('annotation');
                n.addAttribute('annotationid');//0
                n.addAttribute('filename');//1
                n.addAttribute('subject');//2
                n.addAttribute('objectid');//3
                n.addAttribute('notetext');//4
                n.addAttribute('createdon');//5
                n.orderBy("createdon", true);
            var filter = new MobileCRM.FetchXml.Filter();
                filter.where('objectid','eq',returnmastername($cookies.get('territoryid')));
                n.filter = filter;
            var fetch = new MobileCRM.FetchXml.Fetch(n,100000,1);
                fetch.execute('array',function(data){
                  if(data.length > 0){
                    $('#imgAvator').attr('src',GetDocBody(data[0][0]));
                  }else{
                    $('#imgAvator').attr('src','img/d06.png');
                  }
              },function(er){alert(er);},null);
          }catch(er){
            alert('error get annote '+er);
          }


          $('#idfile').change(function(){
            $scope.showLoading('กำลังเปลี่ยนข้อมูลรูปภาพ');
            GetAtt('#idfile', '', 'canvas01', function (databs64) {
              if(databs64){
                try{
                  var n = new MobileCRM.FetchXml.Entity('annotation');
                			n.addAttribute('annotationid');//0
                			n.addAttribute('filename');//1
                			n.addAttribute('subject');//2
                			n.addAttribute('objectid');//3
                			n.addAttribute('notetext');//4
                			n.addAttribute('createdon');//5
                			n.orderBy("createdon", true);
                	var filter = new MobileCRM.FetchXml.Filter();
                			filter.where('objectid','eq',returnmastername($cookies.get('territoryid')));
                			n.filter = filter;
                	var fetch = new MobileCRM.FetchXml.Fetch(n,100000,1);
                			fetch.execute('array',function(data){
                        if(data.length > 0){
                          $scope.InAnnoteAttractUpdate('ivz_territorymaster', returnmastername(data[0][0]), databs64, 'รูปโปรไฟล์ของพนักงานขาย', 9, function(){
                            var img = "data:image/jpeg;base64,"+databs64;
                            $('#imgAvator').attr('src',img);
                            setTimeout(function(){
                              $ionicLoading.hide();
                            },2000);
                          });
                        }else{
                          //alert('$scope.user.masterterid:'+returnmastername($cookies.get('territoryid')));
                          $scope.user.avator = data;
                          $scope.InAnnoteAttract('ivz_territorymaster', returnmastername($cookies.get('territoryid')), databs64, 'รูปโปรไฟล์ของพนักงานขาย', 9, function(){
                            var img = "data:image/jpeg;base64,"+databs64;
                            $('#imgAvator').attr('src',img);
                            setTimeout(function(){
                              $ionicLoading.hide();
                            },2000);
                          });
                        }
                		},function(er){alert(er);},null);
                }catch(er){
                  alert('error get annote '+er);
                }
              }
            });
          });
        });
        $scope.nextgender = function(){
          $state.go('app.editprofile',{ masterterid:$cookies.get('territoryid'),
                                        txtname:$cookies.get('ivz_empname'),
                                        txtempid:$cookies.get('ivz_empid'),
                                        txtemail:$cookies.get('ivz_emailcontact')},{reload:true});
        }
        $ionicModal.fromTemplateUrl('templates/comment/changepwd.html', {
            id: 1,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal1 = modal;
        });
        $scope.opensearch = function(){
          $scope.modal1.show();
        }
        $scope.closeModal = function(){
          $scope.modal1.hide();
        }
        $scope.cChangePwd = function(pwd,pwd1,pwd2){
          var tpwd = pwd+pwd1+pwd2;
          if(pwd && pwd1 && pwd2){
            if(pwd == $cookies.get('ivz_password')){
              if(pwd1 == pwd2){
                try {
                  var ins = new MobileCRM.DynamicEntity('territory',$scope.user.territoryid);
                      ins.properties.ivz_password = pwd1;
                      ins.save(function(er){
                        if(er){
                          alert('error ch 530 '+er);
                        }else{
                          $scope.closeModal();
                        }
                      });
                } catch (err) {
                  alert('error changer pwd 537 '+err);
                }
              }else{
                alert('กรอกรหัสผ่านใหม่ให้ตรงกันด้วย');
              }
            }else{
              alert('กรุณากรอกรหัสผ่านเดิมให้ถูกต้องด้วย');
            }
          }else{
            alert('กรุณากรอกข้อมูลให้ครบด้วย');
          }
        }
    })
    .controller('LogoutCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.showLoadingProperTimesRegter('กำลังออกจากระบบ');
        $scope.Data = Data;

        Data.logonstatus = true;
        Data.logontype = true;
        Data.mastertype = '';
        Data.Empid = '';
        Data.Tername = '';
        Data.termas = '';
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $cookies.remove('territoryid');
        $cookies.remove('ivz_empname');
        $cookies.remove('ivz_empid');
        $cookies.remove('ivz_password');
        $cookies.remove('ivz_emailcontact');
        $cookies.remove('ivz_leadermail');
        $cookies.remove('ivz_ccmail');
        $cookies.remove('name');
        $cookies.remove('description');
        $cookies.remove('ivz_statusempid');
        $cookies.remove('mastertype');
        $cookies.remove('countryid');
        $cookies.remove('countryname');
        setTimeout(function () {
            $ionicLoading.hide();
            $state.go('app.playlists', {}, {
                reload: true
            });
        }, 3000);
    })
    ////////////// Calendar ///////////////////////////
    .controller('PlanCtrl', function ($scope, $stateParams, $cookies, $location, Data, $state, $ionicLoading) {
        $state.reload();
        $scope.Data = Data;
        //alert($stateParams.sterritory);
        Data.termas = $stateParams.sterritory;
        Data.showcart = false;
        $scope.dvTodos = true;
        $scope.$on('$ionicView.enter',function(){
          // var todos = $scope.todos;
          // if(todos.length < 1){
          //   $scope.reloaddata(0);
          // }
          $scope.reloaddata(0);
        });
        $scope.reloaddata = function (sid) {
            // GetAppointStatus($stateParams.sterritory, parseInt(sid),retername($cookies.get('mastertype')), function (data) {
            //alert($cookies.get('territoryid')+':'+parseInt(sid)+':'+Data.mastertype);
            GetAppointStatus($cookies.get('territoryid'), parseInt(sid),retername($cookies.get('mastertype')), function (data) {
              //alert(data.length);
                if (data.length > 0) {
                    $scope.dvTodos = false;
                    $scope.todos = [];
                    var x = 0;
                    var loopArray = function(arr){
                      getPush(x,function(){
                        x++;
                        if(x < arr.length){
                          loopArray(arr);
                        }else{
                          $ionicLoading.hide();
                        }
                      });
                    }
                    loopArray(data);
                    function getPush(i,callback){
                      $scope.showLoading('กำลังโหลดข้อมูล '+data[i].title);
                      $scope.todos.push({
                          activityid: data[i].activityid,
                          ivz_customer: data[i].ivz_customer,
                          ivz_territoryid: data[i].ivz_territoryid,
                          ivz_empid: data[i].ivz_empid,
                          start:new Date(data[i].start),
                          end: new Date(data[i].end),
                          ivz_saleprospect: data[i].ivz_saleprospect,
                          title: data[i].title,
                          ivz_visit: data[i].ivz_visit,
                          ivz_visitbilling: data[i].ivz_visitbilling,
                          ivz_visitclaimorder: data[i].ivz_visitclaimorder,
                          ivz_visitcollection: data[i].ivz_visitcollection,
                          ivz_visitopenaccount: data[i].ivz_visitopenaccount,
                          ivz_visitorder: data[i].ivz_visitorder,
                          ivz_visitadjustment: data[i].ivz_visitadjustment,
                          ivz_visitcompetitors: data[i].ivz_visitcompetitors,
                          ivz_visitmarket: data[i].ivz_visitmarket,
                          ivz_visitpostpect: data[i].ivz_visitpostpect,
                          ivz_visitproductrecall: data[i].ivz_visitproductrecall,
                          ivz_visitactivities: data[i].ivz_visitactivities,
                          ivz_visitsuggest: data[i].ivz_visitsuggest,
                          ivz_employeeposition: data[i].ivz_employeeposition,
                          ivz_addressprovince: data[i].ivz_addressprovince,
                          ivz_addressdistrict: data[i].ivz_addressdistrict,
                          territoryid: data[i].territoryid,
                          accountnumber: data[i].accountnumber,
                          ivz_planningstatus: data[i].ivz_planningstatus,
                          ivz_emailcontact: data[i].ivz_emailcontact,
                          ivz_leadermail: data[i].ivz_leadermail,
                          ivz_ccmail: data[i].ivz_ccmail,
                          ivz_balancecredit: data[i].ivz_balancecredit,
                          filtername: data[i].filtername,
                          mailtomail: data[i].mailtomail,
                          ivz_scheduledstarttime: data[i].ivz_scheduledstarttime,
                          ivz_scheduledendtime: data[i].ivz_scheduledendtime
                      });
                      setTimeout(function(){
                        callback();
                      },0);
                    };
                } else {
                    $scope.dvTodos = true;
                }
                if($scope.$phase){
                  $scope.$apply();
                }
            });
        }
        $scope.removeplanning = function (id,actid) {
            $scope.todos.splice(id, 1);
            try {
              MobileCRM.DynamicEntity.deleteById("appointment",actid,function () {
                //alert('delete ap:'+actid);
                $scope.reloaddata(0);
              },
                function (error) {
                  MobileCRM.bridge.alert("An error occurred: " + error);
                });
            } catch (e) {
              alert('error 1398 '+e);
            }
        }
        $scope.mailreport = function () {
          if($scope.todos.length > 0){
            $scope.showLoading('กำลังตรวจสอบข้อมูล');
              try {
                var x = 0;
                var loopArray = function(arr){
                  getInsert(x,function(){
                    x++;
                    if(x < arr.length){
                      loopArray(arr);
                    }else{
                      $scope.reloaddata(0);
                      $scope.sendmailtosup($cookies.get('territoryid'),'ขออนุมัติแผนการดำเนินงาน','',function(){
                        $ionicLoading.hide();
                      });
                    }
                  });
                }
                loopArray($scope.todos);
                function getInsert(i,callback){
                  var data = $scope.todos;
                      if (data[i].ivz_employeeposition == Data.mastertype) {
                          var ins = new MobileCRM.DynamicEntity('appointment', data[i].activityid);
                          ins.properties.ivz_planningstatus = parseInt(1);
                          ins.save(function (err) {
                              if (err) {
                                  alert("ex insert " + err);
                              }else{
                                callback()
                              }
                          });
                      }
                }

              } catch (er) {
                  alert(er);
              }
          }else{
            alert('ไม่พบข้อมูล');
          }
        }
    })
    .controller('Plan2Ctrl', function ($scope, $stateParams, $cookies, $location, Data) {
        $scope.Data = Data;
        Data.showcart = false;
        Data.mastertype = 2; //$stateParams.mastertype;
        Data.sterritory = $stateParams.sterritory;
        Data.nterritory = $stateParams.nterritory;
        Data.dirsale = false;
        if (Data.sterritory == '0' || Data.sterritory == 0) {
            Data.sterritory = '40791CA7-D5E1-E511-80E1-005056A71F87';
        }
        //alert('$stateParams.mastertype:'+$stateParams.mastertype);
        GetGPSLocation(function (res) {
            Data.latitude = res.latitude;
            Data.longitude = res.longitude;
        });
        $scope.dvTodos = true;
        GetAppointStatus(Data.sterritory, 0,retername($cookies.get('mastertype')), function (data) {
            if (data) {
                $scope.dvTodos = false;
                $scope.todos = data;
            } else {
                $scope.dvTodos = true;
            }
        });
        $scope.reloaddata = function () {
            GetAppointStatus(Data.sterritory, 0,retername($cookies.get('mastertype')), function (data) {
                if (data) {
                    $scope.dvTodos = false;
                    $scope.todos = [];
                    for (var i in data) {
                        $scope.todos.push({
                            activityid: data[i].activityid,
                            ivz_customer: data[i].ivz_customer,
                            ivz_territoryid: data[i].ivz_territoryid,
                            ivz_empid: data[i].ivz_empid,
                            start: data[i].start,
                            end: data[i].end,
                            ivz_saleprospect: data[i].ivz_saleprospect,
                            title: data[i].title,
                            ivz_visit: data[i].ivz_visit,
                            ivz_visitbilling: data[i].ivz_visitbilling,
                            ivz_visitclaimorder: data[i].ivz_visitclaimorder,
                            ivz_visitcollection: data[i].ivz_visitcollection,
                            ivz_visitopenaccount: data[i].ivz_visitopenaccount,
                            ivz_visitorder: data[i].ivz_visitorder,
                            ivz_visitadjustment: data[i].ivz_visitadjustment,
                            ivz_visitcompetitors: data[i].ivz_visitcompetitors,
                            ivz_visitmarket: data[i].ivz_visitmarket,
                            ivz_visitpostpect: data[i].ivz_visitpostpect,
                            ivz_visitproductrecall: data[i].ivz_visitproductrecall,
                            ivz_visitactivities: data[i].ivz_visitactivities,
                            ivz_visitsuggest: data[i].ivz_visitsuggest,
                            ivz_employeeposition: data[i].ivz_employeeposition,
                            ivz_addressprovince: data[i].ivz_addressprovince,
                            ivz_addressdistrict: data[i].ivz_addressdistrict,
                            territoryid: data[i].territoryid,
                            accountnumber: data[i].accountnumber,
                            ivz_planningstatus: data[i].ivz_planningstatus,
                            ivz_emailcontact: data[i].ivz_emailcontact,
                            ivz_leadermail: data[i].ivz_leadermail,
                            ivz_ccmail: data[i].ivz_ccmail,
                            ivz_balancecredit: data[i].ivz_balancecredit,
                            filtername: data[i].filtername,
                            mailtomail: data[i].mailtomail,
                            ivz_scheduledstarttime: data[i].ivz_scheduledstarttime,
                            ivz_scheduledendtime: data[i].ivz_scheduledendtime
                        });
                    }
                } else {
                    $scope.dvTodos = true;
                }
            });
        }
        $scope.removeplanning = function (index) {
            $scope.todos.splice(index, 1);
        }
        $scope.mailreport = function () {
            try {
                var data = $scope.todos;
                for (var i in data) {
                    var ins = new MobileCRM.DynamicEntity('appointment', data[i].activityid);
                    ins.properties.ivz_planningstatus = parseInt(1);
                    ins.save(function (err) {
                        if (err) {
                            alert("ex insert " + err);
                        }
                    });
                    if (i == data.length) {
                        $scope.reloaddata();
                        SendMail(Data.mailtomail, 'text title', 'text body');
                    }
                }
            } catch (er) {
                alert(er);
            }
        }
    })
    .controller('PlanCalendarCtrl', function ($scope, $stateParams, $cookies, Data,$state) {
        $state.reload();
        $scope.Data = Data;
        Data.showcart = false;
        $scope.listtypeaccount = [{id:0,name:'ลูกค้าค้างชำระ',link:''},{id:1,name:'ลูกค้าทั่วไป',link:''},{id:2,name:'ลูกค้าคาดหวัง',link:''}]
    })
    .controller('PlanListAccountCtrl', function ($scope, $stateParams, $cookies, Data,$state,$ionicLoading) {
        $state.reload();
        $scope.Data = Data;
        Data.showcart = false;
        $scope.arInvoice = true;
        $scope.arAccount = true;
        $scope.arPostpect = true;
        $scope.arLoading = false;
        $scope.filtertxt = '';
        $scope.Data = Data;
        $scope.accountype = $stateParams.accountype;
        $scope.numberOfItemsToDisplay = 20;
        $scope.loaddata = function(){
            $scope.todos = [];
            switch ($stateParams.accountype) {
              case '1':
                      Data.sBilling = 1;
                      Data.scollecttion = 1;
                      getInvoiceByAccountid(Data.termas, function (data) {
                          if(data.length > 0){
                            $scope.showLoading('กำลังโหลดข้อมูล');
                            $scope.arInvoice = false;
                            var x = 0;
                            var loopArray = function(arr){
                              getPush(x,function(){
                                x++;
                                if(x < arr.length){
                                  loopArray(arr);
                                }else{
                                  $ionicLoading.hide();
                                }
                              });
                            }
                            loopArray(data);
                            function getPush(i,callback){
                              // $scope.showLoading('กำลังโหลดข้อมูล '+data[i].filtername);
                              $scope.todos.push({
                                      ivz_invoicedate:data[i].ivz_invoicedate,
                                      invoicenumber:data[i].invoicenumber,
                                      customerid:data[i].customerid,
                                      territoryid:data[i].territoryid,
                                      accountnumber:data[i].accountnumber,
                                      ivz_addressprovince:data[i].ivz_addressprovince,
                                      ivz_addressdistrict:data[i].ivz_addressdistrict,
                                      filtername:data[i].filtername,
                                      accountype:1,
                                      avator:'img/avatar-5.png'
                                  });
                                  setTimeout(function(){
                                    callback();
                                  },0);
                            }
                          }
                          if($scope.$phase){
                            $scope.$apply();
                          }
                      });
                break;
              case '2':
                      Data.sBilling = 0;
                      Data.scollecttion = 0;
                      console.log('insert ค้นหาลูกค้าทั่วไป');
                      GetAccount(Data.termas,retername($cookies.get('mastertype')), 1, function (data) {
                          if(data.length > 0){
                            $scope.showLoading('กำลังโหลดข้อมูล');
                            $scope.arAccount = false;
                            var x = 0;
                            var loopArray = function(arr){
                              getPush(x,function(){
                                x++;
                                if(x < arr.length){
                                  loopArray(arr);
                                }else{
                                  $ionicLoading.hide();
                                }
                              });
                            }
                            loopArray(data);
                            function getPush(i,callback){
                              // $scope.showLoading('กำลังโหลดข้อมูล '+data[i].filtername);
                              $scope.todos.push({
                                    accountid:data[i].accountid,
                                    name:data[i].name,
                                    ivz_addresscountry:data[i].ivz_addresscountry,
                                    ivz_addressprovince:data[i].ivz_addressprovince,
                                    ivz_addressdistrict:data[i].ivz_addressdistrict,
                                    ivz_availablefromtime:data[i].ivz_availablefromtime,
                                    ivz_availabletotime:data[i].ivz_availabletotime,
                                    territoryid:data[i].territoryid,
                                    customertypecode:data[i].customertypecode,
                                    statuscode:data[i].statuscode,
                                    accountnumber:data[i].accountnumber,
                                    filtername:data[i].filtername,
                                    ivz_customer:data[i].ivz_customer,
                                    accountype:data[i].accountype,
                                    ivz_statuscomplete:data[i].ivz_statuscomplete,
                                    remarkreject:data[i].remarkreject,
                                    ivz_taxid:data[i].ivz_taxid,
                                    customertypecode:data[i].customertypecode,
                                    statustype:data[i].statustype,
                                    ivz_doc01:data[i].ivz_doc01,
                                    ivz_doc02:data[i].ivz_doc02,
                                    ivz_doc03:data[i].ivz_doc03,
                                    ivz_dochouseholdregis:data[i].ivz_dochouseholdregis,
                                    ivz_docidcard:data[i].ivz_docidcard,
                                    matchtype:data[i].matchtype,
                                    statusempid:data[i].statusempid,
                                    ivz_balancecredit:data[i].ivz_balancecredit,
                                    ivz_integrationid:data[i].ivz_integrationid,
                                    avator:'img/avatar-4.png'
                                  });
                                  setTimeout(function(){
                                    callback();
                                  },0);
                            }
                          }
                          if($scope.$phase){
                            $scope.$apply();
                          }
                      });
                break;
              case '3':
                      alert('ขอ อถัย ขณะนี้ยังอยู่ในขั้นตอนการเตรียมข้อมูล');
                      $scope.reback();
                break;
            }
        }
        $scope.loaddata();
    })
    .controller('PlanAccuntDetailCtrl', function ($scope, $stateParams, $cookies, Data, $ionicHistory, $state, $ionicLoading) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        Data.showcart = false;
        $scope.infoDate = true;
        $scope.infoTime = true;
        $scope.infoActivities = true;
        $scope.infoActivitiesSpe = true;
        $scope.user = {
            submissionDate: '',
            mStart:917970016,
            mEnd: 917970036,
            vOpenAccount: 0,
            vAdjustment: 0,
            vOpenOrder: 0,
            vOpenClaim: 0,
            vPostpect: 0,
            vComputitor: 0,
            vMarketSumu: 0,
            vConllecttion: Data.scollecttion,
            vProductRecall: 0,
            vBilling: Data.sBilling,
            vSuggust: 0
        };
        GetAvailablefromtime(function (data) {
            $scope.listtime = data;
        });
        GetActivities(function (data) {
            $scope.activities = data;
        });
        GetGPSLocation(function (res) {
            $scope.latitude = res.latitude;
            $scope.longitude = res.longitude;
        });
        $scope.accountid = $stateParams.accountid;
        $scope.accountname = $stateParams.accountname;
        $scope.accountype = $stateParams.accountype;
        $scope.proviceid = $stateParams.proviceid;
        $scope.districtid = $stateParams.districtid;
        $scope.territoryid = $stateParams.territoryid;
        if ($scope.accountname) {
            $scope.txtcustomer = $scope.accountname;
        }
        var bActivi = [];
        $scope.exActivities = function (ethis, gthis) {
            bActivi.push(ethis);
        }
        $scope.fnActivities = function (ethis) {
            alert($scope.proviceid);
        }
        $scope.cbnAppoint = function (accountid, accountname, accountype, proviceid, districtid, territoryid, latitude, longitude) {
            var gyuid = guid();
            var swToggleActivities = $('#swToggleActivities').hasClass('md-checked');
            console.log($scope.user.vConllecttion);
            if ($scope.user.submissionDate) {
                $scope.infoDate = true;
            } else {
                $scope.infoDate = false;
            };
            $scope.infoActivities = $('#swToggleActivities').hasClass('md-checked');
            if (swToggleActivities  === true) {
                console.log(bActivi.toString());
                if (accountype) {
                    try {
                        if (gyuid) {
                            var ins = new MobileCRM.DynamicEntity.createNew("appointment");
                            ins.properties.activityid = gyuid;
                            ins.properties.subject = accountname;
                            ins.properties.ivz_custname = accountname;
                            ins.properties.ivz_planningstatus = parseInt(0);
                            ins.properties.scheduledstart = new Date($scope.user.submissionDate);
                            ins.properties.scheduledend = new Date($scope.user.submissionDate);
                            ins.properties.ivz_scheduledstarttime = parseInt($scope.user.mStart);
                            ins.properties.ivz_scheduledendtime = parseInt($scope.user.mEnd);
                            ins.properties.ivz_visitdate = new Date($scope.user.submissionDate);
                            if (accountype == '1' || accountype == 1 || accountype == 2 || accountype == '2') {
                                ins.properties.ivz_customer = new MobileCRM.Reference('account', accountid);
                            } else {
                                ins.properties.ivz_saleprospect = new MobileCRM.Reference('ivz_saleprospect', accountid);
                            }
                            ins.properties.ivz_employeeposition = parseInt(retername($cookies.get('mastertype')));
                            ins.properties.ivz_visitopenaccount = parseInt($scope.user.vOpenAccount);
                            ins.properties.ivz_visitorder = parseInt($scope.user.vOpenOrder);
                            ins.properties.ivz_visitclaimorder = parseInt($scope.user.vOpenClaim);
                            ins.properties.ivz_visitadjustment = parseInt($scope.user.vAdjustment);
                            ins.properties.ivz_visitpostpect = parseInt($scope.user.vPostpect);
                            ins.properties.ivz_visitproductrecall = parseInt($scope.user.vProductRecall);
                            ins.properties.ivz_visitmarket = parseInt($scope.user.vMarketSumu);
                            ins.properties.ivz_visitcompetitors = parseInt($scope.user.vComputitor);
                            ins.properties.ivz_visitcollection = parseInt($scope.user.vConllecttion);
                            ins.properties.ivz_visitbilling = parseInt($scope.user.vBilling);
                            ins.properties.ivz_visitsuggest = parseInt($scope.user.vSuggust);
                            ins.properties.ivz_visitactivities = bActivi.toString();
                            ins.properties.ivz_empid = $cookies.get('ivz_empid');
                            ins.properties.location = latitude, longitude;
                            ins.properties.ivz_latilong = latitude, longitude;
                            ins.properties.ivz_state = new MobileCRM.Reference('ivz_addressprovince', proviceid);
                            ins.properties.ivz_city = new MobileCRM.Reference('ivz_addressdistrict', districtid);
                            ins.properties.ivz_territoryid = new MobileCRM.Reference('territory', $cookies.get('territoryid'));
                            // ins.properties.ivz_territoryid = new MobileCRM.Reference('territory', territoryid);
                            ins.save(function (err) {
                                if (err) {
                                    $scope.txerr = err;
                                    alert("exappointment " + err);
                                    // insertcodeex('เกิดข้อผิดพลาด exappointment', 'controller.js PlanAccuntDetailCtrl scope.cbnAppoint', 'บันทึกข้อมูล appointment account:' + accountname, '243', err, Data.masname, 1, function (data) {
                                    //     if (data) {
                                    //         alert("exappointment " + err);
                                    //     }
                                    // });
                                } else {
                                  alert("บันทึกข้อมูลเสร็จแล้ว");
                                  $ionicHistory.goBack(-1);
                                    // insertcodeex('บันทึกข้อมูล exappointment', 'controller.js PlanAccuntDetailCtrl scope.cbnAppoint', 'บันทึกข้อมูล appointment account:' + accountname, '243', 'ไม่พบข้อผิดพลาด', Data.masname, 0, function (data) {
                                    //     if (data) {
                                    //         alert("บันทึกข้อมูลเสร็จแล้ว");
                                    //         $ionicHistory.goBack(-1);
                                    //     }
                                    // });
                                }
                            });
                        } else {
                          alert('เกิดข้อผิดพลาดไม่พบ GUID กรุณาปิดแอพและเข้าสู่ระบบใหม่ครับ');
                            // insertcodeex('เกิดข้อผิดพลาดไม่พบ GUID', 'controller.js PlanAccuntDetailCtrl scope.cbnAppoint', 'บันทึกข้อมูล appointment account:' + accountname, '252', $scope.txerr, Data.masname, 1, function (data) {
                            //     if (data) {
                            //         alert('เกิดข้อผิดพลาดไม่พบ GUID กรุณาปิดแอพและเข้าสู่ระบบใหม่ครับ');
                            //     }
                            // });
                        }
                    } catch (er) {
                        alert('excbn02 ' + er);
                    }
                }
            }
        }
    })
    .controller('PlanSupCtrl', function ($scope, $stateParams, $cookies, Data ,$state , $ionicLoading) {
      $state.reload();
        $scope.Data = Data;
        Data.showcart = false;
        Data.mastertype = $stateParams.mastertype;
        // GetGPSLocation(function (res) {
        //     Data.latitude = res.latitude;
        //     Data.longitude = res.longitude;
        // });
        $scope.loaddata = function(){
          gettername($cookies.get('name'), function (data) {
            $scope.listmaster = [];
              if (data) {
                  var x = 0;
                  var loopArray = function (arr) {
                      getPush(x, function () {
                          x++;
                          if (x < arr.length) {
                              loopArray(arr);
                          } else {
                              $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                              setTimeout(function () {
                                  $ionicLoading.hide();
                              }, 2000);
                          }
                      });
                  }
                  loopArray(data);
                  function getPush(i, callback) {
                    //alert(data[i].description);
                      $scope.showLoading('โหลดข้อมูลเขตการขาย ' + data[i].description+' '+data[i].ivz_empname);
                      $scope.listmaster.push({
                          ivz_territorymasterid: data[i].ivz_territorymasterid,
                          ivz_mastername: data[i].ivz_mastername,
                          ivz_leftterritory: data[i].ivz_leftterritory,
                          ivz_emailcontact: data[i].ivz_emailcontact,
                          ivz_leadermail: data[i].ivz_leadermail,
                          ivz_ccmail: data[i].ivz_ccmail,
                          ivz_empid: data[i].ivz_empid,
                          ivz_empname: data[i].ivz_empname,
                          ivz_statusempid: data[i].ivz_statusempid,
                          description: data[i].description
                      });
                      setTimeout(function () {
                          callback();
                      }, 10);
                  }
              }
              if($scope.$phase){$scope.$apply();}
          });
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.loaddata();
        });
    })
    .controller('PlanSendPlanCtrl', function ($scope, $stateParams, $cookies, Data ,$state) {
      $state.reload();
        $scope.Data = Data;
        Data.showcart = false;
        Data.dirsale = false;
        Data.mastertype = 2;
        //alert('$stateParams.mastertype:'+$stateParams.mastertype);
    })
    .controller('PlanListMasterCtrl', function ($scope, $stateParams, $cookies, Data ,$state , $ionicLoading) {
        $state.reload();
        $scope.Data = Data;
        Data.showcart = false;
        Data.mastertype = $stateParams.mastertype;
        $scope.loaddata = function(){
          gettername($cookies.get('name'), function (data) {
            $scope.listmaster = [];
              if (data) {
                  var x = 0;
                  var loopArray = function (arr) {
                      getPush(x, function () {
                          x++;
                          if (x < arr.length) {
                              loopArray(arr);
                          } else {
                              $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                              setTimeout(function () {
                                  $ionicLoading.hide();
                              }, 2000);
                          }
                      });
                  }
                  loopArray(data);
                  function getPush(i, callback) {
                    //alert(data[i].description);
                      $scope.showLoading('โหลดข้อมูลเขตการขาย ' + data[i].description+' '+data[i].ivz_empname);
                      $scope.listmaster.push({
                          ivz_territorymasterid: data[i].ivz_territorymasterid,
                          ivz_mastername: data[i].ivz_mastername,
                          ivz_leftterritory: data[i].ivz_leftterritory,
                          ivz_emailcontact: data[i].ivz_emailcontact,
                          ivz_leadermail: data[i].ivz_leadermail,
                          ivz_ccmail: data[i].ivz_ccmail,
                          ivz_empid: data[i].ivz_empid,
                          ivz_empname: data[i].ivz_empname,
                          ivz_statusempid: data[i].ivz_statusempid,
                          description: data[i].description,
                          typego:$stateParams.typego
                      });
                      setTimeout(function () {
                          callback();
                      }, 10);
                  }
              }
              if($scope.$phase){$scope.$apply();}
          });
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.loaddata();
        });
        $scope.listgo = function(terid,mastertype,typego,tername){
          Data.tersupselect = terid;
          $state.go('app.listplanned',{mastertype:retername(tername)},{reload:true});
        }
    })
    .controller('PlanListDetailCtrl', function ($scope, $stateParams, $cookies, Data, $ionicHistory , $state , $ionicLoading) {
        $state.reload();
        $scope.Data = Data;
        Data.showcart = false;
        $scope.vCheckAll = 0;
        $scope.reloaddata = function(){
          //alert($stateParams.territoryid);
          $scope.listappointment = [];
          GetAppointStatus($stateParams.territoryid, 0, 1, function (data) {
            //alert(data.length);
            if(data.length > 0){
              var x = 0;
              var loopArray = function(arr){
                getPush(x,function(){
                  x++;
                  if(x < arr.length){
                    loopArray(arr);
                  }else{
                    $ionicLoading.hide();
                  }
                });
              }
              loopArray(data);
              function getPush(i,callback) {
                $scope.showLoading('กำลังโหลดข้อมูล' +data[i].title);
                  $scope.listappointment.push({
                      activityid: data[i].activityid,
                      ivz_customer: data[i].ivz_customer,
                      ivz_territoryid: data[i].ivz_territoryid,
                      ivz_empid: data[i].ivz_empid,
                      start: data[i].start,
                      end: data[i].end,
                      ivz_saleprospect: data[i].ivz_saleprospect,
                      title: data[i].title,
                      ivz_visit: data[i].ivz_visit,
                      ivz_visitbilling: data[i].ivz_visitbilling,
                      ivz_visitclaimorder: data[i].ivz_visitclaimorder,
                      ivz_visitcollection: data[i].ivz_visitcollection,
                      ivz_visitopenaccount: data[i].ivz_visitopenaccount,
                      ivz_visitorder: data[i].ivz_visitorder,
                      ivz_visitadjustment: data[i].ivz_visitadjustment,
                      ivz_visitcompetitors: data[i].ivz_visitcompetitors,
                      ivz_visitmarket: data[i].ivz_visitmarket,
                      ivz_visitpostpect: data[i].ivz_visitpostpect,
                      ivz_visitproductrecall: data[i].ivz_visitproductrecall,
                      ivz_visitactivities: data[i].ivz_visitactivities,
                      ivz_visitsuggest: data[i].ivz_visitsuggest,
                      ivz_employeeposition: data[i].ivz_employeeposition,
                      ivz_addressprovince: data[i].ivz_addressprovince,
                      ivz_addressdistrict: data[i].ivz_addressdistrict,
                      territoryid: data[i].territoryid,
                      accountnumber: data[i].accountnumber,
                      ivz_planningstatus: data[i].ivz_planningstatus,
                      ivz_emailcontact: data[i].ivz_emailcontact,
                      ivz_leadermail: data[i].ivz_leadermail,
                      ivz_ccmail: data[i].ivz_ccmail,
                      ivz_balancecredit: data[i].ivz_balancecredit,
                      filtername: data[i].filtername,
                      mailtomail: data[i].mailtomail,
                      ivz_scheduledstarttime: data[i].ivz_scheduledstarttime,
                      ivz_scheduledendtime: data[i].ivz_scheduledendtime
                  });
                  setTimeout(function(){
                    callback();
                  },100);
              }
            }
            if($scope.$phase){
              $scope.$apply();
            }
          });
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.reloaddata();
        });
        $scope.removeplanning = function (id) {
            $scope.listappointment.splice(id, 1);
        }
        $scope.confirmcopy = function () {
            var data = $scope.listappointment;
            for (var i in data) {
                var guidfor = guid();
                try {
                    var ins = new MobileCRM.DynamicEntity.createNew("appointment");
                    ins.properties.activityid = guidfor;
                    ins.properties.subject = data[i].title;
                    ins.properties.ivz_custname = data[i].title;
                    ins.properties.ivz_planningstatus = parseInt(0);
                    ins.properties.scheduledstart = new Date(data[i].start);
                    ins.properties.scheduledend = new Date(data[i].end);
                    ins.properties.ivz_scheduledstarttime = parseInt(data[i].ivz_scheduledstarttime);
                    ins.properties.ivz_scheduledendtime = parseInt(data[i].ivz_scheduledendtime);
                    ins.properties.ivz_visitdate = new Date(data[i].start);
                    if (data[i].ivz_customer) {
                        ins.properties.ivz_customer = new MobileCRM.Reference('account', data[i].ivz_customer.id);
                    } else if (data[i].ivz_saleprospect) {
                        ins.properties.ivz_saleprospect = new MobileCRM.Reference('ivz_saleprospect', data[i].ivz_saleprospect.id);
                    }
                    //  ins.properties.ivz_employeeposition = parseInt(Data.mastertype);
                    ins.properties.ivz_employeeposition = parseInt(Data.mastertype);
                    ins.properties.ivz_visitopenaccount = parseInt(CtoNum(data[i].ivz_visitopenaccount));
                    ins.properties.ivz_visitorder = parseInt(CtoNum(data[i].ivz_visitorder));
                    ins.properties.ivz_visitclaimorder = parseInt(CtoNum(data[i].ivz_visitclaimorder));
                    ins.properties.ivz_visitadjustment = parseInt(CtoNum(data[i].ivz_visitadjustment));
                    ins.properties.ivz_visitpostpect = parseInt(CtoNum(data[i].ivz_visitpostpect));
                    ins.properties.ivz_visitproductrecall = parseInt(CtoNum(data[i].ivz_visitproductrecall));
                    ins.properties.ivz_visitmarket = parseInt(CtoNum(data[i].ivz_visitmarket));
                    ins.properties.ivz_visitcompetitors = parseInt(CtoNum(data[i].ivz_visitcompetitors));
                    ins.properties.ivz_visitcollection = parseInt(CtoNum(data[i].ivz_visitcollection));
                    ins.properties.ivz_visitbilling = parseInt(CtoNum(data[i].ivz_visitbilling));
                    ins.properties.ivz_visitsuggest = parseInt(CtoNum(data[i].ivz_visitsuggest));
                    ins.properties.ivz_visitactivities = data[i].ivz_visitactivities;
                    ins.properties.ivz_empid = Data.Empid;
                    ins.properties.location = Data.latitude, Data.longitude;
                    ins.properties.ivz_latilong = Data.latitude, Data.longitude;
                    ins.properties.ivz_state = new MobileCRM.Reference('ivz_addressprovince', data[i].ivz_addressprovince.id);
                    ins.properties.ivz_city = new MobileCRM.Reference('ivz_addressdistrict', data[i].ivz_addressdistrict.id);
                    ins.properties.ivz_territoryid = new MobileCRM.Reference('territory', $cookies.get('territoryid').trim());
                    //ins.properties.ivz_territoryid = new MobileCRM.Reference('territory', data[i].territoryid.id);
                    ins.save(function (err) {
                        if (err) {
                            alert('เกิดข้อผิดพลาดในการคัดลอกแผนการดำเนินงาน ' + err);
                        }
                    });
                } catch (er) {
                    alert('เกิดข้อผิดพลาดในการคัดลอกแผนการดำเนินงาน ' + er);
                }
            }
            setTimeout(function () {
                $ionicHistory.goBack(-1);
            }, 3000);
        }
        $scope.cancelcp = function () {
            $ionicHistory.goBack(-1);
        }
    })
    .controller('PlanSendSupCtrl', function ($scope, $stateParams, $cookies, Data, $ionicHistory) {
        $scope.Data = Data;
        Data.showcart = false;
        Data.mastertype = $stateParams.mastertype;
        $scope.vCheckAll = 0;
        // if(Data.mastertype == 1 || Data.mastertype == '1'){
        //   Data.dirsale = false;
        // }else if(Data.mastertype == 2 || Data.mastertype == '2' || Data.mastertype == 3 || Data.mastertype == '3'){
        //   Data.dirsale = true;
        // }
        $scope.exprchk = function (ethis) {
            console.log(ethis);
        }
        $scope.reloaddata = function () {

        }
        $scope.confirmcopy = function () {
            $ionicHistory.goBack(-1);
        }
        $scope.cancelcp = function () {
            $ionicHistory.goBack(-1);
        }
    })
    .controller('PlanApproveSupCtrl', function ($scope, $stateParams, $cookies, Data,$state ,$ionicLoading) {
        $state.reload();
        $scope.Data = Data;
        Data.showcart = false;
        Data.mastertype = $stateParams.mastertype;
        $scope.vCheckAll = 0;
        $scope.loaddata = function(){
          gettername($cookies.get('name'), function (data) {
            $scope.listmaster = [];
              if (data) {
                  var x = 0;
                  var loopArray = function (arr) {
                      getPush(x, function () {
                          x++;
                          if (x < arr.length) {
                              loopArray(arr);
                          } else {
                              $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                              setTimeout(function () {
                                  $ionicLoading.hide();
                              }, 2000);
                          }
                      });
                  }
                  loopArray(data);
                  function getPush(i, callback) {
                    //alert(data[i].description);
                      $scope.showLoading('โหลดข้อมูลเขตการขาย ' + data[i].description+' '+data[i].ivz_empname);
                      $scope.listmaster.push({
                          ivz_territorymasterid: data[i].ivz_territorymasterid,
                          ivz_mastername: data[i].ivz_mastername,
                          ivz_leftterritory: data[i].ivz_leftterritory,
                          ivz_emailcontact: data[i].ivz_emailcontact,
                          ivz_leadermail: data[i].ivz_leadermail,
                          ivz_ccmail: data[i].ivz_ccmail,
                          ivz_empid: data[i].ivz_empid,
                          ivz_empname: data[i].ivz_empname,
                          ivz_statusempid: data[i].ivz_statusempid,
                          description: data[i].description
                      });
                      setTimeout(function () {
                          callback();
                      }, 10);
                  }
              }
              if($scope.$phase){$scope.$apply();}
          });
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.loaddata();
        });
    })
    .controller('PlanListApproveCtrl', function ($scope, $stateParams, $cookies, Data, $ionicHistory, $state,$ionicLoading) {
        $state.reload();
        $scope.Data = Data;
        Data.showcart = false;
        Data.sterritory = $stateParams.territoryid;
        $scope.vCheckAll = 0;
        // $scope.reloaddata();
        function getretype(tyid){
          var p = parseInt(tyid)
          switch (p) {
            case 2:
                      return 1;
              break;
            case 3:
                      return 2;
              break;
            default:
                      return 1;
          }
        }
        $scope.reloaddata = function () {
            GetAppointStatus($stateParams.territoryid, 1, getretype($cookies.get('mastertype')), function (data) {
              //alert(data.length);
              //alert($stateParams.territoryid+'::'+data.length);
                $scope.listappointment = [];
                if(data.length > 0){
                  var x = 0;
                  var loopArray = function(arr){
                    getPush(x,function(){
                      x++;
                      if(x < arr.length){
                        loopArray(arr);
                      }else{
                        $ionicLoading.hide();
                      }
                    });
                  }
                  loopArray(data);
                  function getPush(i,callback){
                    $scope.showLoading('กำลังโหลดข้อมูล '+data[i].filtername);
                    $scope.listappointment.push({
                        activityid: data[i].activityid,
                        ivz_customer: data[i].ivz_customer,
                        ivz_territoryid: data[i].ivz_territoryid,
                        ivz_empid: data[i].ivz_empid,
                        start: data[i].start,
                        end: data[i].end,
                        ivz_saleprospect: data[i].ivz_saleprospect,
                        title: data[i].title,
                        ivz_visit: data[i].ivz_visit,
                        ivz_visitbilling: data[i].ivz_visitbilling,
                        ivz_visitclaimorder: data[i].ivz_visitclaimorder,
                        ivz_visitcollection: data[i].ivz_visitcollection,
                        ivz_visitopenaccount: data[i].ivz_visitopenaccount,
                        ivz_visitorder: data[i].ivz_visitorder,
                        ivz_visitadjustment: data[i].ivz_visitadjustment,
                        ivz_visitcompetitors: data[i].ivz_visitcompetitors,
                        ivz_visitmarket: data[i].ivz_visitmarket,
                        ivz_visitpostpect: data[i].ivz_visitpostpect,
                        ivz_visitproductrecall: data[i].ivz_visitproductrecall,
                        ivz_visitactivities: data[i].ivz_visitactivities,
                        ivz_visitsuggest: data[i].ivz_visitsuggest,
                        ivz_employeeposition: data[i].ivz_employeeposition,
                        ivz_addressprovince: data[i].ivz_addressprovince,
                        ivz_addressdistrict: data[i].ivz_addressdistrict,
                        territoryid: data[i].territoryid,
                        accountnumber: data[i].accountnumber,
                        ivz_planningstatus: data[i].ivz_planningstatus,
                        ivz_emailcontact: data[i].ivz_emailcontact,
                        ivz_leadermail: data[i].ivz_leadermail,
                        ivz_ccmail: data[i].ivz_ccmail,
                        ivz_balancecredit: data[i].ivz_balancecredit,
                        filtername: data[i].filtername,
                        mailtomail: data[i].mailtomail,
                        ivz_scheduledstarttime: data[i].ivz_scheduledstarttime,
                        ivz_scheduledendtime: data[i].ivz_scheduledendtime
                    });
                    setTimeout(function(){
                      callback();
                    },5);
                  }
                }
                if($scope.$phase){$scope.$apply();}
            });
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.reloaddata();
        });
        $scope.removeplanning = function (index) {
            $scope.listappointment.splice(index, 1);
        }
        $scope.cancelcp = function () {
            $ionicHistory.goBack(-1);
        }
        $scope.confirmcopy = function () {
            if($scope.listappointment){
              var data = $scope.listappointment;
              var x = 0;
              var loopArray = function(arr){
                getIns(x,function(){
                  x++;
                  if(x < arr.length){
                    loopArray(arr);
                  }else{
                    console.log('complete');
                    $scope.reloaddata();
                    $ionicLoading.hide();
                    //var lenList = $scope.listappointment;
                  }
                });
              }
              loopArray(data);
              function getIns(i,callback){
                $scope.showLoading('กำลังบันทึกข้อมูล');
                try {
                        var ins = new MobileCRM.DynamicEntity('appointment', data[i].activityid);
                        ins.properties.ivz_planningstatus = parseInt(2);
                        ins.save(function (er) {
                            if (er) {
                                alert(er);
                            }else{
                              setTimeout(function () {
                                  callback();
                              }, 500);
                            }
                        });
                    } catch (er) {
                        alert("เกิดข้อผิดพลาดรหัส 695 " + er);
                    }
              }
            }
        }
        $scope.rejectplan = function () {
          if($scope.listappointment){
            Data.DataList = $scope.listappointment;
            window.location.href = "#/app/rejectplan/" + $stateParams.territoryid + "/" + $stateParams.salename + "/" + $stateParams.tername;
          }
        }
    })
    .controller('PlanRejectCtrl', function ($scope, $stateParams, $cookies, Data, $rootScope, $ionicHistory,$state,$ionicLoading) {
        $state.reload();
        $scope.Data = Data;
        Data.showcart = false;
        $scope.territoryid = $stateParams.territoryid;
        $scope.salename = $stateParams.salename;
        $scope.tername = $stateParams.tername;
        $scope.reject = {
            txtreject: ''
        };
        $scope.hidden = true;
        $scope.cancelcp = function () {
            $ionicHistory.goBack(-1);
        }
        $scope.confirmplan = function () {
            var txtreject = $scope.reject.txtreject;
            if ($scope.reject.txtreject) {
                $scope.hidden = true;
                var data = Data.DataList;
                var x = 0;
                var loopArray = function(arr){
                  getReject(x,function(){
                    x++;
                    if(x < arr.length){
                      loopArray(arr);
                    }else{
                      $scope.sendmailtosales($stateParams.territoryid,'ไม่อนุมัติแผนการดำเนินงาน','ไม่สามารถอนุมัติแผนการดำเนินงานได้เนื่องจาก'+$scope.reject.txtreject,function(){
                        setTimeout(function () {
                            $scope.reback();
                            $ionicLoading.hide();
                        }, 3000);
                      });
                    }
                  });
                }
                loopArray(data);
                function getReject(i,callback){
                  $scope.showLoading('กำลังบันทึกข้อมูล');
                  try {
                          var ins = new MobileCRM.DynamicEntity('appointment', data[i].activityid);
                          ins.properties.ivz_planningstatus = parseInt(3);
                          ins.properties.ivz_txtremark = $scope.reject.txtreject;
                          ins.save(function (er) {
                              if (er) {
                                  alert(er);
                              }else{
                                callback();
                              }
                          });
                      } catch (er) {
                          alert("เกิดข้อผิดพลาดรหัส 708 " + er);
                      }
                }
            } else {
                $scope.hidden = false;
                console.log(txtreject.length);
            }
        }
    })
    ////////////////// End //////////////////////
    /////////////////// Planned ///////////////////
    .controller('PlanedCtrl', function ($scope, $stateParams, $cookies, Data) {
        $scope.Data = Data;
        Data.showcart = false;
        Data.mastertype = $stateParams.mastertype;
        //$stateParams.accountid;
    })
    .controller('PlanedListCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal) {
        $state.reload();
        $scope.Data = Data;
        Data.showcart = false;
        $scope.mastertype = $stateParams.mastertype;
        $scope.territoryid = '';
        if(Data.tersupselect){
          $scope.territoryid = Data.tersupselect;
        }else{
          $scope.territoryid = Data.termas;
        }
        $scope.filtertxt = '';
        $scope.user = {
          cards:true,
          checkaccount:true
        }
        $scope.$on('$ionicView.enter',function(){
            $scope.listaccount = [];
            $scope.loadprocress($stateParams.retype);
        });
        $scope.loadprocress = function(id){
          if(id){
            var num = parseInt(id);
            //$scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
            switch (num) {
              case 1:
                $scope.user.checkaccount = true;
                $scope.loadplaned($stateParams.mastertype);
                break;
              case 2:
                $scope.user.checkaccount = true;
                $scope.loadinvoice();
                break;
              case 3:
                $scope.user.checkaccount = true;
                $scope.loaddata();
                // $scope.user.checkaccount = false;
                // $scope.loadpostpect();
                break;
              default:
                $scope.user.checkaccount = true;
                $scope.loadplaned($stateParams.mastertype);
                break;
            }
          }else{
            $scope.user.checkaccount = true;
            $scope.loadplaned($stateParams.mastertype);
          }
        }
        $scope.loadplaned = function(itype){
          GetAppointStatus($scope.territoryid, 2, itype, function (data) {
            //alert(data.length);
              if(data.length > 0){
                $scope.listaccount = [];
                $scope.user.cards = false;
                $scope.showLoading('กำลังโหลดข้อมูล');
                var x = 0;
                var loopArray = function(arr){
                  getPush(x,function(){
                    x++;
                    if(x < arr.length){
                      loopArray(arr);
                    }else{
                      $ionicLoading.hide();
                    }
                  });
                }
                loopArray(data);
                function getPush(i,callback){
                  $scope.showLoading('กำลังโหลดข้อมูล '+data[i].filtername);
                  $scope.listaccount.push({
                      activityid: data[i].activityid,
                      ivz_customer: data[i].ivz_customer,
                      ivz_territoryid: data[i].ivz_territoryid,
                      ivz_empid: data[i].ivz_empid,
                      start: data[i].start,
                      end: data[i].end,
                      ivz_saleprospect: data[i].ivz_saleprospect,
                      title: data[i].title,
                      ivz_visit: data[i].ivz_visit,
                      ivz_visitbilling: data[i].ivz_visitbilling,
                      ivz_visitclaimorder: data[i].ivz_visitclaimorder,
                      ivz_visitcollection: data[i].ivz_visitcollection,
                      ivz_visitopenaccount: data[i].ivz_visitopenaccount,
                      ivz_visitorder: data[i].ivz_visitorder,
                      ivz_visitadjustment: data[i].ivz_visitadjustment,
                      ivz_visitcompetitors: data[i].ivz_visitcompetitors,
                      ivz_visitmarket: data[i].ivz_visitmarket,
                      ivz_visitpostpect: data[i].ivz_visitpostpect,
                      ivz_visitproductrecall: data[i].ivz_visitproductrecall,
                      ivz_visitactivities: data[i].ivz_visitactivities,
                      ivz_visitsuggest: data[i].ivz_visitsuggest,
                      ivz_employeeposition: data[i].ivz_employeeposition,
                      ivz_addressprovince: data[i].ivz_addressprovince,
                      ivz_addressdistrict: data[i].ivz_addressdistrict,
                      territoryid: data[i].territoryid,
                      accountnumber: data[i].accountnumber,
                      ivz_planningstatus: data[i].ivz_planningstatus,
                      ivz_emailcontact: data[i].ivz_emailcontact,
                      ivz_leadermail: data[i].ivz_leadermail,
                      ivz_ccmail: data[i].ivz_ccmail,
                      ivz_balancecredit: data[i].ivz_balancecredit,
                      filtername: data[i].filtername,
                      accountid:data[i].ivz_customer.id,
                      name:data[i].ivz_customer.primaryName,
                      ivz_taxid:data[i].ivz_taxid,
                      mailtomail: data[i].mailtomail,
                      ivz_scheduledstarttime: data[i].ivz_scheduledstarttime,
                      ivz_scheduledendtime: data[i].ivz_scheduledendtime,
                      avator:'img/avatar-6.png'
                  });
                  //filtername: data[i].filtername,
                  setTimeout(function(){
                    callback();
                  },0);
                }
              }
              if($scope.$phase){$scope.$apply();}
          });
        }
        $scope.loaddata = function(){
          GetAccount($scope.territoryid,retername($cookies.get('mastertype')), 1, function (data) {
              if (data) {
                $scope.listaccount = [];
                $scope.showLoading('กำลังโหลดข้อมูล');
                $scope.user.cards = false;
                  var x = 0;
                  var loopArray = function (arr) {
                      getPush(x, function () {
                          x++;
                          if (x < arr.length) {
                              loopArray(arr);
                          } else {
                              $ionicLoading.hide();
                          }
                      });
                  }
                  loopArray(data);
                  function getPush(i, callback) {
                      if (data[i].statuscode == 1 || data[i].statuscode == '1') {
                          //$scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล ' + data[i].filtername);
                          $scope.listaccount.push({
                              accountid: data[i].accountid,
                              name: data[i].name,
                              ivz_addresscountry: data[i].ivz_addresscountry,
                              ivz_addressprovince: data[i].ivz_addressprovince,
                              ivz_addressdistrict: data[i].ivz_addressdistrict,
                              ivz_availablefromtime: data[i].ivz_availablefromtime,
                              ivz_availabletotime: data[i].ivz_availabletotime,
                              territoryid: data[i].territoryid,
                              customertypecode: data[i].customertypecode,
                              statuscode: data[i].statuscode,
                              accountnumber: data[i].accountnumber,
                              filtername: data[i].filtername,
                              ivz_customer: data[i].ivz_customer,
                              accountype: data[i].accountype,
                              ivz_statuscomplete: data[i].ivz_statuscomplete,
                              remarkreject: data[i].remarkreject,
                              ivz_taxid: data[i].ivz_taxid,
                              customertypecode: data[i].customertypecode,
                              avator:'img/avatar-5.png'
                          });
                      }
                      setTimeout(function () {
                          callback();
                      }, 0);
                  };
              }
              if($scope.$phase){$scope.$apply();}
          });
        }
        $scope.loadinvoice = function(){
          GetAccountInvoice(Data.termas,function(data){
            //alert(data.length+'::'+Data.termas);
            if(data){
              $scope.listaccount = [];
              $scope.showLoading('กำลังโหลดข้อมูล');
              $scope.user.cards = false;
              var x = 0;
              var loopArray = function(arr){
                getPush(x,function(){
                  x++;
                  if(x < arr.length){
                    loopArray(arr);
                  }else{
                    $ionicLoading.hide();
                  }
                });
              }
              loopArray(data);
              function getPush(i,callback){
                    //$scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล ' + data[i].filtername);
                    if(data[i].statuscode == 1 || data[i].statuscode == '1'){
                      $scope.listaccount.push({
                            accountid:data[i].accountid,
                						name:data[i].name,
                						ivz_addresscountry:data[i].ivz_addresscountry,
                						ivz_addressprovince:data[i].ivz_addressprovince,
                						ivz_addressdistrict:data[i].ivz_addressdistrict,
                						ivz_availablefromtime:data[i].ivz_availablefromtime,
                						ivz_availabletotime:data[i].ivz_availabletotime,
                						territoryid:data[i].territoryid,
                						customertypecode:data[i].customertypecode,
                						statuscode:data[i].statuscode,
                						accountnumber:data[i].accountnumber,
                						filtername:data[i].filtername,
                						ivz_statuscomplete:data[i].ivz_statuscomplete,
                						ivz_remarkreject:data[i].ivz_remarkreject,
                						ivz_taxid:data[i].ivz_taxid,
                						customertypecode:data[i].customertypecode,
                						ivz_statustype:data[i].ivz_statustype,
                						ivz_doc01:data[i].ivz_doc01,
                						ivz_doc02:data[i].ivz_doc02,
                						ivz_doc03:data[i].ivz_doc03,
                						ivz_dochouseholdregis:data[i].ivz_dochouseholdregis,
                						ivz_docidcard:data[i].ivz_docidcard,
                						ivz_satatusempid:data[i].ivz_satatusempid,
                						creditlimit:data[i].creditlimit,
                						ivz_integrationid:data[i].ivz_integrationid,
                						ivz_billingnumber:data[i].ivz_billingnumber,
                						createdon:new Date(data[i].createdon),
                            avator:'img/avatar-4.png'
                      });
                    }
                setTimeout(function(){
                  callback();
                },10);
              }
            }
            if($scope.$phase){$scope.$apply();}
          });
        }
        $scope.loadpostpect = function(){
          GetPostpectByTer(Data.termas,function(data){
            if(data){
              $scope.listaccount = [];
              $scope.showLoading('กำลังโหลดข้อมูล');
              $scope.user.cards = false;
              var x = 0;
              var loopArray = function(arr){
                getPush(x,function(){
                  x++;
                  if(x < arr.length){
                    loopArray(arr);
                  }else{
                    $ionicLoading.hide();
                  }
                });
              }
              loopArray(data);
              function getPush(i,callback){
                    //$scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล ' + data[i].filtername);
                    $scope.listaccount.push({
                      ivz_saleprospectid:data[i].ivz_saleprospectid,
                      ivz_name:data[i].ivz_name,
                      accountid:data[i].ivz_saleprospectid,
                      filtername:data[i].ivz_name,
                      ivz_prospectgroup:data[i].ivz_prospectgroup,
                      ivz_prospectname:data[i].ivz_prospectname,
                      ivz_saledistict:data[i].ivz_saledistict,
                      ivz_saleprovinceid:data[i].ivz_saleprovinceid,
                      ivz_territory:data[i].ivz_territory,
                      ivz_taxid:'',
                      accountype:3,
                      avator:'img/avatar-3.png'
                    });
                setTimeout(function(){
                  callback();
                },10);
              }
            }
            if($scope.$phase){$scope.$apply();}
          });
        }
        //url:'/planneddetail/:mastertype/:accountid/:accountname/:terid/:province/:distid/:txtid',
        $scope.planeddetail = function(mastertype,accountid,accountname,terid,province,distid,txtid){
          // var txt = mastertype+'\n'+accountid+'\n'+accountname+'\n'+terid+'\n'+province+'\n'+distid+'\n'+txtid;
          // alert(txt);
          $state.go('app.planneddetail',{
                                        mastertype:mastertype,
                                        accountid:accountid,
                                        accountname:accountname,
                                        terid:terid,
                                        province:province,
                                        distid:distid,
                                        txtid:txtid
                                       },{
                                          reload:true
                                        });
        }

    })
    .controller('PlanedDetailCtrl', function ($scope, $stateParams, $cookies, Data, $ionicHistory, $ionicLoading, $state) {
        $scope.Data = Data;
        Data.showcart = false;
        Data.mastertype = $stateParams.mastertype;
        Data.getparaaccount = $stateParams.accountid;
        Data.getparaname = $stateParams.accountname;
        Data.gettxtid = $stateParams.txtid;
        var tct = $stateParams.txtid + '\n' +
            $stateParams.terid + '\n' +
            $stateParams.distid + '\n' +
            $stateParams.province;
        console.log(tct);
        var getduig = guid();

        $scope.listactivities = [
          {name:"เปิดบัญชีลูกค้าใหม่",idlnk:1,avator:"img/ionic.png"},
          {name:"แก้ไขข้อมูลลูกค้า",idlnk:2,avator:"img/ionic.png"},
          {name:"เปิดใบสั่งขาย",idlnk:3,avator:"img/ionic.png"},
          {name:"รับเคลมสินค้า",idlnk:4,avator:"img/ionic.png"},
          {name:"บันทึกลูกค้าค้าดหวัง",idlnk:5,avator:"img/ionic.png"},
          {name:"บันทึกคู่แข่ง",idlnk:7,avator:"img/ionic.png"},
          {name:"เก็บเงิน/วางบิล",idlnk:8,avator:"img/ionic.png"},
          {name:"บันทึกสภาพการตลาด",idlnk:12,avator:"img/ionic.png"},
          {name:"นำเสนอสินค้า",idlnk:11,avator:"img/ionic.png"},
          {name:"PRODUCT RECALL",idlnk:9,avator:"img/ionic.png"},
          {name:"กิจกรรมทางการตลาด",idlnk:10,avator:"img/ionic.png"}
        ]

        function insertactivities(type, statc, stata, typearr, callback) {
            try {
                var ins = MobileCRM.DynamicEntity.createNew("ivz_resultappoint");
                ins.properties.ivz_resultappointid = getduig;
                ins.properties.ivz_resultname = $stateParams.accountname;
                ins.properties.ivz_customer = new MobileCRM.Reference('account', $stateParams.accountid);
                if (type == 1 || type == '1') {
                    ins.properties.ivz_visit = parseInt(1);
                    ins.properties.ivz_visitopenaccount = parseInt(1);
                } else if (type == 2 || type == '2') {
                  ins.properties.ivz_visit = parseInt(1);
                    ins.properties.ivz_visitadjustment = parseInt(1);
                } else if (type == 3 || type == '3') {
                  ins.properties.ivz_visit = parseInt(1);
                    ins.properties.ivz_visitorder = parseInt(1);
                } else if (type == 4 || type == '4') {
                  ins.properties.ivz_visit = parseInt(1);
                    ins.properties.ivz_visitclaimorder = parseInt(1);
                } else if (type == 5 || type == '5') {
                  ins.properties.ivz_visit = parseInt(1);
                    ins.properties.ivz_visitpostpect = parseInt(1);
                } else if (type == 6 || type == '6') {
                    ins.properties.ivz_visit = parseInt(1);
                    ins.properties.ivz_visitmarket = parseInt(1);
                } else if (type == 7 || type == '7') {
                    ins.properties.ivz_visit = parseInt(1);
                    ins.properties.ivz_visitcompetitor = parseInt(1);
                } else if (type == 8 || type == '8') {
                    ins.properties.ivz_visit = parseInt(1);
                    ins.properties.ivz_visitbilling = parseInt(1);
                } else if (type == 9 || type == '9') {
                    ins.properties.ivz_visit = parseInt(1);
                    ins.properties.ivz_visitproductrecall = parseInt(1);
                } else if (type == 10 || type == '10') {
                    //ins.properties.ivz_visitactivities = typearr.toString();
                }
                ins.properties.ivz_latitude = Data.latitude;
                ins.properties.ivz_longtitude = Data.langtitude;
                ins.properties.ivz_shedulestart = new Date();
                ins.properties.ivz_sheduleend = new Date();
                ins.properties.ivz_resultstatus = parseInt(statc);
                ins.properties.ivz_statuscomplete = parseInt(stata);
                ins.properties.ivz_territory = new MobileCRM.Reference('territory', $stateParams.terid);
                ins.properties.ivz_addressdistrict = new MobileCRM.Reference('ivz_addressdistrict', $stateParams.distid);
                ins.properties.ivz_addressprovince = new MobileCRM.Reference('ivz_addressprovince', $stateParams.province);
                ins.properties.ivz_empid = Data.Empid;
                ins.save(function (er) {
                    if (er) {
                        alert(er);
                    } else {
                        callback();
                    }
                });
            } catch (er) {
                alert('error 846 ' + er);
            }
        }
        function aterwait(){
          alert('ขอ อภัย ในความไม่สะดวกขณะนี้ยังอยู่ในช่วงการพัฒนา');
        }

        $scope.goop = function (idval) {
            var guidreg = guid();
            var terriid = $cookies.get('territoryid'); //'6C791CA7-D5E1-E511-80E1-005056A71F87';
            if (idval == 1 || idval == '1') {
                console.log('insert visit openaccount');
                insertactivities(1, 0, 2, null, function () {
                    $state.go('app.openaccount', {
                        territoryid: Data.termas,
                        mastertype: Data.mastertype,
                        getguid: $stateParams.accountid,
                        pricelevel: Data.pricelevel,
                        transactioncurrency: Data.transactioncurrency
                    });
                });
            } else if (idval == 2 || idval == '2') {
                //var ins = new MobileCRM.DynamicEntity.createNew('ivz_result');
                console.log('insert visit adjustment');
                insertactivities(2, 0, 2, null, function () {
                  window.location.href = "#/app/adjustment/" + $stateParams.accountid + "/" + Data.mastertype;
                });
            } else if (idval == 3 || idval == '3') {
                console.log('insert activities');
                insertactivities(3, 0, 2, null, function () {
                    $state.go('app.order', {
                        accountid: $stateParams.accountid,
                        mastertype: Data.mastertype
                    }, {
                        reload: true
                    });
                  });
            } else if (idval == 4 || idval == '4') {
              aterwait();
                //var ins = new MobileCRM.DynamicEntity.createNew('ivz_result');
                //console.log('insert visit open claim');
            } else if (idval == 5 || idval == '5') {
              aterwait();
                //var ins = new MobileCRM.DynamicEntity.createNew('ivz_result');
                //console.log('insert visit open postpect');
            } else if (idval == 6 || idval == '6') {
              aterwait();
                //var ins = new MobileCRM.DynamicEntity.createNew('ivz_result');
                //console.log('insert visit open marketting');
            } else if (idval == 7 || idval == '7') {
              //aterwait();
                var ins = new MobileCRM.DynamicEntity.createNew('ivz_result');
                console.log('insert visit open computitor');
                insertactivities(7, 0, 2, null, function () {
                    $state.go('app.optioncomputitor',{
                      accountid:$stateParams.accountid,
                      accountiname:$stateParams.accountname
                    },{reload:true});
                  });
            } else if (idval == 8 || idval == '8') {
                console.log('insert visit open billing');
                insertactivities(8, 1, 2, null, function () {
                $state.go('app.billingcollectionoption',{
                                                    accountid: $stateParams.accountid,
                                                    mastertype: Data.mastertype,
                                                    retype:1,
                                                    terid:Data.termas,
                                                    accountname:$stateParams.accountname,
                                                    province:$stateParams.province,
                                                    distid:$stateParams.distid,
                                                    guip:getduig
                                                  },{reload:true});});
            } else if (idval == 9 || idval == '9') {
                //var ins = new MobileCRM.DynamicEntity.createNew('ivz_result');
                console.log('insert visit open product recall');
                aterwait();
            } else if (idval == 10 || idval == '10') {
              insertactivities(10, 0, 2, null, function () {
                $state.go('app.plannedactivities',{
                  accountid: $stateParams.accountid,
                  mastertype: Data.mastertype,
                  retype:1,
                  terid:Data.termas,
                  accountname:$stateParams.accountname,
                  province:$stateParams.province,
                  distid:$stateParams.distid
                },{reload:true});
              });
                console.log('insert visit 10');
            } else if (idval == 11 || idval == '11') {
              aterwait();
                //var ins = new MobileCRM.DynamicEntity.createNew('ivz_result');
                console.log('insert visit 11');
            }else if (idval == 12 || idval == '12') {
              //aterwait();
                //var ins = new MobileCRM.DynamicEntity.createNew('ivz_result');
                console.log('insert visit 12');
                $state.go('app.listmarketting',{
                  accountid: $stateParams.accountid,
                  mastertype: Data.mastertype,
                  terid:Data.termas,
                  accountname:$stateParams.accountname,
                  province:$stateParams.province,
                  distid:$stateParams.distid
                },{reload:true});
            } else {
              aterwait();
                console.log('insert ' + idval);
            }
        }
    })
    ///////////////////  End //////////////////////
    /*----------------- Billing and collect -------------------*/
    .controller('ListBillingAccountCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
      $state.reload();
      $scope.Data = Data;
      $scope.group = {
        billing:'',
        resultactivities:'',
        typebilling:''
      }
      $scope.user ={
        filedoc01:[],
        filedoc02:[],
        class:'shake',
        class01:'shake',
        class02:'shake',
        txtname:$stateParams.accountname,
        province:$stateParams.province,
        distid:$stateParams.distid,
        txtbilling:'',
        txttatol:0,
        txtdate:new Date(),
        txtcomment:'',
        selected:[]
      }
      $scope.$on('$ionicView.enter',function(){
        $scope.loadlink($stateParams.retype);
      });
      $scope.loadlink = function(id){
        $scope.showLoadingComplete('กำลังโหลดข้อมูล');
        switch (id) {
          case '0':
              $scope.loaddata();
              console.log('retype 0');
            break;
          case '1':
              $scope.reloadbilling();
              console.log('retype 1');
            break;
          default:

        }
        setTimeout(function(){
          $ionicLoading.hide();
        },1000);
      }
      $scope.loaddata = function(){
      }
      $scope.calldocfile = function(id,ethis){
        console.log(ethis);
        $(id).trigger('click');
      }
      /*------------------ begin img --------------------*/
      $('#filedoc01').change(function(){
        $scope.user.class = 'shake';
        $scope.user.class01 = 'shake';
        GetAtt('#filedoc01', '', 'canvas01', function (data) {
            $scope.user.filedoc01.push({id:$scope.group.billing,docfile:data,title:'แนบใบวางบิลที่ Sale เซ็น'});
            pushImg('imgdoc01');
        });
      });
      function pushImg(dClass){
        $('.divimg').remove();
        if($scope.user.filedoc01){
          for(var i in $scope.user.filedoc01){
            var html = '<div class="col col-20 divimg">' +
                '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc01[i].docfile + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
                '</div>';
            angular.element(document.getElementById(dClass)).append($compile(html)($scope));
          }
        }
      }
      $scope.removeimg = function(id){
        $scope.user.filedoc01.splice(id,1);
        pushImg('imgdoc01');
      }
      /*---- img 02 ----*/
      $('#filedoc02').change(function(){
        GetAtt('#filedoc02', '', 'canvas02', function (data) {
            $scope.user.class = 'shake';
            $scope.user.class02 = 'shake';
            $scope.user.filedoc02.push({id:$scope.group.billing,docfile:data,title:'แนบใบ Pay  In  Slip'});
            pushImg2('imgdoc02');
        });
      });
      function pushImg2(dClass){
        $('.divimg2').remove();
        if($scope.user.filedoc02){
          for(var i in $scope.user.filedoc02){
            var html = '<div class="col col-20 divimg2">' +
                '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc02[i].docfile + '" width="100" height="100" ng-click="removeimg2(' + i + ')"/>' +
                '</div>';
            angular.element(document.getElementById(dClass)).append($compile(html)($scope));
          }
        }
      }
      $scope.removeimg2 = function(id){
        $scope.user.filedoc02.splice(id,1);
        pushImg2('imgdoc02');
      }
      /*------------------ end --------------------*/
      $scope.reloadbilling = function(){
        $scope.billingdata = [];
        GetBillingByIaccount($stateParams.accountid,function(data){
          //alert(data.length);
          if(data.length > 0){
            var x = 0;
            var loopArray = function(arr){
              getPush(x,function(){
                x++;
                if(x < arr.length){
                  loopArray(arr);
                }else{
                  $ionicLoading.hide();
                }
              });
            }
            loopArray(data);
            function getPush(i,callback){
              $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล '+data[i].ivz_name);
              $scope.billingdata.push({
                ivz_billingnotestableid:data[i].ivz_billingnotestableid,
                ivz_name:data[i].ivz_name,
                ivz_billingnumber:data[i].ivz_billingnumber,
                ivz_sumbillingamount:data[i].ivz_sumbillingamount,
                ivz_billingdate:new Date(data[i].ivz_billingdate),
                ivz_customername:data[i].ivz_customername,
                createdon:data[i].createdon,
                ivz_customernumber:data[i].ivz_customernumber,
                ivz_addressdistrict:data[i].ivz_addressdistrict,
                ivz_addressprovince:data[i].ivz_addressprovince,
                territoryid:data[i].territoryid,
                ivz_leadermail:data[i].ivz_leadermail,
                ivz_emailcontact:data[i].ivz_emailcontact,
                ivz_ccmail:data[i].ivz_ccmail
              });
              setTimeout(function(){
                callback();
              },5);
            }
          }
          if($scope.$phase){$scope.$apply();}
        });
      }
      // $scope.gettarget = function(id){
      //   console.log(id);
      //   $state.go('app.billingcollectionoption',{retype:1});
      // }
      $scope.reback = function(){
        $scope.user = {
          filedoc01:[],
          filedoc02:[],
          class:'shake',
          class01:'shake',
          class02:'shake',
          txtname:'',
          txtbilling:'',
          txttatol:0,
          txtdate:new Date(),
          txtcomment:''
        };
        $ionicHistory.goBack(-1);
      }

      $scope.$watch('group.resultactivities',function(){
        switch ($scope.group.resultactivities) {
          case 1:
            //alert($scope.user.selected+':ไม่ทำกิจกรรม');
            console.log($scope.user.selected.toString()+':ไม่ทำกิจกรรม');
            $state.go('app.billingcollectionnotdo',{
                  accountid:$stateParams.accountid,
                  accountname:$stateParams.accountname,
                  province:$stateParams.province,
                  distid:$stateParams.distid,
                  billing:$scope.user.selected,
                  txttatol:$scope.user.txttatol,
                  resultstatus:$scope.group.resultactivities,
                  terid:$stateParams.terid
                },{reload:true});
            //console.log('insert result planning not do');
            break;
          case 2:
            console.log($scope.user.selected.toString()+':ทำกิจกรรม');
            switch ($scope.group.typebilling) {
              case 0:
                console.log($scope.group.billing);
                $state.go('app.billingcollectioncash',{
                                                        accountid:$stateParams.accountid,
                                                        accountname:$stateParams.accountname,
                                                        province:$stateParams.province,
                                                        distid:$stateParams.distid,
                                                        billing:$scope.user.selected,
                                                        txttatol:$scope.user.txttatol,
                                                        resultstatus:$scope.group.resultactivities,
                                                        terid:$stateParams.terid
                                                      },{reload:true});
                break;
              case 1:
                console.log($scope.user.selected.toString());
                $state.go('app.billingcollectioncheck',{
                                                        accountid:$stateParams.accountid,
                                                        accountname:$stateParams.accountname,
                                                        province:$stateParams.province,
                                                        distid:$stateParams.distid,
                                                        billing:$scope.user.selected,
                                                        txttatol:$scope.user.txttatol,
                                                        resultstatus:$scope.group.resultactivities,
                                                        terid:$stateParams.terid
                                                      },{reload:true});
                break;
              case 2:
                console.log($scope.user.selected.toString());
                $state.go('app.billingcollectiontrans',{
                                                        accountid:$stateParams.accountid,
                                                        accountname:$stateParams.accountname,
                                                        province:$stateParams.province,
                                                        distid:$stateParams.distid,
                                                        billing:$scope.user.selected,
                                                        txttatol:$scope.user.txttatol,
                                                        resultstatus:$scope.group.resultactivities,
                                                        terid:$stateParams.terid
                                                      },{reload:true});
                break;
              case 3:
                console.log($scope.group.billing);
                $state.go('app.billingcollectionother',{
                                                        accountid:$stateParams.accountid,
                                                        accountname:$stateParams.accountname,
                                                        province:$stateParams.province,
                                                        distid:$stateParams.distid,
                                                        billing:$scope.user.selected,
                                                        txttatol:$scope.user.txttatol,
                                                        resultstatus:$scope.group.resultactivities,
                                                        terid:$stateParams.terid
                                                      },{reload:true});
                break;
              case 4:
                console.log($scope.group.billing);
                break;
            }
            break;
        }
      });
      $ionicModal.fromTemplateUrl('templates/comment/optioncheck.html', {
          id: 1,
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function (modal) {
          $scope.modal1 = modal;
      });
      $scope.closemodal = function(id){
        $scope.modal1.hide();
      }
      $scope.cBilling = function(id){
        //alert($scope.user.selected.length);
        if($scope.user.selected.length > 0){
          $scope.group.typebilling = id;
          $scope.group.resultactivities = '';
          $scope.modal1.show();
        }else{
          alert('กรุณาเลือกรายการที่ค้างชำระด้วย');
        }
      }
      $scope.cBillingNotDo = function(){
          // $scope.modal1.show();
          $state.go('app.billingcollectionnotdo',{
                accountid:$stateParams.accountid,
                accountname:$stateParams.accountname,
                province:$stateParams.province,
                distid:$stateParams.distid,
                billing:$scope.user.selected,
                txttatol:$scope.user.txttatol,
                resultstatus:$scope.group.resultactivities,
                terid:$stateParams.terid
              },{reload:true});
      }
      var insertResultplan = function(arr,taskresult,annote1,annote2){
        console.log(arr[0].typeid+'::'+arr[0].guid+'::'+arr[0].txt);
        taskresult(arr,function(){
          annote1(arr,function(){
            annote2(arr);
          });
        });
      }
      var insertaskresult = function(options,callback){
        //console.log('insert task result plan');
        setTimeout(function(){
          console.log('insert task result plan:'+options);
          callback();
        },5000);
      }
      var insertannote01 = function(options,callback){
        //console.log('insert annote1');
        setTimeout(function(){
          console.log('options note1:'+options);
          callback();
        },3000);
      }
      var insertannote02 = function(options){
        console.log('insert annote2');
        $scope.reback();
      }
      var notnullfn = function(option){
        console.log('not null event');
        $scope.reback();
      }
      $scope.cBillingConfirm = function(id){
        switch (id) {
          case 0:
            console.log($stateParams.billingid);
            if($scope.user.filedoc01.length <= 0){
              $scope.user.class = 'shakepoint';
              $scope.user.class01 = 'shakepoint';
            }else{
              $scope.user.class = 'shake';
              $scope.user.class01 = 'shake';
            }
            if($scope.user.filedoc02.length <= 0){
              $scope.user.class = 'shakepoint';
              $scope.user.class02 = 'shakepoint';
            }else{
              $scope.user.class = 'shake';
              $scope.user.class02 = 'shake';
            }
            if($scope.user.filedoc01.length > 0 && $scope.user.filedoc02.length > 0){
              console.log('insert billing collect');
              var arr = [{typeid:0,guid:guid(),txt:null}];
              insertResultplan(arr,insertaskresult,insertannote01,insertannote02);
            }
            break;
          case 1:
            console.log($stateParams.billingid);
            if($scope.user.filedoc01.length <= 0){
              $scope.user.class = 'shakepoint';
              $scope.user.class01 = 'shakepoint';
            }else{
              $scope.user.class = 'shake';
              $scope.user.class01 = 'shake';
            }
            if($scope.user.filedoc01.length > 0){
              console.log('insert billing collect');
              var arr = [{typeid:0,guid:guid(),txt:null}];
              insertResultplan(arr,insertaskresult,insertannote01,notnullfn);
            }
            break;
          case 2:
            console.log($stateParams.billingid);
            if($scope.user.filedoc01.length <= 0){
              $scope.user.class = 'shakepoint';
              $scope.user.class01 = 'shakepoint';
            }else{
              $scope.user.class = 'shake';
              $scope.user.class01 = 'shake';
            }
            if($scope.user.filedoc02.length <= 0){
              $scope.user.class = 'shakepoint';
              $scope.user.class02 = 'shakepoint';
            }else{
              $scope.user.class = 'shake';
              $scope.user.class02 = 'shake';
            }
            if($scope.user.filedoc01.length > 0 && $scope.user.filedoc02.length > 0){
              console.log('insert billing collect');
              var arr = [{typeid:0,guid:guid(),txt:null}];
              insertResultplan(arr,insertaskresult,insertannote01,insertannote02);
            }
            break;
          case 3:
            console.log($stateParams.billingid);
            if($scope.user.filedoc01.length <= 0){
              $scope.user.class = 'shakepoint';
              $scope.user.class01 = 'shakepoint';
            }else{
              $scope.user.class = 'shake';
              $scope.user.class01 = 'shake';
            }
            if($scope.user.filedoc01.length > 0){
              console.log('insert billing collect');
              var arr = [{typeid:0,guid:guid(),txt:null}];
              insertResultplan(arr,insertaskresult,insertannote01,notnullfn);
            }
            break;
          case 4:
            console.log($stateParams.billingid);
            if($scope.user.filedoc01.length <= 0){
              $scope.user.class = 'shakepoint';
              $scope.user.class01 = 'shakepoint';
            }else{
              $scope.user.class = 'shake';
              $scope.user.class01 = 'shake';
            }
            if($scope.user.filedoc01.length > 0){
              console.log('insert billing collect');
              var arr = [{typeid:0,guid:guid(),txt:null}];
              insertResultplan(arr,insertaskresult,insertannote01,notnullfn);
            }
            break;
        }
      }
      $scope.toggle = function (item,tatol, list) {
        //alert(tatol);
        var idx = list.indexOf(item);
        if (idx > -1) {
          $scope.user.txttatol = parseInt($scope.user.txttatol) - parseInt(tatol);
          $scope.user.selected.splice(idx, 1);
        }
        else {
          $scope.user.txttatol = parseInt($scope.user.txttatol) + parseInt(tatol);
          $scope.user.selected.push(item);
        }
        console.log($scope.user.selected.toString());
      };
      $scope.exists = function (item, tatol,list) {
        //alert(tatol);
        return list.indexOf(item) > -1;
      };
      $scope.$watch('user.selected',function(){
        console.log($scope.user.selected.length);
      });
    })
    .controller('ListBillingAccountNotDoCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
      $state.reload();
      $scope.Data = Data;
      $scope.user ={
        filedoc01:[],
        filedoc02:[],
        class:'shake',
        class01:'shake',
        class02:'shake',
        txtaccount:'',
        txtname:'',
        province:'',
        distid:'',
        txtbilling:'',
        txttatol:0,
        txtdate:new Date(),
        txtcomment:'',
        terid:'',
        latitude:'',
        longitude:''
      }
      $scope.$on('$ionicView.enter',function(){
        var x = $stateParams.accountid+'\n'+
                $stateParams.accountname+'\n'+
                $stateParams.province+'\n'+
                $stateParams.distid+'\n'+
                $stateParams.billing.toString()+'\n'+
                parseInt($stateParams.txttatol)+'\n'+
                $stateParams.terid;
        //alert(x);
        $scope.user.txtaccount = $stateParams.accountid;
        $scope.user.txtname = $stateParams.accountname;
        $scope.user.province = $stateParams.province;
        $scope.user.distid = $stateParams.distid;
        $scope.user.txtbilling = $stateParams.billing.toString();
        $scope.user.txttatol = parseInt($stateParams.txttatol);
        $scope.user.terid = $stateParams.terid;
      });
      $scope.calldocfile = function(id,ethis){
        console.log(ethis);
        $(id).trigger('click');
      }
      /*------------------ begin img --------------------*/
      $('#filedoc01').change(function(){
        $scope.user.class = 'shake';
        $scope.user.class01 = 'shake';
        GetAtt('#filedoc01', '', 'canvas01', function (data) {
            $scope.user.filedoc01.push({id:$stateParams.accountid,docfile:data,title:'แนบใบวางบิลที่ Sale เซ็น '+$stateParams.billing.toString()});
            pushImg('imgdoc01');
        });
      });
      function pushImg(dClass){
        $('.divimg').remove();
        if($scope.user.filedoc01){
          for(var i in $scope.user.filedoc01){
            var html =  '<div class="col col-20 divimg">' +
                        '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc01[i].docfile + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
                        '</div>';
            angular.element(document.getElementById(dClass)).append($compile(html)($scope));
          }
        }
      }
      $scope.removeimg = function(id){
        $scope.user.filedoc01.splice(id,1);
        pushImg('imgdoc01');
      }
      /*------------------ end --------------------*/
      $scope.cBillingConfirm = function(){
        if($scope.user.filedoc01.length <= 0){
          $scope.user.class = 'shakepoint';
        }else{
          $scope.user.class = 'shake';
        }
        if(!$scope.user.txtcomment){
          alert('กรุณาระบุเหตุผลที่ไม่ทำด้วย');
        }
        if($scope.user.txtcomment && $scope.user.filedoc01.length > 0){
          // insertresult(function(g){
          //   insertann(g);
          // });
          gpscall();
        }
      }
      var insertann = function(g){
        //alert(g);
        var x = 0;
        var loopArray = function(arr){
          insAnnote(x,function(){
            x++;
            if(x < arr.length){
              loopArray(arr);
            }else{
              setTimeout(function(){
                $scope.sendmailtosup($stateParams.terid,'ขอ อนุมัติไม่ทำกิจกรรมเก็บเงิน/วางบิล','ร้าน'+$scope.user.txtname+'ด้วยเนื่องจาก'+$scope.user.txtcomment,null);
                $ionicLoading.hide();
                $scope.reback(-1);
              },3000);
            }
          });
        }
        loopArray($scope.user.filedoc01);
        function insAnnote(i,callback){
          try {
            $scope.InAnnoteAttract('ivz_resultappoint',g,$scope.user.filedoc01[i].docfile,$scope.user.filedoc01[i].title,3,function(){
              callback();
            });
          } catch (e) {
            alert('error 1962 '+er);
          }
        }
      }
      function gpscall(){
        $scope.showLoadGPS();
        GetGPSLocation(function (res) {
           $scope.user.latitude = res.latitude;
           $scope.user.longitude = res.longitude;
           var stVal = setInterval(function(){
             if($scope.user.latitude){
               insertresult(insertann);
               clearInterval(stVal);
             }
           },1000);
           if($scope.$phase){$scope.$apply();}
        });
      }
      function insertresult(callback){
        try {
          $scope.showLoadingComplete('กำลังบันทึกข้อมูล');
          var g = guid();
          var ins = MobileCRM.DynamicEntity("ivz_resultappoint",$stateParams.guip);
              ins.properties.ivz_resultname = $scope.user.txtname;
              ins.properties.ivz_customer = new MobileCRM.Reference('account',$stateParams.accountid);
              ins.properties.ivz_visit = parseInt(1);
              //ins.properties.ivz_visitactivities = parseInt(1);
              //ins.properties.ivz_activitiestext = $scope.activitiestitle;
              ins.properties.ivz_latitude = $scope.user.latitude;
              ins.properties.ivz_longtitude = $scope.user.longitude;
              ins.properties.ivz_visitbilling = parseInt(1);
              ins.properties.ivz_visitcollecttion = parseInt(1);
              ins.properties.ivz_shedulestart = new Date();
              ins.properties.ivz_sheduleend = new Date();
              ins.properties.ivz_resultstatus = parseInt(1);
              ins.properties.ivz_billingnumber = $scope.user.txtbilling;
              ins.properties.ivz_resultremark = $scope.user.txtcomment;
              ins.properties.ivz_billingamount = parseInt($stateParams.txttatol);
              ins.properties.ivz_addressdistrict = new MobileCRM.Reference('ivz_addressdistrict',$scope.user.distid);
              ins.properties.ivz_addressprovince = new MobileCRM.Reference('ivz_addressprovince',$scope.user.province);
              ins.properties.ivz_territory = new MobileCRM.Reference('territory',$scope.user.terid);
              ins.properties.ivz_empid = $cookies.get('ivz_empid');
              ins.properties.ivz_statuscomplete = parseInt(1);
              ins.save(function(er){
                if(er){
                  alert(er);
                }else{
                  callback(g);
                }
              });
        } catch (e) {
          alert('error 1967 '+e);
        }
      }

    })
    .controller('ListBillingAccountCashCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
      $state.reload();
      $scope.Data = Data;
      $scope.user ={
        filedoc01:[],
        filedoc02:[],
        matchannote:[],
        class:'shake',
        class01:'shake',
        class02:'shake',
        txtaccount:'',
        txtname:'',
        province:'',
        distid:'',
        txtbilling:'',
        txttatol:0,
        txtdate:new Date(),
        txtcomment:'',
        terid:'',
        latitude:'',
        longitude:'',
        chkscope:''
      }
      $scope.$on('$ionicView.enter',function(){
        var x = $stateParams.accountid+'\n'+
                $stateParams.accountname+'\n'+
                $stateParams.province+'\n'+
                $stateParams.distid+'\n'+
                $stateParams.billing.toString()+'\n'+
                parseInt($stateParams.txttatol)+'\n'+
                $stateParams.terid;
        //alert(x);
        $scope.user.txtaccount = $stateParams.accountid;
        $scope.user.txtname = $stateParams.accountname;
        $scope.user.province = $stateParams.province;
        $scope.user.distid = $stateParams.distid;
        $scope.user.txtbilling = $stateParams.billing.toString();
        $scope.user.txttatol = parseInt($stateParams.txttatol);
        $scope.user.terid = $stateParams.terid;
      });
      $scope.calldocfile = function(id,ethis){
        console.log(ethis);
        $(id).trigger('click');
      }
      /*------------------ begin img --------------------*/
      $('#filedoc01').change(function(){
        $scope.user.class = 'shake';
        $scope.user.class01 = 'shake';
        GetAtt('#filedoc01', '', 'canvas01', function (data) {
            $scope.user.filedoc01.push({id:$stateParams.accountid,docfile:data,title:'แนบใบวางบิลที่ Sale เซ็น '+$stateParams.billing.toString()});
            pushImg('imgdoc01');
        });
      });
      function pushImg(dClass){
        $('.divimg').remove();
        if($scope.user.filedoc01){
          for(var i in $scope.user.filedoc01){
            var html =  '<div class="col col-20 divimg">' +
                        '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc01[i].docfile + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
                        '</div>';
            angular.element(document.getElementById(dClass)).append($compile(html)($scope));
          }
        }
      }
      $scope.removeimg = function(id){
        $scope.user.filedoc01.splice(id,1);
        pushImg('imgdoc01');
      }
      //////////////////////////
      $('#filedoc02').change(function(){
        $scope.user.class = 'shake';
        $scope.user.class02 = 'shake';
        GetAtt('#filedoc02', '', 'canvas02', function (data) {
            $scope.user.filedoc02.push({id:$stateParams.accountid,docfile:data,title:'แนบใบ Pay  In  Slip'+$stateParams.billing.toString()});
            pushImg2('imgdoc02');
        });
      });
      function pushImg2(dClass){
        $('.divimg2').remove();
        if($scope.user.filedoc02){
          for(var i in $scope.user.filedoc02){
            var html =  '<div class="col col-20 divimg2">' +
                        '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc02[i].docfile + '" width="100" height="100" ng-click="removeimg2(' + i + ')"/>' +
                        '</div>';
            angular.element(document.getElementById(dClass)).append($compile(html)($scope));
          }
        }
      }
      $scope.removeimg2 = function(id){
        $scope.user.filedoc02.splice(id,1);
        pushImg2('imgdoc02');
      }

      /*------------------ end --------------------*/
      $scope.cBillingConfirm = function(){
        //alert\(\$scope\.user\.filedoc01\.length\+'::'\+\$scope\.user\.filedoc02\.length\);
        if($scope.user.filedoc01.length <= 0){
          $scope.user.class = 'shakepoint';
        }else{
          $scope.user.class = 'shake';
        }
        if($scope.user.filedoc02.length <= 0){
          $scope.user.class = 'shakepoint';
        }else{
          $scope.user.class = 'shake';
        }
        if($scope.user.filedoc01.length  > 0 && $scope.user.filedoc02.length > 0){
          var x = 0;
          var y = 0;
          var doc02 = function(arr){
            getDoc(y,arr,function(){
              y++;
              if(y < arr.length){
                doc02(arr);
              }else{
                setTimeout(function(){
                  $scope.showLoadGPS();
                  GetGPSLocation(function (res) {
                     $scope.user.latitude = res.latitude;
                     $scope.user.longitude = res.longitude;
                     var stVal = setInterval(function(){
                       if($scope.user.latitude){
                         insertresult(function(g){
                           insertann(g);
                         });
                         clearInterval(stVal);
                       }
                     },3000);
                     if($scope.$phase){$scope.$apply();}
                  });
                },1000);
              }
            });
          }
          var doc01 = function(arr){
            getDoc(x,arr,function(){
              x++;
              if(x < arr.length){
                doc01(arr);
              }else{
                doc02($scope.user.filedoc02);
              }
            });
          }
          doc01($scope.user.filedoc01);
          function getDoc(i,data,callback){
            try {
              $scope.user.matchannote.push({
                  id:$stateParams.accountid,
                  docfile:data[i].docfile,
                  title:data[i].title
                });
                callback();
            } catch (e) {
              alert('error annote 2214 '+e);
            }
          }
        }
      }
      var insertann = function(g){
        var x = 0;
        var loopArray = function(arr){
          insAnnote(x,function(){
            x++;
            if(x < arr.length){
              loopArray(arr);
            }else{
              setTimeout(function(){
                $ionicLoading.hide();
                $scope.reback(-1);
              },3000);
            }
          });
        }
        loopArray($scope.user.matchannote);
        function insAnnote(i,callback){
          try {
            $scope.InAnnoteAttract('ivz_resultappoint',g,$scope.user.matchannote[i].docfile,$scope.user.matchannote[i].title,null,function(){
              callback();
            });
          } catch (e) {
            alert('error 2250 '+e);
          }
        }
      }


      function insertresult(callback){
        try {
          $scope.showLoadingComplete('กำลังบันทึกข้อมูล');
          var g = guid();
          var ins = MobileCRM.DynamicEntity.createNew("ivz_resultappoint");
              ins.properties.ivz_resultappointid = g;
              ins.properties.ivz_resultname = $scope.user.txtname;
              ins.properties.ivz_customer = new MobileCRM.Reference('account',$stateParams.accountid);
              ins.properties.ivz_visit = parseInt(1);
              //ins.properties.ivz_visitactivities = parseInt(1);
              //ins.properties.ivz_activitiestext = $scope.activitiestitle;
              ins.properties.ivz_typebilling = parseInt(0);
              ins.properties.ivz_latitude = $scope.user.latitude;
              ins.properties.ivz_longtitude = $scope.user.longitude;
              ins.properties.ivz_visitbilling = parseInt(1);
              ins.properties.ivz_visitcollecttion = parseInt(1);
              ins.properties.ivz_shedulestart = new Date();
              ins.properties.ivz_sheduleend = new Date();
              ins.properties.ivz_resultstatus = parseInt(0);
              ins.properties.ivz_billingnumber = $scope.user.txtbilling;
              ins.properties.ivz_resultremark = $scope.user.txtcomment;
              ins.properties.ivz_billingamount = parseInt($stateParams.txttatol);
              ins.properties.ivz_addressdistrict = new MobileCRM.Reference('ivz_addressdistrict',$scope.user.distid);
              ins.properties.ivz_addressprovince = new MobileCRM.Reference('ivz_addressprovince',$scope.user.province);
              ins.properties.ivz_territory = new MobileCRM.Reference('territory',$scope.user.terid);
              ins.properties.ivz_empid = $cookies.get('ivz_empid');
              ins.properties.ivz_statuscomplete = parseInt(2);
              ins.save(function(er){
                if(er){
                  alert(er);
                }else{
                  callback(g);
                }
              });
        } catch (e) {
          alert('error 2279 '+e);
        }
      }

    })
    .controller('ListBillingAccountCheckCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
      $state.reload();
      $scope.Data = Data;
      $scope.user ={
        filedoc01:[],
        filedoc02:[],
        matchannote:[],
        class:'shake',
        class01:'shake',
        class02:'shake',
        txtaccount:'',
        txtname:'',
        province:'',
        distid:'',
        txtbilling:'',
        txttatol:0,
        txtdate:new Date(),
        txtcomment:'',
        terid:'',
        latitude:'',
        longitude:'',
        chkscope:''
      }
      $scope.$on('$ionicView.enter',function(){
        var x = $stateParams.accountid+'\n'+
                $stateParams.accountname+'\n'+
                $stateParams.province+'\n'+
                $stateParams.distid+'\n'+
                $stateParams.billing.toString()+'\n'+
                parseInt($stateParams.txttatol)+'\n'+
                $stateParams.terid;
        //alert(x);
        $scope.user.txtaccount = $stateParams.accountid;
        $scope.user.txtname = $stateParams.accountname;
        $scope.user.province = $stateParams.province;
        $scope.user.distid = $stateParams.distid;
        $scope.user.txtbilling = $stateParams.billing.toString();
        $scope.user.txttatol = parseInt($stateParams.txttatol);
        $scope.user.terid = $stateParams.terid;
      });
      $scope.calldocfile = function(id,ethis){
        console.log(ethis);
        $(id).trigger('click');
      }
      /*------------------ begin img --------------------*/
      $('#filedoc01').change(function(){
        $scope.user.class = 'shake';
        $scope.user.class01 = 'shake';
        GetAtt('#filedoc01', '', 'canvas01', function (data) {
            $scope.user.filedoc01.push({id:$stateParams.accountid,docfile:data,title:'แนบใบวางบิลที่ Sale เซ็น '+$stateParams.billing.toString()});
            pushImg('imgdoc01');
        });
      });
      function pushImg(dClass){
        $('.divimg').remove();
        if($scope.user.filedoc01){
          for(var i in $scope.user.filedoc01){
            var html =  '<div class="col col-20 divimg">' +
                        '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc01[i].docfile + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
                        '</div>';
            angular.element(document.getElementById(dClass)).append($compile(html)($scope));
          }
        }
      }
      $scope.removeimg = function(id){
        $scope.user.filedoc01.splice(id,1);
        pushImg('imgdoc01');
      }
      //////////////////////////
      $('#filedoc02').change(function(){
        $scope.user.class = 'shake';
        $scope.user.class02 = 'shake';
        GetAtt('#filedoc02', '', 'canvas02', function (data) {
            $scope.user.filedoc02.push({id:$stateParams.accountid,docfile:data,title:'ถ่ายรูปหน้าเช็ค'+$stateParams.billing.toString()});
            pushImg2('imgdoc02');
        });
      });
      function pushImg2(dClass){
        $('.divimg2').remove();
        if($scope.user.filedoc02){
          for(var i in $scope.user.filedoc02){
            var html =  '<div class="col col-20 divimg2">' +
                        '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc02[i].docfile + '" width="100" height="100" ng-click="removeimg2(' + i + ')"/>' +
                        '</div>';
            angular.element(document.getElementById(dClass)).append($compile(html)($scope));
          }
        }
      }
      $scope.removeimg2 = function(id){
        $scope.user.filedoc02.splice(id,1);
        pushImg2('imgdoc02');
      }

      /*------------------ end --------------------*/
      $scope.cBillingConfirm = function(){
        //alert\(\$scope\.user\.filedoc01\.length\+'::'\+\$scope\.user\.filedoc02\.length\);
        if($scope.user.filedoc01.length <= 0){
          $scope.user.class = 'shakepoint';
        }else{
          $scope.user.class = 'shake';
        }
        if($scope.user.filedoc02.length <= 0){
          $scope.user.class = 'shakepoint';
        }else{
          $scope.user.class = 'shake';
        }
        if($scope.user.filedoc01.length  > 0 && $scope.user.filedoc02.length > 0){
          $scope.showLoading('กำลังโหลดข้อมูล');
          var x = 0;
          var y = 0;
          var doc02 = function(arr){
            getDoc(y,arr,function(){
              y++;
              if(y < arr.length){
                doc02(arr);
              }else{
                setTimeout(function(){
                  $scope.showLoadGPS();
                  GetGPSLocation(function (res) {
                     $scope.user.latitude = res.latitude;
                     $scope.user.longitude = res.longitude;
                     var stVal = setInterval(function(){
                       if($scope.user.latitude){
                         insertresult(function(g){
                           insertann(g);
                         });
                         clearInterval(stVal);
                       }
                     },3000);
                     if($scope.$phase){$scope.$apply();}
                  });
                },1000);
              }
            });
          }
          var doc01 = function(arr){
            getDoc(x,arr,function(){
              x++;
              if(x < arr.length){
                doc01(arr);
              }else{
                doc02($scope.user.filedoc02);
              }
            });
          }
          doc01($scope.user.filedoc01);
          function getDoc(i,data,callback){
            try {
              $scope.user.matchannote.push({
                  id:$stateParams.accountid,
                  docfile:data[i].docfile,
                  title:data[i].title
                });
                callback();
            } catch (e) {
              alert('error annote 2448 '+e);
            }
          }
        }
      }
      var insertann = function(g){
        var x = 0;
        var loopArray = function(arr){
          insAnnote(x,function(){
            x++;
            if(x < arr.length){
              loopArray(arr);
            }else{
              setTimeout(function(){
                $ionicLoading.hide();
                $scope.reback(-1);
              },3000);
            }
          });
        }
        loopArray($scope.user.matchannote);
        function insAnnote(i,callback){
          try {
            $scope.InAnnoteAttract('ivz_resultappoint',g,$scope.user.matchannote[i].docfile,$scope.user.matchannote[i].title,null,function(){
              callback();
            });
          } catch (e) {
            alert('error 2250 '+e);
          }
        }
      }


      function insertresult(callback){
        try {
          $scope.showLoadingComplete('กำลังบันทึกข้อมูล');
          var g = guid();
          var ins = MobileCRM.DynamicEntity.createNew("ivz_resultappoint");
              ins.properties.ivz_resultappointid = g;
              ins.properties.ivz_resultname = $scope.user.txtname;
              ins.properties.ivz_customer = new MobileCRM.Reference('account',$stateParams.accountid);
              ins.properties.ivz_visit = parseInt(1);
              //ins.properties.ivz_visitactivities = parseInt(1);
              //ins.properties.ivz_activitiestext = $scope.activitiestitle;
              ins.properties.ivz_typebilling = parseInt(1);
              ins.properties.ivz_latitude = $scope.user.latitude;
              ins.properties.ivz_longtitude = $scope.user.longitude;
              ins.properties.ivz_visitbilling = parseInt(1);
              ins.properties.ivz_visitcollecttion = parseInt(1);
              ins.properties.ivz_shedulestart = new Date();
              ins.properties.ivz_sheduleend = new Date();
              ins.properties.ivz_resultstatus = parseInt(0);
              ins.properties.ivz_billingnumber = $scope.user.txtbilling;
              ins.properties.ivz_resultremark = $scope.user.txtcomment;
              ins.properties.ivz_billingamount = parseInt($stateParams.txttatol);
              ins.properties.ivz_addressdistrict = new MobileCRM.Reference('ivz_addressdistrict',$scope.user.distid);
              ins.properties.ivz_addressprovince = new MobileCRM.Reference('ivz_addressprovince',$scope.user.province);
              ins.properties.ivz_territory = new MobileCRM.Reference('territory',$scope.user.terid);
              ins.properties.ivz_empid = $cookies.get('ivz_empid');
              ins.properties.ivz_statuscomplete = parseInt(2);
              ins.save(function(er){
                if(er){
                  alert(er);
                }else{
                  callback(g);
                }
              });
        } catch (e) {
          alert('error 2279 '+e);
        }
      }

    })
    .controller('ListBillingAccountTransferCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
      $state.reload();
      $scope.Data = Data;
      $scope.user ={
        filedoc01:[],
        filedoc02:[],
        matchannote:[],
        class:'shake',
        class01:'shake',
        class02:'shake',
        txtaccount:'',
        txtname:'',
        province:'',
        distid:'',
        txtbilling:'',
        txttatol:0,
        txtdate:new Date(),
        txtcomment:'',
        terid:'',
        latitude:'',
        longitude:'',
        chkscope:'',
        accountbank:168900003,
        yssbank:917970001
      }
      $scope.$on('$ionicView.enter',function(){
        var x = $stateParams.accountid+'\n'+
                $stateParams.accountname+'\n'+
                $stateParams.province+'\n'+
                $stateParams.distid+'\n'+
                $stateParams.billing.toString()+'\n'+
                parseInt($stateParams.txttatol)+'\n'+
                $stateParams.terid;
        //alert(x);
        $scope.user.txtaccount = $stateParams.accountid;
        $scope.user.txtname = $stateParams.accountname;
        $scope.user.province = $stateParams.province;
        $scope.user.distid = $stateParams.distid;
        $scope.user.txtbilling = $stateParams.billing.toString();
        $scope.user.txttatol = parseInt($stateParams.txttatol);
        $scope.user.terid = $stateParams.terid;
        GetBankName(function(data){
          $scope.optionbank = data;
          if($scope.$phase){$scope.$apply();}
        });
        GetBankNameYss(function(data){
          $scope.optionyssbank = data;
          if($scope.$phase){$scope.$apply();}
        });
      });
      $scope.calldocfile = function(id,ethis){
        console.log(ethis);
        $(id).trigger('click');
      }
      /*------------------ begin img --------------------*/
      $('#filedoc01').change(function(){
        $scope.user.class = 'shake';
        $scope.user.class01 = 'shake';
        GetAtt('#filedoc01', '', 'canvas01', function (data) {
            $scope.user.filedoc01.push({id:$stateParams.accountid,docfile:data,title:'แนบใบวางบิลที่ ลูกค้าเซ็น'+$stateParams.billing.toString()});
            pushImg('imgdoc01');
        });
      });
      function pushImg(dClass){
        $('.divimg').remove();
        if($scope.user.filedoc01){
          for(var i in $scope.user.filedoc01){
            var html =  '<div class="col col-20 divimg">' +
                        '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc01[i].docfile + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
                        '</div>';
            angular.element(document.getElementById(dClass)).append($compile(html)($scope));
          }
        }
      }
      $scope.removeimg = function(id){
        $scope.user.filedoc01.splice(id,1);
        pushImg('imgdoc01');
      }
      //////////////////////////
      // $('#filedoc02').change(function(){
      //   $scope.user.class = 'shake';
      //   $scope.user.class02 = 'shake';
      //   GetAtt('#filedoc02', '', 'canvas02', function (data) {
      //       $scope.user.filedoc02.push({id:$stateParams.accountid,docfile:data,title:'ถ่ายรูปหน้าเช็ค'+$stateParams.billing.toString()});
      //       pushImg2('imgdoc02');
      //   });
      // });
      // function pushImg2(dClass){
      //   $('.divimg2').remove();
      //   if($scope.user.filedoc02){
      //     for(var i in $scope.user.filedoc02){
      //       var html =  '<div class="col col-20 divimg2">' +
      //                   '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc02[i].docfile + '" width="100" height="100" ng-click="removeimg2(' + i + ')"/>' +
      //                   '</div>';
      //       angular.element(document.getElementById(dClass)).append($compile(html)($scope));
      //     }
      //   }
      // }
      // $scope.removeimg2 = function(id){
      //   $scope.user.filedoc02.splice(id,1);
      //   pushImg2('imgdoc02');
      // }

      /*------------------ end --------------------*/
      $scope.cBillingConfirm = function(){
        //alert\(\$scope\.user\.filedoc01\.length\+'::'\+\$scope\.user\.filedoc02\.length\);
        if($scope.user.filedoc01.length <= 0){
          $scope.user.class = 'shakepoint';
        }else{
          $scope.user.class = 'shake';
        }
        // if($scope.user.filedoc02.length <= 0){
        //   $scope.user.class = 'shakepoint';
        // }else{
        //   $scope.user.class = 'shake';
        // }
        if($scope.user.filedoc01.length  > 0){
          $scope.showLoading('กำลังโหลดข้อมูล');
          var x = 0;
          var y = 0;
          var doc02 = function(arr){
            getDoc(y,arr,function(){
              y++;
              if(y < arr.length){
                doc02(arr);
              }else{
                setTimeout(function(){
                  $scope.showLoadGPS();
                  GetGPSLocation(function (res) {
                     $scope.user.latitude = res.latitude;
                     $scope.user.longitude = res.longitude;
                     var stVal = setInterval(function(){
                       if($scope.user.latitude){
                         insertresult(function(g){
                           insertann(g);
                         });
                         clearInterval(stVal);
                       }
                     },3000);
                     if($scope.$phase){$scope.$apply();}
                  });
                },1000);
              }
            });
          }
          // var doc01 = function(arr){
          //   getDoc(x,arr,function(){
          //     x++;
          //     if(x < arr.length){
          //       doc01(arr);
          //     }else{
          //       doc02($scope.user.filedoc02);
          //     }
          //   });
          // }
          doc02($scope.user.filedoc01);
          function getDoc(i,data,callback){
            try {
              $scope.user.matchannote.push({
                  id:$stateParams.accountid,
                  docfile:data[i].docfile,
                  title:data[i].title
                });
                callback();
            } catch (e) {
              alert('error annote 2675 '+e);
            }
          }
        }
      }
      var insertann = function(g){
        var x = 0;
        var loopArray = function(arr){
          insAnnote(x,function(){
            x++;
            if(x < arr.length){
              loopArray(arr);
            }else{
              setTimeout(function(){
                $ionicLoading.hide();
                $scope.reback(-1);
              },3000);
            }
          });
        }
        loopArray($scope.user.matchannote);
        function insAnnote(i,callback){
          try {
            $scope.InAnnoteAttract('ivz_resultappoint',g,$scope.user.matchannote[i].docfile,$scope.user.matchannote[i].title,null,function(){
              callback();
            });
          } catch (e) {
            alert('error 2250 '+e);
          }
        }
      }


      function insertresult(callback){
        try {
          $scope.showLoadingComplete('กำลังบันทึกข้อมูล');
          var g = guid();
          var ins = MobileCRM.DynamicEntity.createNew("ivz_resultappoint");
              ins.properties.ivz_resultappointid = g;
              ins.properties.ivz_resultname = $scope.user.txtname;
              ins.properties.ivz_customer = new MobileCRM.Reference('account',$stateParams.accountid);
              ins.properties.ivz_visit = parseInt(1);
              //ins.properties.ivz_visitactivities = parseInt(1);
              //ins.properties.ivz_activitiestext = $scope.activitiestitle;
              ins.properties.ivz_datepayout = new Date($scope.user.txtdate);
              ins.properties.ivz_bankcustomer = parseInt($scope.user.accountbank);
              ins.properties.ivz_bankyss = parseInt($scope.user.yssbank);
              ins.properties.ivz_typebilling = parseInt(2);
              ins.properties.ivz_latitude = $scope.user.latitude;
              ins.properties.ivz_longtitude = $scope.user.longitude;
              ins.properties.ivz_visitbilling = parseInt(1);
              ins.properties.ivz_visitcollecttion = parseInt(1);
              ins.properties.ivz_shedulestart = new Date();
              ins.properties.ivz_sheduleend = new Date();
              ins.properties.ivz_resultstatus = parseInt(0);
              ins.properties.ivz_billingnumber = $scope.user.txtbilling;
              ins.properties.ivz_resultremark = $scope.user.txtcomment;
              ins.properties.ivz_billingamount = parseInt($stateParams.txttatol);
              ins.properties.ivz_addressdistrict = new MobileCRM.Reference('ivz_addressdistrict',$scope.user.distid);
              ins.properties.ivz_addressprovince = new MobileCRM.Reference('ivz_addressprovince',$scope.user.province);
              ins.properties.ivz_territory = new MobileCRM.Reference('territory',$scope.user.terid);
              ins.properties.ivz_empid = $cookies.get('ivz_empid');
              ins.properties.ivz_statuscomplete = parseInt(2);
              ins.save(function(er){
                if(er){
                  alert(er);
                }else{
                  callback(g);
                }
              });
        } catch (e) {
          alert('error 2279 '+e);
        }
      }

    })
    .controller('ListBillingAccountOtherCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
      $state.reload();
      $scope.Data = Data;
      $scope.user ={
        filedoc01:[],
        filedoc02:[],
        matchannote:[],
        class:'shake',
        class01:'shake',
        class02:'shake',
        txtaccount:'',
        txtname:'',
        province:'',
        distid:'',
        txtbilling:'',
        txttatol:0,
        txtdate:new Date(),
        txtcomment:'',
        terid:'',
        latitude:'',
        longitude:'',
        chkscope:'',
        accountbank:'',
        yssbank:''
      }
      $scope.$on('$ionicView.enter',function(){
        var x = $stateParams.accountid+'\n'+
                $stateParams.accountname+'\n'+
                $stateParams.province+'\n'+
                $stateParams.distid+'\n'+
                $stateParams.billing.toString()+'\n'+
                parseInt($stateParams.txttatol)+'\n'+
                $stateParams.terid;
        //alert(x);
        $scope.user.txtaccount = $stateParams.accountid;
        $scope.user.txtname = $stateParams.accountname;
        $scope.user.province = $stateParams.province;
        $scope.user.distid = $stateParams.distid;
        $scope.user.txtbilling = $stateParams.billing.toString();
        $scope.user.txttatol = parseInt($stateParams.txttatol);
        $scope.user.terid = $stateParams.terid;
      });
      $scope.calldocfile = function(id,ethis){
        console.log(ethis);
        $(id).trigger('click');
      }
      /*------------------ begin img --------------------*/
      $('#filedoc01').change(function(){
        $scope.user.class = 'shake';
        $scope.user.class01 = 'shake';
        GetAtt('#filedoc01', '', 'canvas01', function (data) {
            $scope.user.filedoc01.push({id:$stateParams.accountid,docfile:data,title:'แนบเอกสารอื่นๆๆ'+$stateParams.billing.toString()});
            pushImg('imgdoc01');
        });
      });
      function pushImg(dClass){
        $('.divimg').remove();
        if($scope.user.filedoc01){
          for(var i in $scope.user.filedoc01){
            var html =  '<div class="col col-20 divimg">' +
                        '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc01[i].docfile + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
                        '</div>';
            angular.element(document.getElementById(dClass)).append($compile(html)($scope));
          }
        }
      }
      $scope.removeimg = function(id){
        $scope.user.filedoc01.splice(id,1);
        pushImg('imgdoc01');
      }
      //////////////////////////
      // $('#filedoc02').change(function(){
      //   $scope.user.class = 'shake';
      //   $scope.user.class02 = 'shake';
      //   GetAtt('#filedoc02', '', 'canvas02', function (data) {
      //       $scope.user.filedoc02.push({id:$stateParams.accountid,docfile:data,title:'ถ่ายรูปหน้าเช็ค'+$stateParams.billing.toString()});
      //       pushImg2('imgdoc02');
      //   });
      // });
      // function pushImg2(dClass){
      //   $('.divimg2').remove();
      //   if($scope.user.filedoc02){
      //     for(var i in $scope.user.filedoc02){
      //       var html =  '<div class="col col-20 divimg2">' +
      //                   '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc02[i].docfile + '" width="100" height="100" ng-click="removeimg2(' + i + ')"/>' +
      //                   '</div>';
      //       angular.element(document.getElementById(dClass)).append($compile(html)($scope));
      //     }
      //   }
      // }
      // $scope.removeimg2 = function(id){
      //   $scope.user.filedoc02.splice(id,1);
      //   pushImg2('imgdoc02');
      // }

      /*------------------ end --------------------*/
      $scope.cBillingConfirm = function(){
        //alert\(\$scope\.user\.filedoc01\.length\+'::'\+\$scope\.user\.filedoc02\.length\);
        if($scope.user.filedoc01.length <= 0){
          $scope.user.class = 'shakepoint';
        }else{
          $scope.user.class = 'shake';
        }
        if($scope.user.txtcomment.length <= 0){
          alert('กรุณาระบุเหตุด้วย');
        }else{
          $scope.user.class = 'shake';
        }
        if($scope.user.filedoc01.length  > 0 && $scope.user.txtcomment.length > 0){
          var x = 0;
          var y = 0;
          var doc02 = function(arr){
            getDoc(y,arr,function(){
              y++;
              if(y < arr.length){
                doc02(arr);
              }else{
                setTimeout(function(){
                  $scope.showLoadGPS();
                  GetGPSLocation(function (res) {
                     $scope.user.latitude = res.latitude;
                     $scope.user.longitude = res.longitude;
                     var stVal = setInterval(function(){
                       if($scope.user.latitude){
                         insertresult(function(g){
                           insertann(g);
                         });
                         clearInterval(stVal);
                       }
                     },3000);
                     if($scope.$phase){$scope.$apply();}
                  });
                },1000);
              }
            });
          }
          // var doc01 = function(arr){
          //   getDoc(x,arr,function(){
          //     x++;
          //     if(x < arr.length){
          //       doc01(arr);
          //     }else{
          //       doc02($scope.user.filedoc02);
          //     }
          //   });
          // }
          doc02($scope.user.filedoc01);
          function getDoc(i,data,callback){
            try {
              $scope.user.matchannote.push({
                  id:$stateParams.accountid,
                  docfile:data[i].docfile,
                  title:data[i].title
                });
                callback();
            } catch (e) {
              alert('error annote 2675 '+e);
            }
          }
        }
      }
      var insertann = function(g){
        var x = 0;
        var loopArray = function(arr){
          insAnnote(x,function(){
            x++;
            if(x < arr.length){
              loopArray(arr);
            }else{
              setTimeout(function(){
                $ionicLoading.hide();
                $scope.reback(-1);
              },3000);
            }
          });
        }
        loopArray($scope.user.matchannote);
        function insAnnote(i,callback){
          try {
            $scope.InAnnoteAttract('ivz_resultappoint',g,$scope.user.matchannote[i].docfile,$scope.user.matchannote[i].title,null,function(){
              callback();
            });
          } catch (e) {
            alert('error 2250 '+e);
          }
        }
      }


      function insertresult(callback){
        try {
          $scope.showLoadingComplete('กำลังบันทึกข้อมูล');
          var g = guid();
          var ins = MobileCRM.DynamicEntity.createNew("ivz_resultappoint");
              ins.properties.ivz_resultappointid = g;
              ins.properties.ivz_resultname = $scope.user.txtname;
              ins.properties.ivz_customer = new MobileCRM.Reference('account',$stateParams.accountid);
              ins.properties.ivz_visit = parseInt(1);
              //ins.properties.ivz_visitactivities = parseInt(1);
              //ins.properties.ivz_activitiestext = $scope.activitiestitle;
              ins.properties.ivz_typebilling = parseInt(3);
              ins.properties.ivz_latitude = $scope.user.latitude;
              ins.properties.ivz_longtitude = $scope.user.longitude;
              ins.properties.ivz_visitbilling = parseInt(1);
              ins.properties.ivz_visitcollecttion = parseInt(1);
              ins.properties.ivz_shedulestart = new Date();
              ins.properties.ivz_sheduleend = new Date();
              ins.properties.ivz_resultstatus = parseInt(0);
              ins.properties.ivz_billingnumber = $scope.user.txtbilling;
              ins.properties.ivz_resultremark = $scope.user.txtcomment;
              ins.properties.ivz_billingamount = parseInt($stateParams.txttatol);
              ins.properties.ivz_addressdistrict = new MobileCRM.Reference('ivz_addressdistrict',$scope.user.distid);
              ins.properties.ivz_addressprovince = new MobileCRM.Reference('ivz_addressprovince',$scope.user.province);
              ins.properties.ivz_territory = new MobileCRM.Reference('territory',$scope.user.terid);
              ins.properties.ivz_empid = $cookies.get('ivz_empid');
              ins.properties.ivz_statuscomplete = parseInt(2);
              ins.save(function(er){
                if(er){
                  alert(er);
                }else{
                  callback(g);
                }
              });
        } catch (e) {
          alert('error 2279 '+e);
        }
      }

    })
    /////////////////// Open Account //////////////
    .controller('OpenAccountCtrl', function ($scope, $state, $stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        // $scope.DataRegistry = DataRegistry;
        Data.showcart = false;
        Data.mastertype = $stateParams.mastertype;
        Data.dataguid = $stateParams.getguid;
        if (!$stateParams.getguid) {
            $stateParams.getguid = guid();
        }
        if (Data.getparaaccount) {
            Data.getguid = Data.getparaaccount;
        }
        console.log($stateParams.mastertype);
        $scope.chk = {
            determinateValue: 0,
            buffervalue: 0,
            infomat: true,
            infocheck: false,
            infomattxtname: false,
            txtid: false
        };
        // Data.gid
        // Data.taxid
        // Data.cusname
        // Data.bracher
        $scope.user = {
            branchselect: 0,
            txtid: '',
            txtname: '',
            txtbrancher: ''
        };
        $scope.$on('$ionicView.enter',function(){
          // alert(''+
          //   '\n $stateParams.getguid:'+$stateParams.getguid+
          //   '\n $stateParams.territoryid:'+$stateParams.territoryid+
          //   '\n $stateParams.transactioncurrency:'+$stateParams.transactioncurrency+
          //   '\n $stateParams.pricelevel:'+$stateParams.pricelevel+
          //   '\n Data.countrymaster:'+Data.countrymaster);
          var txtname = $scope.user.txtname;
          if(Data.gettxtid){
                $scope.user.branchselect = 0;
                $scope.user.txtid = Data.gettxtid;
                $scope.user.txtname = Data.getparaname;
                $scope.user.txtbrancher = '';
          }else if(Data.taxid){
            $scope.user.branchselect = 0;
            $scope.user.txtid = Data.taxid;
            $scope.user.txtname = Data.cusname;
            $scope.user.txtbrancher = Data.bracher;
          }
        });
        /////////////// Check Txtid ////////////
        $scope.checktxt = function (txtid) {
            if (txtid) {
                //$scope.chk.infocheck = rego.reChkTxtId(txtid);
                if (txtid.length > 0) {
                    $scope.chk.infomat = true;
                    if (txtid.length > 12) {
                        $scope.chk.txtid = false;
                        var a = new MobileCRM.FetchXml.Entity('account');
                        a.addAttribute('ivz_taxid'); //0
                        var filter = new MobileCRM.FetchXml.Filter();
                        filter.where('ivz_taxid', 'eq', txtid);
                        a.filter = filter;
                        var fetch = new MobileCRM.FetchXml.Fetch(a);
                        fetch.execute('array', function (data) {
                            //alert("data length:"+txtid+' == '+data.length);
                            if (data.length > 0) {
                                $scope.chk.infocheck = true;
                            } else {
                                $scope.chk.infocheck = false;
                            };
                            if($scope.$phase){$scope.$apply();}
                        }, function (er) {
                            alert(er);
                        }, null);
                    } else {
                        $scope.chk.txtid = true;
                    }
                } else {
                    $scope.chk.infomat = false;
                }
            }
        }
        $scope.checkname = function (txtname) {
            if (txtname) {
                if (txtname.length >= 0) {
                    $scope.chk.infomattxtname = false;
                } else {
                    $scope.chk.infomattxtname = true;
                }
            } else {
                $scope.chk.infomattxtname = true;
            }
        }
        $scope.insertaccount = function () {
            //alert('test GPS Sign'+Data.latitude);
            if ($scope.user.txtid) { //Check txtid null
                var j = $scope.user.txtid;
                if (j.length > 12) {
                    $scope.chk.infomat = true;
                    $scope.chk.txtid = false;
                } else {
                    $scope.chk.txtid = true;
                }
            } else {
                $scope.chk.infomat = false;
            }
            if ($scope.user.txtname) { //check name null
                $scope.chk.infomattxtname = false;
            } else {
                $scope.chk.infomattxtname = true;
            }
            ////////////////// insert /////////////////////////
            $ionicLoading.hide();
            if ($scope.chk.infomat == true && $scope.chk.txtid == false && $scope.chk.infomattxtname == false) {
                Data.listregist = $scope.user.txtname;
                console.log('insert DB');
                try {
                    var a = new MobileCRM.FetchXml.Entity('account');
                    a.addAttribute('accountid'); //0
                    var filter = new MobileCRM.FetchXml.Filter();
                    filter.where('accountid', 'eq', $stateParams.getguid);
                    a.filter = filter;
                    var fetch = new MobileCRM.FetchXml.Fetch(a);
                    fetch.execute('array', function (data) {
                        Data.gid = $stateParams.getguid;
                        Data.taxid = $scope.user.txtid;
                        Data.cusname = $scope.user.txtname;
                        Data.bracher = $scope.user.txtbrancher;
                        if (data.length > 0) {
                            var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                            ins.properties.ivz_taxid = $scope.user.txtid;
                            ins.properties.name = $scope.user.txtname;
                            ins.properties.ivz_branch = parseInt($scope.user.branchselect);
                            if ($scope.user.branchselect == 0 || $scope.user.branchselect == '0') {
                                ins.properties.ivz_branchdetail = 'สำนักงานใหญ่';
                                ins.properties.ivz_taxbranch = 'สำนักงานใหญ่';
                            } else {
                                ins.properties.ivz_branchdetail = $scope.user.txtbrancher;
                                ins.properties.ivz_taxbranch = $scope.user.txtbrancher;
                            }
                            ins.properties.ivz_empid = Data.Empid; ///get cookies
                            ins.properties.ivz_satatusempid = parseInt($stateParams.mastertype);
                            ins.properties.territoryid = new MobileCRM.Reference('territory', $stateParams.territoryid); //A02
                            ins.properties.transactioncurrencyid = new MobileCRM.Reference('transactioncurrency', $stateParams.transactioncurrency); //บาท
                            ins.properties.defaultpricelevelid = new MobileCRM.Reference('pricelevel', $stateParams.pricelevel); //บาท
                            ins.properties.ivz_addresscountry = new MobileCRM.Reference('ivz_addresscountry', Data.countrymaster); //th
                            ins.properties.customertypecode = parseInt(2);
                            ins.properties.accountcategorycode = parseInt(100000001);
                            ins.properties.statuscode = parseInt(917970003);
                            ins.properties.ivz_statuscomplete = parseInt(0);
                            ins.save(function (er) {
                                if (er) {
                                    alert('error ac 902 ' + er);
                                } else {
                                    window.location.href = "#/app/accountcontact/" + $stateParams.getguid.trim();
                                }
                            });
                        } else {
                            var ins = new MobileCRM.DynamicEntity.createNew("account");
                            ins.properties.accountid = $stateParams.getguid.trim();
                            ins.properties.ivz_taxid = $scope.user.txtid;
                            ins.properties.name = $scope.user.txtname;
                            ins.properties.ivz_branch = parseInt($scope.user.branchselect);
                            if ($scope.user.branchselect == 0 || $scope.user.branchselect == '0') {
                                ins.properties.ivz_branchdetail = 'สำนักงานใหญ่';
                                ins.properties.ivz_taxbranch = 'สำนักงานใหญ่';
                            } else {
                                ins.properties.ivz_branchdetail = $scope.user.txtbrancher;
                                ins.properties.ivz_taxbranch = $scope.user.txtbrancher;
                            }
                            ins.properties.ivz_empid = Data.Empid; ///get cookies
                            ins.properties.ivz_satatusempid = parseInt($stateParams.mastertype);
                            ins.properties.territoryid = new MobileCRM.Reference('territory', $stateParams.territoryid); //A02
                            ins.properties.transactioncurrencyid = new MobileCRM.Reference('transactioncurrency', $stateParams.transactioncurrency); //บาท
                            ins.properties.defaultpricelevelid = new MobileCRM.Reference('pricelevel', $stateParams.pricelevel); //บาท
                            ins.properties.ivz_addresscountry = new MobileCRM.Reference('ivz_addresscountry', Data.countrymaster); //th
                            ins.properties.customertypecode = parseInt(2);
                            ins.properties.accountcategorycode = parseInt(100000001);
                            ins.properties.statuscode = parseInt(917970003);
                            ins.properties.ivz_statuscomplete = parseInt(0);
                            ins.save(function (er) {
                                if (er) {
                                    alert('error ac 903 ' + er);
                                } else {
                                    window.location.href = "#/app/accountcontact/" + $stateParams.getguid;
                                }
                            });
                        };
                        if($scope.$phase){$scope.$apply();}
                    }, function (er) {
                        alert(er);
                    }, null);
                } catch (er) {
                    alert("step error 907 " + er);
                }
                Data.businessname = $scope.user.txtname;
            }
            ///////////////////////////////////////////////////
        }

        $scope.goback = function () {
            console.log('click back');
            $ionicHistory.goBack(-1);
        }

    })
    .controller('OpenAccountSupCtrl', function ($scope, $state, $stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading) {
        $state.reload();
        Data.showcart = false;
        var ckUser = $cookies.get('name');
        $scope.masname = $cookies.get('name');
        if (ckUser) {
            $scope.listmaster = [];
            gettername($cookies.get('name'), function (data) {
                if (data) {
                    var x = 0;
                    var loopArray = function (arr) {
                        getPush(x, function () {
                            x++;
                            if (x < arr.length) {
                                loopArray(arr);
                            } else {
                                $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                                setTimeout(function () {
                                    $ionicLoading.hide();
                                }, 2000);
                            }
                        });
                    }
                    loopArray(data);

                    function getPush(i, callback) {
                        $scope.showLoadingProperTimesRegter('โหลดข้อมูลเขตการขาย ' + data[i].description);
                        $scope.listmaster.push({
                            ivz_territorymasterid: data[i].ivz_territorymasterid,
                            ivz_mastername: data[i].ivz_mastername,
                            ivz_leftterritory: data[i].ivz_leftterritory,
                            ivz_emailcontact: data[i].ivz_emailcontact,
                            ivz_leadermail: data[i].ivz_leadermail,
                            ivz_ccmail: data[i].ivz_ccmail,
                            ivz_empid: data[i].ivz_empid,
                            ivz_empname: data[i].ivz_empname,
                            ivz_statusempid: data[i].ivz_statusempid,
                            description: data[i].description
                        });
                        setTimeout(function () {
                            callback();
                        }, 600);
                    }
                }
                if($scope.$phase){$scope.$apply();}
            });
        } else {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.playlists', {}, {
                reload: true
            });
        }
        $scope.goaccountlist = function (id) {
            Data.termas = id;
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.openaccount', {
                territoryid: id,
                mastertype: Data.mastertype,
                getguid: guid(),
                pricelevel: Data.pricelevel,
                transactioncurrency: Data.transactioncurrency
            }, {
                reload: true
            });
        }
    })
    /* --------------------------------- Contact ----------------------------------------- */
    .controller('AccountContactCtrl', function ($scope, $state, $stateParams, $cookies, Data, $ionicHistory, $ionicLoading) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;

        //Data.dataguid = $stateParams.getguid;
        $scope.chk = {
            infomatfirstname: true,
            infomatlastname: true,
            infomattelhome: true,
            infomatmobile: true,
            infomatmobilenum: true,
            infomatfax: true,
            infomatemailname: true
        };
        $scope.user = {
          firstname:'',
          lastname:'',
          telhome:'',
          mobile:'',
          fax:'',
          emailname:''
        };
        // $scope.user = {
        //   firstname:'',
        //   lastname:'',
        //   telhome:'',
        //   mobile:'',
        //   fax:'',
        //   emailname:''
        // };
        $scope.$on('$ionicView.enter',function(){
          var contact = $scope.user.firstname;
          //alert('account contact '+contact.length);
          $scope.user.firstname = Data.contactname;
          $scope.user.lastname = Data.lastcontactname ;
          $scope.user.telhome = Data.tel;
          $scope.user.mobile = Data.mobile;
          $scope.user.fax = Data.fax;
          $scope.user.emailname = Data.email;
        });
        $scope.chknull = function (idval, chktxt) {
            if (idval == 1) {
                if (chktxt) {
                    $scope.chk.infomatfirstname = true;
                } else {
                    $scope.chk.infomatfirstname = false;
                }
            } else if (idval == 2) {
                if (chktxt) {
                    $scope.chk.infomatlastname = true;
                } else {
                    $scope.chk.infomatlastname = false;
                }
            } else if (idval == 3) {
                var nNum = !(isNaN(chktxt));
                //console.log(nNum);
                if (chktxt) {
                    $scope.chk.infomatmobile = true;
                    if (chktxt.length > 9) {
                        $scope.chk.infomatmobilenum = nNum;
                    } else {
                        $scope.chk.infomatmobile = false;
                    }
                } else {
                    $scope.chk.infomatmobile = false;
                }
            }
        };
        $scope.insertaccount = function () {
            if ($scope.user.firstname) { //Check null Name
                $scope.chk.infomatfirstname = true;
            } else {
                $scope.chk.infomatfirstname = false;
            }

            if ($scope.user.lastname) { //Check null Name
                $scope.chk.infomatlastname = true;
            } else {
                $scope.chk.infomatlastname = false;
            }

            if ($scope.user.mobile) { //Check Null Mobile
                var sNumL = $scope.user.mobile;
                var nNum = !(isNaN($scope.user.mobile));
                if (sNumL.length <= 0) {
                    $scope.chk.infomatmobile = false;
                } else {
                    $scope.chk.infomatmobilenum = nNum;
                    $scope.chk.infomatmobile = true;
                }
            } else {
                $scope.chk.infomatmobile = false;
            }

            if ($scope.chk.infomatfirstname == true && $scope.chk.infomatlastname == true && $scope.chk.infomatmobile == true && $scope.chk.infomatmobilenum == true) {
                //alert('update db :'+$stateParams.getguid.trim());
                $scope.showLoadingProperTimes();
                $scope.genguid = guid();
                //alert($stateParams.getguid+'::::'+$scope.genguid);
                try {
                    var a = new MobileCRM.FetchXml.Entity('contact');
                    a.addAttribute('contactid'); //0
                    var filter = new MobileCRM.FetchXml.Filter();
                    filter.where('contactid', 'eq', $scope.genguid);
                    a.filter = filter;
                    var fetch = new MobileCRM.FetchXml.Fetch(a);
                    fetch.execute('array', function (data) {
                      Data.contactname = $scope.user.firstname;
                      Data.lastcontactname =  $scope.user.lastname;
                      Data.tel = $scope.user.telhome;
                      Data.mobile = $scope.user.mobile;
                      Data.fax = $scope.user.fax;
                      Data.email = $scope.user.emailname;
                      Data.txtBankAccount =  $scope.user.firstname+' '+$scope.user.lastname;
                        if (data.length > 0) {
                            var ins = new MobileCRM.DynamicEntity("contact", $scope.genguid);
                            ins.properties.parentcustomerid = new MobileCRM.Reference('account', $stateParams.getguid.trim());
                            ins.properties.firstname = $scope.user.firstname;
                            ins.properties.lastname = $scope.user.lastname;
                            ins.properties.telephone1 = $scope.user.telhome;
                            ins.properties.mobilephone = $scope.user.mobile;
                            ins.properties.fax = $scope.user.fax;
                            ins.properties.emailaddress1 = $scope.user.emailname;
                            ins.properties.statuscode = parseInt(917970001);
                            ins.save(function (er) {
                                if (er) {
                                    alert("ER1087CODE:" + er);
                                }
                            });
                        } else {
                            var ins = new MobileCRM.DynamicEntity.createNew("contact");
                            ins.properties.contactid = $scope.genguid;
                            ins.properties.parentcustomerid = new MobileCRM.Reference('account', $stateParams.getguid.trim());
                            ins.properties.firstname = $scope.user.firstname;
                            ins.properties.lastname = $scope.user.lastname;
                            ins.properties.telephone1 = $scope.user.telhome;
                            ins.properties.mobilephone = $scope.user.mobile;
                            ins.properties.fax = $scope.user.fax;
                            ins.properties.emailaddress1 = $scope.user.emailname;
                            ins.properties.statuscode = parseInt(917970001);
                            ins.save(function (er) {
                                if (er) {
                                    alert("ER1103CODE:" + er);
                                }
                            });
                        };
                        if($scope.$phase){$scope.$apply();}
                    }, function (er) {
                        alert(er);
                    }, null);
                    try {
                        var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid.trim());
                        ins.properties.telephone1 = $scope.user.telhome;
                        ins.properties.fax = $scope.user.fax;
                        ins.properties.telephone2 = $scope.user.mobile;
                        ins.properties.emailaddress1 = $scope.user.emailname;
                        ins.properties.ivz_phonemobile = $scope.user.mobile;
                        ins.save(function (er) {
                            if (er) {
                                alert('error ac contact 167 ' + er);
                            }
                        });
                    } catch (er) {
                        alert("error149 " + er);
                    }
                    setTimeout(function () {
                        Data.recivename = $scope.user.firstname + ' ' + $scope.user.lastname;
                        $ionicLoading.hide();
                        window.location.href = "#/app/accountmeetting/" + $stateParams.getguid.trim();
                    }, 3000);
                } catch (er) {
                    alert("insert contact 488:" + er);
                }
            }
            //comment
            //window.location.href="#/app/accountmeetting/"+$stateParams.getguid;
        }
        $scope.goback = function () {
            //$ionicHistory.goBack(-1);
        }
    })
    /* --------------------------------- Meetting --------------------------------------- */
    .controller('AccountMeetingCtrl', function ($scope, $state, $stateParams, $cookies, Data, $ionicHistory, $ionicLoading ,Setting) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $scope.user = {
            actionfn:Data.actionfn,
            optionDay:Data.optionDay,
            optionStarttime:Data.optionStarttime,
            optionEndtime:Data.optionEndtime,
            optionBillingDay:Data.optionBillingDay,
            optionStartBilltime:Data.optionStartBilltime,
            optionEndBilltime:Data.optionEndBilltime,
            ///////////////// option ///////////////////////
            optionStartNormaltime:Data.optionStartNormaltime,
            optionEndNormaltime:Data.optionEndNormaltime,
            /////////////////////////////////////////////
            optionStarttimeAvailable:Data.optionStarttimeAvailable,
            optionEndtimeAvailable:Data.optionEndtimeAvailable,
            dataMon:Data.dataMon,
            dataTue:Data.dataTue,
            dataWen:Data.dataWen,
            dataThu:Data.dataThu,
            dataFri:Data.dataFri,
            dataSat:Data.dataSat,
            dataSun:Data.dataSun
        };
        $scope.chk = {
            infomatoptionDay: true,
            infomatoptionBillingDay: true
        };
        $scope.$watch('user.actionfn',function(){
          //alert($scope.user.actionfn);
          switch ($scope.user.actionfn) {
            case true:
                      $scope.user.dataMon = false;
                      $scope.user.dataTue = false;
                      $scope.user.dataWen = false;
                      $scope.user.dataThu = false;
                      $scope.user.dataFri = false;
                      $scope.user.dataSat = false;
              break;
            default:
                    $scope.user.dataMon = true;
                    $scope.user.dataTue = true;
                    $scope.user.dataWen = true;
                    $scope.user.dataThu = true;
                    $scope.user.dataFri = true;
                    $scope.user.dataSat = true;
          }
        });
        $scope.specialday = Setting.dateday;
        GetAvailablefromtime(function (data) {
            $scope.datetimer = data;
        });
        $scope.insertaccount = function () {
            Data.actionfn = $scope.user.actionfn;
            Data.optionDay = $scope.user.optionDay;
            Data.optionStarttime = $scope.user.optionStarttime;
            Data.optionEndtime = $scope.user.optionEndtime;
            Data.optionBillingDay = $scope.user.optionBillingDay;
            Data.optionStartBilltime = $scope.user.optionStartBilltime;
            Data.optionEndBilltime = $scope.user.optionEndBilltime;
            ///////////////// option ///////////////////////
            Data.optionStartNormaltime = $scope.user.optionStartNormaltime;
            Data.optionEndNormaltime = $scope.user.optionEndNormaltime;
            /////////////////////////////////////////////
            Data.optionStarttimeAvailable = $scope.user.optionStarttimeAvailable;
            Data.optionEndtimeAvailable = $scope.user.optionEndtimeAvailable;
            Data.dataMon = $scope.user.dataMon;
            Data.dataTue = $scope.user.dataTue;
            Data.dataWen = $scope.user.dataWen;
            Data.dataThu = $scope.user.dataThu;
            Data.dataFri = $scope.user.dataFri;
            Data.dataSat = $scope.user.dataSat;
            Data.dataSun = $scope.user.dataSun;
            try {
                var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                ins.properties.ivz_specialcheking = converttrue($scope.user.actionfn);
                ins.properties.ivz_specialchecking = parseInt($scope.user.optionDay);
                ins.properties.ivz_starttimechecking = parseInt($scope.user.optionStarttime);
                ins.properties.ivz_endtimechecking = parseInt($scope.user.optionEndtime);
                ins.properties.ivz_specialbilling = converttrue($scope.user.actionfn);
                ins.properties.ivz_specialday = parseInt($scope.user.optionBillingDay);
                ins.properties.ivz_specialformtime = parseInt($scope.user.optionStartBilltime);
                ins.properties.ivz_specialendtime = parseInt($scope.user.optionEndBilltime);
                ins.properties.ivz_specialcheking = converttrue($scope.user.actionfn);
                ins.properties.ivz_specialbilling = converttrue($scope.user.actionfn);
                ins.properties.ivz_specialoption = converttrue($scope.user.actionfn);
                ins.properties.ivz_specialmonday = converttrue($scope.user.dataMon);
                ins.properties.ivz_specialtuesday = converttrue($scope.user.dataTue);
                ins.properties.ivz_specialwednesday = converttrue($scope.user.dataWen);
                ins.properties.ivz_specialthursday = converttrue($scope.user.dataThu);
                ins.properties.ivz_specialfriday = converttrue($scope.user.dataFri);
                ins.properties.ivz_specialsaturday = converttrue($scope.user.dataSat);
                ins.properties.ivz_specialsunday = converttrue($scope.user.dataSun);
                ins.properties.ivz_availablefromtime = parseInt($scope.user.optionStartNormaltime);
                ins.properties.ivz_availabletotime = parseInt($scope.user.optionEndNormaltime);
                ins.properties.ivz_officehourfrom = parseInt($scope.user.optionStarttimeAvailable);
                ins.properties.ivz_officehourto = parseInt($scope.user.optionEndtimeAvailable);
                ins.save(function (er) {
                    if (er) {
                        alert('error ac 196 ' + er);
                    }
                });
            } catch (er) {
                alert("error300 " + er);
            }
            setTimeout(function () {
                $ionicLoading.hide();
                window.location.href = "#/app/addresstran/" + $stateParams.getguid;
            }, 2000);
            $scope.showLoadingProperTimes();
        }
        $scope.goback = function () {
            $ionicHistory.goBack(-1);
        }
    })



.controller('AccountAddressCtrl', function ($scope, $state, $stateParams, $cookies, Data, $ionicHistory, $ionicLoading, Darray) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        //Data.dataguid = $stateParams.getguid;
        $scope.user = {
            txtConName: Data.recivename,
            txtAddressProduct: '',
            optionProvince: '',
            optionDistrict: '',
            txtPostCode: ''
        };
        $scope.chk = {
            infomattxtConName: true,
            infomattxtAddressProduct: true,
            infomatoptionProvince: true,
            infomatoptionDistrict: true,
            infomattxtPostCode: true
        };

        ////////// Get districtid
        $scope.getdistricttranspot = function (darray) {
                GetDistrictById(darray, function (data) {
                    $scope.DistrictlistTransport = data;
                });
            }
            ///////// check null ///////////////
        $scope.chknull = function (idval, txtname) {
            if (idval == 1) {
                if (txtname) {
                    $scope.chk.infomattxtConName = true;
                } else {
                    $scope.chk.infomattxtConName = false;
                }
            } else if (idval == 2) {
                if (txtname) {
                    $scope.chk.infomattxtAddressProduct = true;
                } else {
                    $scope.chk.infomattxtAddressProduct = false;
                }
            } else if (idval == 3) {
                if (txtname) {
                    $scope.chk.infomattxtPostCode = true;
                } else {
                    $scope.chk.infomattxtPostCode = false;
                }
            }
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.user.txtAddressProduct = Data.addressname;
          $scope.user.optionProvince = Data.provinceid;
          ////////// Get Province
          GetProvinceList(function (data) {
              $scope.ProvinceDataList = data;
              if($scope.$phase){$scope.$apply();}
          });
          if(Data.districtid){
            $scope.getdistricttranspot(Data.provinceid);
            $scope.user.optionDistrict = Data.districtid;
          }
          $scope.user.txtPostCode = Data.zipcode;
        });

        $scope.insertaccount = function () {
            if ($scope.user.txtConName) {
                $scope.chk.infomattxtConName = true;
            } else {
                $scope.chk.infomattxtConName = false;
            }
            if ($scope.user.txtAddressProduct) {
                $scope.chk.infomattxtAddressProduct = true;
            } else {
                $scope.chk.infomattxtAddressProduct = false;
            }
            if ($scope.user.optionProvince) {
                $scope.chk.infomatoptionProvince = true;
            } else {
                $scope.chk.infomatoptionProvince = false;
            }
            if ($scope.user.optionDistrict) {
                $scope.chk.infomatoptionDistrict = true;
            } else {
                $scope.chk.infomatoptionDistrict = false;
            }
            if ($scope.user.txtPostCode) {
                $scope.chk.infomattxtPostCode = true;
            } else {
                $scope.chk.infomattxtPostCode = false;
            }

            if ($scope.chk.infomattxtConName == true &&
                $scope.chk.infomattxtAddressProduct == true &&
                $scope.chk.infomatoptionProvince == true &&
                $scope.chk.infomatoptionDistrict == true &&
                $scope.chk.infomattxtPostCode == true) {

                Darray.txtname = $scope.user.txtConName; //Set Parameter
                Darray.txtaddress = $scope.user.txtAddressProduct; //Set Parameter
                Darray.provinceid = $scope.user.optionProvince; //Set Parameter
                Darray.districtid = $scope.user.optionDistrict; //Set Parameter
                Darray.zipcode = $scope.user.txtPostCode; //Set Parameter

                console.log('Update DB');
                //user.txtConName
                // user.txtAddressProduct
                // user.optionProvince
                // user.optionDistrict
                // user.txtPostCode
                Data.addressname = $scope.user.txtAddressProduct;
                Data.provinceid = $scope.user.optionProvince;
                Data.districtid = $scope.user.optionDistrict;
                Data.zipcode = $scope.user.txtPostCode;
                try {
                    var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                    ins.properties.address2_addresstypecode = parseInt(2); //delivery
                    ins.properties.address2_name = $scope.user.txtConName;
                    ins.properties.address2_line1 = $scope.user.txtAddressProduct;
                    ins.properties.ivz_address2province = new MobileCRM.Reference('ivz_addressprovince', $scope.user.optionProvince);
                    ins.properties.ivz_address2district = new MobileCRM.Reference('ivz_addressdistrict', $scope.user.optionDistrict);
                    ins.properties.address2_postalcode = $scope.user.txtPostCode;
                    ins.save(function (er) {
                        if (er) {
                            alert('error ac 432 ' + er);
                        }
                    });
                } catch (er) {
                    alert("error436 " + er);
                }
                $scope.loadpage();
            }
            //comment
            //$scope.loadpage();
        }
        $scope.loadpage = function () {
            setTimeout(function () {
                $ionicLoading.hide();
                window.location.href = "#/app/addressinvoice/" + $stateParams.getguid;
            }, 600);
            $scope.showLoadingProperTimes();
        }
        $scope.goback = function () {
            $ionicHistory.goBack(-1);
        }
    })
    .controller('AccountAddressInvoiceCtrl', function ($scope, $state, $stateParams, $cookies, Data, $ionicHistory, $ionicLoading, Darray) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;

        //Data.dataguid = $stateParams.getguid;
        $scope.user = {
            txtConName: Darray.txtname,
            txtAddressProduct: Darray.txtaddress,
            optionProvince: Darray.provinceid,
            optionDistrict: Darray.districtid,
            txtPostCode: Darray.zipcode
        };
        $scope.chk = {
            infomattxtConName: true,
            infomattxtAddressProduct: true,
            infomatoptionProvince: true,
            infomatoptionDistrict: true,
            infomattxtPostCode: true
        };
        ////////// Get Province
        GetProvinceList(function (data) {
            $scope.ProvinceDataList = data;
            if($scope.$phase){$scope.$apply();}
        });
        ////////// Get districtid
        $scope.getdistricttranspot = function (darray) {
            //alert(darray+' :p: '+$scope.user.optionProvince)
            GetDistrictById(darray, function (data) {
                $scope.DistrictlistTransport = data;
                if($scope.$phase){$scope.$apply();}
            });
        }
        $scope.getdistricttranspot($scope.user.optionProvince);
        ///////// check null ///////////////
        $scope.chknull = function (idval, txtname) {
            if (idval == 1) {
                if (txtname) {
                    $scope.chk.infomattxtConName = true;
                } else {
                    $scope.chk.infomattxtConName = false;
                }
            } else if (idval == 2) {
                if (txtname) {
                    $scope.chk.infomattxtAddressProduct = true;
                } else {
                    $scope.chk.infomattxtAddressProduct = false;
                }
            } else if (idval == 3) {
                if (txtname) {
                    $scope.chk.infomattxtPostCode = true;
                } else {
                    $scope.chk.infomattxtPostCode = false;
                }
            }
        }


        $scope.insertaccount = function () {
            if ($scope.user.txtConName) {
                $scope.chk.infomattxtConName = true;
            } else {
                $scope.chk.infomattxtConName = false;
            }
            if ($scope.user.txtAddressProduct) {
                $scope.chk.infomattxtAddressProduct = true;
            } else {
                $scope.chk.infomattxtAddressProduct = false;
            }
            if ($scope.user.optionProvince) {
                $scope.chk.infomatoptionProvince = true;
            } else {
                $scope.chk.infomatoptionProvince = false;
            }
            if ($scope.user.optionDistrict) {
                $scope.chk.infomatoptionDistrict = true;
            } else {
                $scope.chk.infomatoptionDistrict = false;
            }
            if ($scope.user.txtPostCode) {
                $scope.chk.infomattxtPostCode = true;
            } else {
                $scope.chk.infomattxtPostCode = false;
            }

            if ($scope.chk.infomattxtConName == true &&
                $scope.chk.infomattxtAddressProduct == true &&
                $scope.chk.infomatoptionProvince == true &&
                $scope.chk.infomatoptionDistrict == true &&
                $scope.chk.infomattxtPostCode == true) {
                try {
                    var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                    ins.properties.address1_addresstypecode = parseInt(1); //invoice
                    ins.properties.address1_name = $scope.user.txtConName;
                    ins.properties.address1_line1 = $scope.user.txtAddressProduct;
                    ins.properties.ivz_addressprovince = new MobileCRM.Reference('ivz_addressprovince', $scope.user.optionProvince);
                    ins.properties.ivz_addressdistrict = new MobileCRM.Reference('ivz_addressdistrict', $scope.user.optionDistrict);
                    ins.properties.address1_postalcode = $scope.user.txtPostCode;
                    ins.save(function (er) {
                        if (er) {
                            alert('error ac 512 ' + er);
                        }
                    });
                } catch (er) {
                    alert("error516 " + er);
                }
                console.log('Update DB');
                $scope.loadpage();
            }
            //comment
            //$scope.loadpage();
        }
        $scope.loadpage = function () {
            setTimeout(function () {
                $ionicLoading.hide();
                window.location.href = "#/app/addressother/" + $stateParams.getguid;
            }, 600);
            $scope.showLoadingProperTimes();
        }
        $scope.goback = function () {
          $scope.reback();
            // $ionicHistory.goBack(-1);
        }
    })

.controller('AccountAddressOtherCtrl', function ($scope, $stateParams, $cookies, Data, $ionicHistory, $ionicLoading, $state) {
    $state.reload();
    Data.showcart = false;
    $scope.Data = Data;
    //Data.dataguid = $stateParams.getguid;

    $scope.loadpage = function () {
            setTimeout(function () {
                $ionicLoading.hide();
                window.location.href = "#/app/infotransport/" + $stateParams.getguid;
            }, 600);
            $scope.showLoadingProperTimes();
        }
        ////////// Get Province
    GetProvinceList(function (data) {
        $scope.ProvinceDataList = data;
        if($scope.$phase){$scope.$apply();}
    });
    ////////// Get districtid
    $scope.getdistricttranspot = function (darray) {
        GetDistrictById(darray, function (data) {
            $scope.DistrictlistTransport = data;
            if($scope.$phase){$scope.$apply();}
        });
    }

    $scope.user = {
        txtConName: '',
        txtAddressProduct: '',
        optionProvince: '',
        optionDistrict: '',
        txtPostCode: ''
    };

    $scope.goback = function () {
        $ionicHistory.goBack(-1);
    }
    $scope.$on('$ionicView.enter',function(){
      $scope.user.txtConName = Data.othername;
      $scope.user.txtAddressProduct = Data.otheraddress;
      $scope.user.optionProvince = Data.otherprovinceid;
      GetDistrictById(Data.otherprovinceid, function (data) {
          $scope.DistrictlistTransport = data;
          if($scope.$phase){$scope.$apply();}
      });
      $scope.user.optionDistrict = Data.otherdistrictid;
      $scope.user.txtPostCode = Data.otherzipcode;
    });
    $scope.insertaccount = function () {
        if ($scope.user.txtConName) {
          Data.othername = $scope.user.txtConName;
          Data.otheraddress = $scope.user.txtAddressProduct;
          Data.otherprovinceid = $scope.user.optionProvince;
          Data.otherdistrictid = $scope.user.optionDistrict;
          Data.otherzipcode = $scope.user.txtPostCode;
            try {
                var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                ins.properties.ivz_address3_name = $scope.user.txtConName;
                ins.properties.ivz_docaddress = $scope.user.txtAddressProduct;
                ins.properties.ivz_docprovinceid = new MobileCRM.Reference('ivz_addressprovince', $scope.user.optionProvince);
                ins.properties.ivz_docdistrict = new MobileCRM.Reference('ivz_addressdistrict', $scope.user.optionDistrict);
                ins.properties.ivz_doczipcode = $scope.user.txtPostCode;
                ins.save(function (er) {
                    if (er) {
                        alert('error ac 548 ' + er);
                    }
                });
            } catch (er) {
                alert("error552 " + er);
            }
            console.log('update other address');
        } else {
            console.log('Not Update');
        }
        $scope.loadpage();
    }
})


.controller('AccountTransportCtrl', function ($scope, $stateParams, $cookies, Data, $ionicHistory, $state ,Setting) {
    $state.reload();
    Data.showcart = false;
    $scope.Data = Data;
    //Data.dataguid = $stateParams.getguid;
    $scope.user = {
        txtTransport: Setting.transportname,
        telTransport: Setting.transporttel,
        billvat: Data.billvat,
        txtRemarkTransport: Data.txtRemarkTransport
    };
    $scope.chk = {
        infomattxtTransport: true,
        infomattelTransport: true
    };
    $scope.chknull = function (idval, txtname) {
        if (idval == 1) {
            if (txtname) {
                $scope.chk.infomattxtTransport = true;
            } else {
                $scope.chk.infomattxtTransport = false;
            }
        } else if (idval == 2) {
            if (txtname) {
                $scope.chk.infomattelTransport = true;
            } else {
                $scope.chk.infomattelTransport = false;
            }
        }
    }
    $scope.insertaccount = function () {
        if ($scope.chk.infomattxtTransport == true && $scope.chk.infomattelTransport == true) {
            Data.transname = $scope.user.txtTransport;
            Data.teltran = $scope.user.telTransport;
            Data.billvat = $scope.user.billvat;
            Data.txtRemarkTransport = $scope.user.txtRemarkTransport;
            try {
                var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                ins.properties.ivz_transport = $scope.user.txtTransport;
                ins.properties.ivz_transporttel = $scope.user.telTransport;
                ins.properties.ivz_remarktransporter = $scope.user.txtRemarkTransport;
                ins.properties.ivz_printbillvat = converttrue($scope.user.billvat);
                ins.save(function (er) {
                    if (er) {
                        alert('error ac 613 ' + er);
                    } else {
                        window.location.href = "#/app/document/" + $stateParams.getguid;
                    }
                });
            } catch (er) {
                alert("error617 " + er);
            }
            console.log('Insert DB');
        } else {
            console.log('Not Insert');
        }
    }
    $scope.goback = function () {
        $ionicHistory.goBack(-1);
    }
})


.controller('AccountDocumentCtrl', function ($scope, $stateParams, $cookies, Data, $ionicHistory, $ionicLoading, actype, $state) {
    $state.reload();
    Data.showcart = false;
    $scope.Data = Data;
    //Data.dataguid = $stateParams.getguid;
    $scope.user = {
        peoplela1:Data.peoplela1,
        peoplela2:Data.peoplela2,
        statustype:Data.statustype,
        bs1:Data.bs1,
        bs2:Data.bs2,
        bs3:Data.bs3,
        bs4:Data.bs4,
        bs5:Data.bs5
    };
    $scope.chk = {
        docStatus:Data.docStatus,
        doc001:Data.doc001,
        doc004:Data.doc004,
        doc005:Data.doc005
    };


    $scope.loadpage = function () {
        setTimeout(function () {
            $ionicLoading.hide();
        }, 600);
        $scope.showLoadingProperTimesInsert();
    }
    $scope.chkswitch = function (idval, swtrue) {
        $scope.chk.docStatus = true;
        if ($scope.user.statustype) {
            if ($scope.user.statustype == 1) {
                $scope.user.peoplela2 = true;
                //$scope.chk.doc001 = true;
                $scope.user.peoplela1 = false;
            } else if ($scope.user.statustype == 2) {
                $scope.user.peoplela2 = false;
                //$scope.chk.doc001 = false;
                $scope.user.peoplela1 = true;
            }
        }
        ///////////////////////////////////
        if (idval == 1) {
            if (swtrue == true) {
                $scope.user.statustype = 2;
            } else {
                $scope.user.statustype = 1;
            }
        } else if (idval == 2) {
            if (swtrue == true) {
                $scope.user.statustype = 1;
            } else {
                $scope.user.statustype = 2;
            }
        }
    }
    $('#doc001').change(function () {
        GetAtt('#doc001', '#idcImg01', 'canvas01', function (data) {
            $ionicLoading.hide();
            $scope.chk.doc001 = true;
            $scope.user.bs1 = data;
            //console.log(data.length);
        });
    });
    $('#doc002').change(function () {
        GetAtt('#doc002', '#idcImg02', 'canvas02', function (data) {
            $ionicLoading.hide();
            $scope.chk.doc001 = true;
            $scope.user.bs2 = data;
            console.log(data.length);
        });
    });
    $('#doc003').change(function () {
        GetAtt('#doc003', '#idcImg03', 'canvas03', function (data) {
            $ionicLoading.hide();
            $scope.chk.doc001 = true;
            $scope.user.bs3 = data;
        });
    });
    $('#doc004').change(function () {
        GetAtt('#doc004', '#idcImg04', 'canvas04', function (data) {
            $ionicLoading.hide();
            $scope.chk.doc004 = true;
            $scope.user.bs4 = data;
        });
    });
    $('#doc005').change(function () {
        GetAtt('#doc005', '#idcImg05', 'canvas05', function (data) {
            $ionicLoading.hide();
            $scope.chk.doc005 = true;
            $scope.user.bs5 = data;
        });
    });
    $scope.insertaccount = function () {
        var a = $scope.user.bs1;
        var b = $scope.user.bs2;
        var c = $scope.user.bs3;
        var d = $scope.user.bs4;
        var e = $scope.user.bs5;
        if ($scope.user.statustype) {
            $scope.chk.docStatus = true;
            if ($scope.user.statustype == 2) {
                if (a.length >= 1 || b.length >= 1 || c.length >= 1) {
                    $scope.chk.doc001 = true;
                } else {
                    $scope.chk.doc001 = false;
                }
                if (d.length >= 1) {
                    $scope.chk.doc004 = true;
                } else {
                    $scope.chk.doc004 = false;
                }
                if (e.length >= 1) {
                    $scope.chk.doc005 = true;
                } else {
                    $scope.chk.doc005 = false;
                }
                if ($scope.chk.doc001 == true && $scope.chk.doc004 == true && $scope.chk.doc005 == true) {
                    actype.actype = 2;
                    /// insert a
                    if (a.length >= 1) {
                        setTimeout(function () {
                            $scope.InAnnoteAttract('account', Data.dataguid, $scope.user.bs1, 'สำเนาหนังสือรับรองการจดทะเบียนพาณิชย์ร้านร้าน' + Data.businessname + ' ', 3, function () {

                            });
                            console.log('insert a');
                        }, 10000);
                    }
                    /// insert b
                    if (b.length >= 1) {
                        setTimeout(function () {
                            $scope.InAnnoteAttract('account', Data.dataguid, $scope.user.bs2, 'ทะเบียนภาษีมูลค่าเพิ่ม( ภพ. 20)ร้าน' + Data.businessname + ' ', 3, function () {

                            });
                            console.log('insert b');
                        }, 15000);
                    }
                    /// insert c
                    if (c.length >= 1) {
                        setTimeout(function () {
                            $scope.InAnnoteAttract('account', Data.dataguid, $scope.user.bs3, 'หนังสือรับรองบริษัทร้าน' + Data.businessname + ' ', 3, function (ert) {
                                if (ert) {
                                    //alert(ert);
                                }
                            });
                            console.log('insert c');
                        }, 20000);
                    }
                    /// insert d
                    if (d.length >= 1) {
                        $scope.InAnnoteAttract('account', Data.dataguid, $scope.user.bs4, 'สำเนาทะเบียนบ้านร้าน' + Data.businessname + ' ', 3, function (ert) {
                            if (ert) {
                                //alert(ert);
                            }
                        });
                        console.log('insert d');
                    }
                    /// insert e
                    if (e.length >= 1) {
                        setTimeout(function () {
                            $scope.InAnnoteAttract('account', Data.dataguid, $scope.user.bs5, 'สำเนาประจำตัวบัตรประชาชนร้าน' + Data.businessname + ' ', 3, function (ert) {
                                if (ert) {
                                    //alert(ert);
                                }
                            });
                            console.log('insert e');
                        }, 6000);
                    }
                    setTimeout(function () {
                        $ionicLoading.hide();
                        window.location.href = "#/app/accountcredit/" + $stateParams.getguid;
                        try {
                            Data.StoreDoc = 1;
                            Data.custermertype = 2;
                            var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                            ins.properties.ivz_statustype = parseInt(2);
                            if (a.length > 1) {
                                ins.properties.ivz_doc01 = parseInt(1);
                            } else {
                                ins.properties.ivz_doc01 = parseInt(0);
                            }
                            if (b.length > 1) {
                                ins.properties.ivz_doc02 = parseInt(1);
                            } else {
                                ins.properties.ivz_doc02 = parseInt(0);
                            }
                            if (c.length > 1) {
                                ins.properties.ivz_doc03 = parseInt(1);
                            } else {
                                ins.properties.ivz_doc03 = parseInt(0);
                            }
                            if (d.length > 1) {
                                ins.properties.ivz_dochouseholdregis = parseInt(1);
                            } else {
                                ins.properties.ivz_dochouseholdregis = parseInt(0);
                            }
                            if (e.length > 1) {
                                ins.properties.ivz_docidcard = parseInt(1);
                            } else {
                                ins.properties.ivz_docidcard = parseInt(0);
                            }
                            ins.save(function (er) {
                                if (er) {
                                    alert('error ac 664 ' + er);
                                }
                            });
                        } catch (er) {
                            alert("error668" + er);
                        }
                        console.log('update people 2');
                    }, 25000);

                } else {
                    console.log('not update');
                }
            } else if ($scope.user.statustype == 1) {
                actype.actype = 1;
                if (d.length >= 1) {
                    $scope.chk.doc004 = true;
                } else {
                    $scope.chk.doc004 = false;
                }
                if (e.length >= 1) {
                    $scope.chk.doc005 = true;
                } else {
                    $scope.chk.doc005 = false;
                }
                if ($scope.chk.doc004 == true && $scope.chk.doc005 == true) {
                    $scope.showLoadingProperTimesReg();
                    /// insert d
                    if (d.length >= 1) {
                        $scope.InAnnoteAttract('account', Data.dataguid, $scope.user.bs4, 'สำเนาทะเบียนบ้านร้าน' + Data.businessname + ' ', 3, function (ert) {
                            if (ert) {
                                //alert(ert);
                            }
                        });
                        console.log('insert d');
                    }
                    /// insert e
                    if (e.length >= 1) {
                        setTimeout(function () {
                            $scope.InAnnoteAttract('account', Data.dataguid, $scope.user.bs5, 'สำเนาประจำตัวบัตรประชาชนร้าน' + Data.businessname + ' ', 3, function (ert) {
                                if (ert) {
                                    //  alert(ert);
                                }
                            });
                            console.log('insert e');
                        }, 6000);
                    }
                    setTimeout(function () {
                        $ionicLoading.hide();
                        try {
                            Data.StoreDoc = 1;
                            Data.custermertype = 1;
                            var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                            ins.properties.ivz_statustype = parseInt(1);
                            ins.properties.ivz_doc01 = parseInt(0);
                            ins.properties.ivz_doc02 = parseInt(0);
                            ins.properties.ivz_doc03 = parseInt(0);
                            if (d.length > 1) {
                                ins.properties.ivz_dochouseholdregis = parseInt(1);
                            } else {
                                ins.properties.ivz_dochouseholdregis = parseInt(0);
                            }
                            if (e.length > 1) {
                                ins.properties.ivz_docidcard = parseInt(1);
                            } else {
                                ins.properties.ivz_docidcard = parseInt(0);
                            }
                            ins.save(function (er) {
                                if (er) {
                                    alert('error ac 664 ' + er);
                                }
                            });
                        } catch (er) {
                            alert("error668" + er);
                        }
                        window.location.href = "#/app/accountcredit/" + $stateParams.getguid;
                        console.log('update people 1');
                    }, 10000);
                } else {
                    console.log('not update');
                }
            }
        } else {
            $scope.chk.docStatus = false;
        }
        // console.log('Status type:'+$scope.user.statustype);
            Data.peoplela1 = $scope.user.peoplela1;
            Data.peoplela2 = $scope.user.peoplela2;
            Data.statustype = $scope.user.statustype;
            Data.bs1 = $scope.user.bs1;
            Data.bs2 = $scope.user.bs2;
            Data.bs3 = $scope.user.bs3;
            Data.bs4 = $scope.user.bs4;
            Data.bs5 = $scope.user.bs5;
            Data.docStatus = $scope.chk.docStatus;
            Data.doc001 = $scope.chk.doc001;
            Data.doc004 = $scope.chk.doc004;
            Data.doc005 = $scope.chk.doc005;

    }
    $scope.goback = function () {
        $ionicHistory.goBack(-1);
    }
})



.controller('AccountCreditCtrl', function ($scope, $stateParams, $cookies, Data, $compile, actype, $ionicHistory, $ionicLoading, $state) {
        $state.reload();
        $scope.$on('$ionicView.enter',function(){
          Data.showcart = false;
        });
        $scope.Data = Data;
        //Data.mastertype = $stateParams.getguid;

        $scope.user = {
            optionPayment:Data.optionPayment,
            txtCreditlimit:Data.txtCreditlimit,
            optionPaymentType:Data.optionPaymentType,
            optionPaymentBank:Data.optionPaymentBank,
            txtBankAccount: Data.txtBankAccount,
            txtBankBranch:Data.txtBankBranch,
            optionPaymentbnkYss:Data.optionPaymentbnkYss
        };
        $scope.$on('$ionicView.enter',function(){
          GetPayMentTerm(function (data) {
              $scope.PaymentTermOptions = data;
          });
          GetPayMentOption(function (data) {
              $scope.PaymentOptions = data;
          });
          GetBankName(function (data) {
              $scope.bankname = data;
          });
          GetBankNameYss(function (data) {
              $scope.banknameyss = data;
          });
          if (actype.actype == 1) {
              $scope.user.optionPayment = 100000011; //Set SD-cash
              $scope.user.optionPaymentType = 917970002;
              $scope.chk.diabledcredit = true;
          } else if (actype.actype == 2) {
              $scope.user.optionPayment = 100000014; //Set SD-30 โอน
              $scope.user.optionPaymentType = 917970000;
              $scope.chk.diabledcredit = false;
          }
          if(Data.cashoption){
            $scope.user.optionPayment = Data.cashoption;
          }
          if(Data.cashcredit){
            $scope.user.txtCreditlimit = Data.cashcredit;
          }
          if(Data.fncash){
            $scope.user.optionPaymentType = Data.fncash;
          }
          if(Data.bankname){
            $scope.user.optionPaymentBank = Data.bankname;
          }
          if(Data.bankaccount){
            $scope.user.txtBankAccount = Data.bankaccount;
          }
          if(Data.banknumber){
            $scope.user.txtBankBranch = Data.banknumber;
          }
          if(Data.bankyss){
            $scope.user.optionPaymentbnkYss = Data.bankyss;
          }
        });
        $scope.chk = {
            optionPayment:Data.optionPayment,
            txtCreditlimit:Data.txtCreditlimit,
            optionPaymentType:Data.optionPaymentType,
            optionPaymentbnkYss:Data.optionPaymentbnkYss,
            diabledcredit:Data.diabledcredit
        };
        $scope.chknull = function (txtname) {
            if (txtname > 1) {
                $scope.chk.txtCreditlimit = true;
            } else {
                $scope.chk.txtCreditlimit = false;
            }
        }
        $scope.insertaccount = function () {
          Data.optionPayment = $scope.user.optionPayment;
          Data.txtCreditlimit = $scope.user.txtCreditlimit;
          Data.optionPaymentType = $scope.user.optionPaymentType;
          Data.optionPaymentBank = $scope.user.optionPaymentBank;
          Data.txtBankAccount = $scope.user.txtBankAccount;
          Data.txtBankBranch = $scope.user.txtBankBranch;
          Data.optionPaymentbnkYss = $scope.user.optionPaymentbnkYss;
          Data.optionPayment = $scope.chk.optionPayment;
          Data.txtCreditlimit = $scope.chk.txtCreditlimit;
          Data.optionPaymentType = $scope.chk.optionPaymentType;
          Data.optionPaymentbnkYss = $scope.chk.optionPaymentbnkYss;
          Data.diabledcredit = $scope.chk.diabledcredit;
            if (actype.actype == 1) {
                try {
                    var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                    ins.properties.paymenttermscode = parseInt($scope.user.optionPayment);
                    ins.properties.creditlimit = parseInt($scope.user.txtCreditlimit);
                    ins.properties.ivz_paymentoption = parseInt($scope.user.optionPaymentType);
                    ins.properties.ivz_banknamecustomer = parseInt($scope.user.optionPaymentBank);
                    ins.properties.ivz_bankaccount = $scope.user.txtBankAccount;
                    ins.properties.ivz_bankaccountnumber = $scope.user.txtBankBranch;
                    ins.properties.ivz_bankname = $scope.user.optionPaymentbnkYss;
                    ins.save(function (er) {
                        if (er) {
                            alert('error ac 5117 ' + er);
                        }
                    });
                } catch (er) {
                    alert("error809" + er);
                }
                console.log('insert credit 1');
                window.location.href = "#/app/infomart/" + $stateParams.getguid;
            } else if (actype.actype == 2) {
                var j = parseInt($scope.user.txtCreditlimit);
                if (j > 0) {
                    try {
                        var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                        ins.properties.paymenttermscode = parseInt($scope.user.optionPayment);
                        ins.properties.creditlimit = parseInt($scope.user.txtCreditlimit);
                        ins.properties.ivz_paymentoption = parseInt($scope.user.optionPaymentType);
                        ins.properties.ivz_banknamecustomer = parseInt($scope.user.optionPaymentBank);
                        ins.properties.ivz_bankaccount = $scope.user.txtBankAccount;
                        ins.properties.ivz_bankaccountnumber = $scope.user.txtBankBranch;
                        ins.properties.ivz_bankname = $scope.user.optionPaymentbnkYss;
                        ins.save(function (er) {
                            if (er) {
                                alert('error ac 5140 ' + er);
                            }
                        });
                    } catch (er) {
                        alert("error809" + er);
                    }
                    console.log('insert credit 2');
                    $scope.chk.txtCreditlimit = true;
                    window.location.href = "#/app/infomart/" + $stateParams.getguid;
                } else {
                    $scope.chk.txtCreditlimit = false;
                }
            }
        }
        $scope.goback = function () {
            $ionicHistory.goBack(-1);
        }
    })
    /*------------------------------- info mar----------------------------*/
    .controller('AccountInfoMartCtrl', function ($scope, $state, $stateParams, $cookies, Data, $compile, $ionicHistory, $ionicLoading) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        //Data.mastertype = $stateParams.getguid;
        $scope.user = {
            SalePart1:Data.SalePart1,
            SalePart2:Data.SalePart2,
            SalePart3:Data.SalePart3,
            //////////////////////////////
            SalePart4:Data.SalePart4,
            SalePart5:Data.SalePart5,
            SalePart6:Data.SalePart6,
            doc:Data.doc,
            PlaceStatus1:Data.PlaceStatus1,
            PlaceStatus2:Data.PlaceStatus2,
            tatofactory:Data.tatofactory,
            tatolnumber:Data.tatolnumber
        };
        $scope.chk = {
            SalesPart1:Data.SalesPart1,
            SalesPart2:Data.SalesPart2,
            doc006:Data.doc006,
            PlaceStatus:Data.PlaceStatus,
            tatofactory:Data.tatofactory,
            tatolnumber:Data.tatolnumber
        };
        if(Data.doc.length > 0){
          $('.divimg').remove();
          // 	console.log(data.length);
          $scope.user.doc.push(data);
          var datapush = $scope.user.doc;
          //console.log(datapush.length);
          if (datapush.length > 0) {
              for (var i in datapush) {
                  var html = '<div class="col col-20 divimg">' +
                      '<img class="thumbnail" src="data:image/jpeg;base64,' + datapush[i] + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
                      '</div>';
                  angular.element(document.getElementById('divspace')).append($compile(html)($scope));
              }
          } else {
              var html = '<div class="col col-20">' +
                  '<img class="thumbnail" src="data:image/jpeg;base64,' + data + '่" width="100" height="100"  ng-click="removeimg(' + i + ')"/>' +
                  '</div>';
              angular.element(document.getElementById('divspace')).append($compile(html)($scope));
          }
        }
        $scope.removeimg = function (id) {
            console.log(id);
            $('.divimg').remove();
            //console.log("Click remove "+id);
            var data = $scope.user.doc;
            data.splice(id, 1);
            if (data.length > 0) {
                for (var i in data) {
                    var html = '<div class="col col-20 divimg">' +
                        '<img class="thumbnail" src="data:image/jpeg;base64,' + data[i] + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
                        '</div>';
                    angular.element(document.getElementById('divspace')).append($compile(html)($scope));
                }
            }
        }
        $('#doc006').change(function () {
            GetAtt('#doc006', '#idcImg06', 'canvas06', function (data) {
                $('.divimg').remove();
                // 	console.log(data.length);
                $scope.user.doc.push(data);
                var datapush = $scope.user.doc;
                //console.log(datapush.length);
                if (datapush.length > 0) {
                    for (var i in datapush) {
                        var html = '<div class="col col-20 divimg">' +
                            '<img class="thumbnail" src="data:image/jpeg;base64,' + datapush[i] + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
                            '</div>';
                        angular.element(document.getElementById('divspace')).append($compile(html)($scope));
                    }
                } else {
                    var html = '<div class="col col-20">' +
                        '<img class="thumbnail" src="data:image/jpeg;base64,' + data + '่" width="100" height="100"  ng-click="removeimg(' + i + ')"/>' +
                        '</div>';
                    angular.element(document.getElementById('divspace')).append($compile(html)($scope));
                }
            });
        });

        $scope.chknull = function (idval, txtnull) {
            console.log(txtnull);
            if (idval == 1) {
                if (txtnull) {
                    $scope.chk.tatofactory = true;
                } else {
                    $scope.chk.tatofactory = false;
                }
            } else if (idval == 2) {
                if (txtnull) {
                    $scope.chk.tatolnumber = true;
                } else {
                    $scope.chk.tatolnumber = false;
                }
            }
        }
        $scope.insertaccount = function () {
            if ($scope.user.SalePart1 == true || $scope.user.SalePart2 == true || $scope.user.SalePart3 == true) {
                $scope.chk.SalesPart1 = true;
            } else {
                $scope.chk.SalesPart1 = false;
            }
            if ($scope.user.SalePart4 == true || $scope.user.SalePart5 == true || $scope.user.SalePart6 == true) {
                $scope.chk.SalesPart2 = true;
            } else {
                $scope.chk.SalesPart2 = false;
            }
            var j = $scope.user.doc;
            if (j.length > 0) {
                $scope.chk.doc006 = true;
            } else {
                $scope.chk.doc006 = false;
            }
            if ($scope.user.PlaceStatus1 == true || $scope.user.PlaceStatus2 == true) {
                $scope.chk.PlaceStatus = true;
            } else {
                $scope.chk.PlaceStatus = false;
            }
            var a = $scope.user.tatofactory;
            var b = $scope.user.tatolnumber;
            if (a) {
                $scope.chk.tatofactory = true;
            } else {
                $scope.chk.tatofactory = false;
            }
            if (b) {
                $scope.chk.tatolnumber = true;
            } else {
                $scope.chk.tatolnumber = false;
            }

            if ($scope.chk.SalesPart1 == true &&
                $scope.chk.SalesPart2 == true &&
                $scope.chk.doc006 == true &&
                $scope.chk.PlaceStatus == true &&
                $scope.chk.tatofactory == true &&
                $scope.chk.tatolnumber == true) {

                try {
                    $scope.showLoadingProperTimesRegter('กำลังบันทึกข้อมูลเกี่ยวกับร้าน' + Data.businessname);
                    var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                    ins.properties.ivz_locationlease = converttrue($scope.user.PlaceStatus1);
                    ins.properties.ivz_locationbuy = converttrue($scope.user.PlaceStatus2);
                    ins.properties.ivz_typemoto = converttrue($scope.user.SalePart1);
                    ins.properties.ivz_typeauto = converttrue($scope.user.SalePart2);
                    ins.properties.ivz_typebigbike = converttrue($scope.user.SalePart3);
                    ins.properties.ivz_typeshoporiginal = converttrue($scope.user.SalePart4);
                    ins.properties.ivz_typeshopaccessories = converttrue($scope.user.SalePart5);
                    ins.properties.ivz_typeinstallservice = converttrue($scope.user.SalePart6);
                    ins.properties.ivz_numberofplace = $scope.user.tatofactory;
                    ins.properties.ivz_numberofemployee = $scope.user.tatolnumber;
                    ins.save(function (er) {
                        if (er) {
                            alert('error ac 966 ' + er);
                        }
                    });
                } catch (er) {
                    alert("error970" + er);
                }


                var datapush = $scope.user.doc;
                var x = 0;
                var loopArray = function (arr) {
                    inserta(x, function () {
                        x++;
                        if (x < arr.length) {
                            loopArray(arr);
                        } else {
                            $scope.showLoadingProperTimesRegterComplete();
                            setTimeout(function () {
                                $ionicLoading.hide();
                                $state.go('app.contactus', {
                                    getguid: $stateParams.getguid
                                });
                            }, 2000);
                        }
                    });
                }
                loopArray(datapush);

                function inserta(j, callback) {
                    try {
                        $scope.showLoadingProperTimesRegter('กำลังบันทึกข้อมูลเกี่ยวกับร้าน' + Data.businessname + ' รูปที่ ' + j);
                        var note = MobileCRM.DynamicEntity.createNew("annotation");
                        note.properties.objectid = new MobileCRM.Reference('account', Data.dataguid);
                        note.properties.notetext = 2;
                        note.properties.subject = 'ข้อมูลเกี่ยวกับร้าน' + Data.businessname + ' รูปที่ ' + j;
                        note.properties.documentbody = datapush[j];
                        note.properties.mimetype = fileType;
                        note.properties.isdocument = true;
                        note.properties.filesize = parseInt(sizeKB);
                        note.properties.filename = fileName;
                        note.save(
                            function (er) {
                                if (er) {
                                    alert(Data.businessname + '\n' + er);
                                } else {
                                    callback();
                                }
                            });
                    } catch (er) {
                        alert('insert doc ' + Data.businessname + ' รูปที่ ' + j + '\n' + er);
                    }
                }
            }
                Data.SalePart1 = $scope.user.SalePart1;
                Data.SalePart2 = $scope.user.SalePart2;
                Data.SalePart3 = $scope.user.SalePart3;
                //////////////////////////////
                Data.SalePart4 = $scope.user.SalePart4;
                Data.SalePart5 = $scope.user.SalePart5;
                Data.SalePart6 = $scope.user.SalePart6;
                Data.doc = $scope.user.doc;
                Data.PlaceStatus1 = $scope.user.PlaceStatus1;
                Data.PlaceStatus2 = $scope.user.PlaceStatus2;
                Data.tatofactory = $scope.user.tatofactory;
                Data.tatolnumber = $scope.user.tatolnumber;
                Data.SalesPart1 = $scope.chk.SalesPart1;
                Data.SalesPart2 = $scope.chk.SalesPart2;
                Data.doc006 = $scope.chk.doc006;
                Data.PlaceStatus = $scope.chk.PlaceStatus;
                Data.tatofactory = $scope.chk.tatofactory;
                Data.tatolnumber = $scope.chk.tatolnumber;
        }
        $scope.goback = function () {
            $ionicHistory.goBack(-1);
        }
    })
    /*----------------------- contact us ---------------------------*/
    .controller('AccountContactUsCtrl', function ($scope, Darray, $stateParams, $cookies, Data, arcontact, $compile, $ionicHistory, $ionicLoading, $state) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        //Data.mastertype = $stateParams.getguid;
        console.log('load :' + $stateParams.getguid);
        $scope.getguid = $stateParams.getguid;
        $scope.user = {
            doc: []
        };
        $scope.chk = {
            othercontact: true
        }
        $scope.listcontact = arcontact.contact;
        $scope.removecontact = function (index) {
            $scope.listcontact.splice(index, 1);
        }
        $scope.insertaccount = function () {
            var contact = $scope.listcontact;
            console.log('click ' + contact.length);
            if (contact.length > 0) {
                $scope.chk.othercontact = true;
                var x = 0;
                var loopArray = function (arr) {
                    customInsert(x, function (diug) {
                        customAttract(x, diug, function () {
                            x++;
                            if (x < arr.length) {
                                loopArray(arr);
                            } else {
                                //alert('Complete');
                                $ionicLoading.hide();
                                window.location.href = "#/app/companyus/" + $stateParams.getguid;
                            }
                        });
                    });
                }
                loopArray(contact);

                function customInsert(msg, callback) {
                    //alert('customInsert:'+contact[msg].firstname);
                    try {
                        $scope.showLoadingProperTimesRegter('กำลังบันทึกข้อมูลผู้ติดต่อ ' + contact[msg].firstname + ' ' + contact[msg].lastname);
                        var cuid = guid();
                        var ins = MobileCRM.DynamicEntity.createNew("contact");
                        ins.properties.contactid = cuid;
                        ins.properties.parentcustomerid = new MobileCRM.Reference('account', Data.dataguid);
                        ins.properties.firstname = contact[msg].firstname;
                        ins.properties.lastname = contact[msg].lastname;
                        ins.properties.telephone1 = contact[msg].tel;
                        ins.properties.address1_line1 = Darray.txtaddress;
                        ins.properties.ivz_addressprovince = new MobileCRM.Reference('ivz_addressprovince', Darray.provinceid);
                        ins.properties.ivz_addressdistrict = new MobileCRM.Reference('ivz_addressdistrict', Darray.districtid);
                        ins.properties.address1_postalcode = Darray.zipcode;
                        ins.properties.statuscode = parseInt(917970001);
                        ins.properties.ivz_contacttype = parseInt(contact[msg].contacttype.val);
                        ins.save(function (er) {
                            if (er) {
                                alert("error 2329 " + er);
                            } else {
                                setTimeout(function () {
                                    callback(cuid);
                                }, 1000);
                            }
                        });
                    } catch (er) {
                        alert('error 2351 ' + er);
                    }
                }

                function customAttract(msg, diug, callback) {
                    var docl = contact[msg].doc;
                    //alert('customAttract:'+contact[msg].firstname+'::'+docl.length);
                    var title = contact[msg].firstname + ' ' + contact[msg].lastname + ' ผู้ติดต่อร้าน ' + Data.businessname;
                    $scope.InAnnoteAttract('contact', diug, contact[msg].doc, title, 1, function () {
                      setTimeout(function () {
                          callback();
                      }, 1000);
                    });
                }
                console.log('insert contact');
            } else {
                $scope.chk.othercontact = false;
                console.log('Not insert');
            }
        }
        $scope.goback = function () {
            $ionicHistory.goBack(-1);
        }
    })
    .controller('AccountContactUsAddCtrl', function ($scope, $stateParams, $cookies, Data, arcontact, $compile, $ionicHistory, $ionicLoading, $state) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        //Data.mastertype = $stateParams.getguid;
        $scope.getguid = $stateParams.getguid;
        $scope.user = {
            firstname: '',
            lastname: '',
            tel: '',
            type: '',
            contact: [],
            doc: ''
        };
        GetOptionContact(function (data) {
            $scope.contacttype = data;
        });

        $('#doc081').change(function () {
            GetAtt('#doc081', '#idcImg081', 'canvas081', function (data) {
                $scope.user.doc = data;
                $ionicLoading.hide();
            });
        });
        $scope.listcontact = $scope.user.contact;
        $scope.addcontact = function () {
            var j = $scope.user.contact;
            arcontact.contact.push({
                id: j.length + 1,
                firstname: $scope.user.firstname,
                lastname: $scope.user.lastname,
                tel: $scope.user.tel,
                contacttype: $scope.user.type,
                doc: $scope.user.doc
            });
            this.goback2();
        }
        $scope.insertaccount = function () {

        }
        $scope.goback2 = function () {
            $scope.user.firstname = '';
            $scope.user.lastname = '';
            $scope.user.tel = '';
            $scope.user.type = '';
            $scope.user.doc = '';
            $('#idcImg081').attr('src', '');
            $scope.listcontact = $scope.user.contact;
            window.location.href = "#/app/contactus/" + $stateParams.getguid;
        }
        $scope.goback = function () {
            $ionicHistory.goBack(-1);
        }
    })

.controller('AccountCompanyCtrl', function ($scope, $stateParams, $cookies, Data, $compile, $ionicHistory, $ionicLoading, arcontact, $state) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $scope.getguid = $stateParams.getguid;
        $scope.chk = {
            othercontact: true
        }
        $scope.listcompany = arcontact.company;
        $scope.removecontact = function (index) {
            $scope.listcompany.splice(index, 1);
        }
        $scope.insertcompany = function () {
            //alert('Click');
            var cota = $scope.listcompany;
            if (cota.length > 0) {
                var x = 0;
                var loopArray = function (arr) {
                    insertdocu(x, function () {
                        //alert('Inser company:'+x);
                        x++;
                        if (x < arr.length) {
                            loopArray(arr);
                        } else {
                            $ionicLoading.hide();
                            window.location.href = "#/app/confirmreg/" + $stateParams.getguid;
                        }
                    });
                }
                loopArray($scope.listcompany);

                function insertdocu(i, callback) {
                    if (cota[i].companyname) {
                        $scope.showLoadingProperTimesRegter('กำลังบันทึกข้อมูลติดต่อกับร้านค้า ' + cota[i].companyname);
                        console.log("insert cota");
                        try {
                            var ins = MobileCRM.DynamicEntity.createNew("ivz_custconnectiontable");
                            ins.properties.ivz_historycusttable = new MobileCRM.Reference('account', Data.dataguid);
                            ins.properties.ivz_name = cota[i].companyname;
                            ins.properties.ivz_ownername = cota[i].firstlastname;
                            ins.properties.ivz_phonemobile = cota[i].tel;
                            ins.properties.ivz_phonenumber = cota[i].tel;
                            ins.properties.ivz_salepoduct = cota[i].itemtype;
                            ins.save(
                                function (er) {
                                    if (er) {
                                        alert('error2424 ' + er);
                                    } else {
                                        callback();
                                    }
                                });
                        } catch (er) {
                            alert('error 2431 ' + er);
                        }
                    }
                }
                console.log('insert DB');
            } else {
                console.log('not update');
                window.location.href = "#/app/confirmreg/" + $stateParams.getguid;
            }
        }
        $scope.goback = function () {
            $ionicHistory.goBack(-1);
        }
    })
    .controller('AccountCompanyAddCtrl', function ($scope, $stateParams, $cookies, Data, $compile, $ionicHistory, $ionicLoading, arcontact, $state) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $scope.getguid = $stateParams.getguid;
        $scope.user = {
            companyname: '',
            firstlastname: '',
            orderper: '',
            tel: '',
            itemtype: ''
        };
        $scope.addcompany = function () {
            arcontact.company.push({
                companyname: $scope.user.companyname,
                firstlastname: $scope.user.firstlastname,
                orderper: $scope.user.orderper,
                tel: $scope.user.tel,
                itemtype: $scope.user.itemtype
            });
            this.goback();
        }
        $scope.goback = function () {
            $scope.user.companyname = '';
            $scope.user.firstlastname = '';
            $scope.user.orderper = '';
            $scope.user.tel = '';
            $scope.user.itemtype = '';
            window.location.href = "#/app/companyus/" + $stateParams.getguid;
        };
    })
    /*------------------------- Confirm Account -------------------------*/
    .controller('AccountConfirmCtrl', function ($scope, $state, $stateParams, $cookies, Data, $compile, $ionicHistory, $ionicLoading, $ionicViewService) {
        $state.reload();
        $scope.$on('$ionicView.enter',function(){
          Data.showcart = false;
        });
        $scope.Data = Data;
        $scope.getguid = $stateParams.getguid;
        $scope.chk = {
            infomat: ''
        };
        $scope.territoryid = $cookies.get('territoryid'); // set default from login
        var tol = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130];
        var tltxt = ['กำลังทำการบันทึกข้อมูลทั่วไป', 'กำลังทำการบันทึกข้อมูลเงื่อนไขการเข้าพบ', 'กำลังทำการบันทึกข้อมูลที่อยู่ส่งของ'
            , 'กำลังทำการบันทึกข้อมูลที่อยู่ Invoice', 'กำลังทำการบันทึกที่อยู่อื่นๆ'
            , 'กำลังทำการบันทึกข้อมูลที่อยู่ขนส่ง', 'กำลังทำการบันทึกข้อมูลเอกสารประกอบการเปิดบัญชี'
            , 'กำลังทำการบันทึกข้อมูลเครดิต', 'กำลังทำการบันทึกข้อมูลร้านค้า'
            , 'กำลังทำการบันทึกข้อมูลผู้ติดต่อข้อมูลร้านค้าที่ติดต่อ', 'กำลังทำการบันทึกยืนยันการเปิดบัญชี'
            , 'โปรดรอสักครู่', 'บันทึกข้อมูลเสร็จแล้ว'];

        var x = 0;
        var loopArray = function (arr) {
            updatecomfirm(x, function () {
                x++;
                if (x < arr.length) {
                    loopArray(arr);
                } else {
                    getTerEmp($scope.territoryid, function (data) {
                        if (data) {
                            confirmnew(insertTask);
                        }
                    });

                }
            });
        }
        loopArray(tltxt);
        /*-------------------- updatecomfirm -------------------------*/
        function updatecomfirm(i, callback) {
            $scope.showLoadingProperTimesRegter(tltxt[i]);
            $scope.chk.infomat = parseInt(tol[i]);
            setTimeout(function () {
                callback();
            }, 2000);
        }

        var insertTask = function() {
              if(Data.creditlimit > 100000){
                var title = 'เปิดบัญชีลูกค้าใหม่';
                var text = "เรียน  Sup./Sales Manger, รบกวนดำเนินการอนุมัติเปิดบัญชีลูกค้าใหม่เขตการขาย " +
                data[0].name + "  ลูกค้าชื่อ " +
                    Data.listregist + " ให้ด้วยครับ  ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                SendMail(data[0].ivz_leadermail, title, text);
              }else{
                var title = 'เปิดบัญชีลูกค้าใหม่';
                var text = "เรียน  Sup./Sales Manger, รบกวนดำเนินการอนุมัติเปิดบัญชีลูกค้าใหม่เขตการขาย " +
                data[0].name + "  ลูกค้าชื่อ " +
                    Data.listregist + " ให้ด้วยครับ  ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                SendMail(data[0].ivz_leadermail+';'+data[0].ivz_ccmail, title, text);
              }
              setTimeout(function () {
                  $ionicLoading.hide();
                  $ionicHistory.nextViewOptions({
                      disableBack: true
                  });
                  $state.go('app.accountlist', {
                      terriid: Data.termas,
                      mastertype: Data.mastertype
                  }, {
                      reload: true
                  });
              }, 2000);
              Data.gid = '';//begin data
              Data.taxid = '';
              Data.cusname = '';
              Data.bracher = '';
              Data.contactname = '';
              Data.lastcontactname = '';
              Data.tel = '';
              Data.mobile = '';
              Data.fax = '';
              Data.email = '';
              Data.actionfn =  false;
              Data.optionDay =  0;
              Data.optionStarttime =  917970016; //set default timer option
              Data.optionEndtime =  917970036; //set default timer option
              Data.optionBillingDay =  0;
              Data.optionStartBilltime =  917970016; //set default timer option
              Data.optionEndBilltime =  917970036; //set default timer option
              ///////////////// option ///////////////////////
              Data.optionStartNormaltime =  917970016; //set default timer option
              Data.optionEndNormaltime =  917970036; //set default timer option
              /////////////////////////////////////////////
              Data.optionStarttimeAvailable =  917970016; //set default timer option
              Data.optionEndtimeAvailable =  917970036; //set default timer option
              Data.dataMon =  true;
              Data.dataTue =  true;
              Data.dataWen =  true;
              Data.dataThu =  true;
              Data.dataFri =  true;
              Data.dataSat =  true;
              Data.dataSun =  false;
              Data.recivename = '';
              Data.addressname = '';
              Data.provincename = '';
              Data.provinceid = '';
              Data.districtname = '';
              Data.districtid = '';
              Data.zipcode = '';
              Data.invname = '';
              Data.invprovince = '';
              Data.invprovinceid = '';
              Data.invdistrict = '';
              Data.invdistrictid = '';
              Data.invzipcode = '';
              Data.othername = '';
              Data.otheraddress = '';
              Data.otherprovince = '';
              Data.otherprovinceid = '';
              Data.otherdistrict = '';
              Data.otherdistrictid = '';
              Data.otherzipcode = '';
              Data.transname = '';
              Data.teltran = '';
              Data.billvat = false;
              Data.txtRemarkTransport = '';
              Data.peoplela1 =  false;
              Data.peoplela2 =  false;
              Data.statustype =  '';
              Data.bs1 =  '';
              Data.bs2 =  '';
              Data.bs3 =  '';
              Data.bs4 =  '';
              Data.bs5 =  '';
              Data.docStatus =  true;
              Data.doc001 =  true;
              Data.doc004 =  true;
              Data.doc005 =  true;
              Data.optionPayment =  ''; //Set SD-
              Data.txtCreditlimit =  0;
              Data.optionPaymentType =  '';
              Data.optionPaymentBank =  '';
              Data.txtBankAccount = '';
              Data.txtBankBranch =  '';
              Data.optionPaymentbnkYss =  917970001; //yss bank กสิกร ออมทรัพย์
              Data.optionPayment =  true;
              Data.txtCreditlimit =  true;
              Data.optionPaymentType =  true;
              Data.optionPaymentbnkYss =  true;
              Data.diabledcredit =  false;
              /////////////////////////////
              Data.SalePart1 =  false;
              Data.SalePart2 =  false;
              Data.SalePart3 =  false;
              //////////////////////////////
              Data.SalePart4 =  false;
              Data.SalePart5 =  false;
              Data.SalePart6 =  false;
              Data.doc =  [];
              Data.PlaceStatus1 =  '';
              Data.PlaceStatus = '';
              Data.tatofactory =  '';
              Data.tatolnumber =  '';
              Data.SalesPart1 =  true;
              Data.SalesPart2 =  true;
              Data.doc006 =  true;
              Data.PlaceStatus =  true;
              Data.tatofactory =  true;
              Data.tatolnumber =  true;
              /////////////////////////
              Data.datacontact = [];
              Data.databusiness = [];
              Data.tersupselect = '';
        }

        function confirmnew(callback) {
          $scope.showLoadGPS();
            try {
              GetGPSLocation(function(res){
                var getres = setInterval(function(){
                  if(res){
                    var ins = new MobileCRM.DynamicEntity("account", $stateParams.getguid);
                    ins.properties.statuscode = parseInt(917970000);
                    ins.properties.ivz_statuscomplete = parseInt(2);
                    ins.properties.address1_latitude = parseFloat(res.latitude);
                    ins.properties.address1_longitude = parseFloat(res.longitude);
                    ins.save(function (er) {
                        if (er) {
                            alert('error ac 2932 confirm ' + er);
                        } else {
                          $ionicLoading.hide();
                          callback();
                        }
                    });
                    clearInterval(getres);
                  }
                },100);
                if($scope.$phase){$scope.$apply();}
              });
            } catch (er) {
                alert("error2938" + er);
            }
            //console.log('update guid sendmail'+ $scope.chk.infomat);
        }
        $scope.goback = function () {
            $ionicHistory.goBack(-1);
        }
    })
    ////////////////////// end /////////////////


/////////////////// Account List //////////////
.controller('AccountListSupCtrl', function ($scope, $state, $stateParams, $cookies, Data, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        var ckUser = $cookies.get('name');
        $scope.masname = $cookies.get('name');
        if (ckUser) {
            $scope.listmaster = [];
            gettername($cookies.get('name'), function (data) {
                if (data) {
                    var x = 0;
                    var loopArray = function (arr) {
                        getPush(x, function () {
                            x++;
                            if (x < arr.length) {
                                loopArray(arr);
                            } else {
                                $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                                setTimeout(function () {
                                    $ionicLoading.hide();
                                }, 2000);
                            }
                        });
                    }
                    loopArray(data);

                    function getPush(i, callback) {
                        $scope.showLoadingProperTimesRegter('โหลดข้อมูลเขตการขาย ' + data[i].description);
                        $scope.listmaster.push({
                            ivz_territorymasterid: data[i].ivz_territorymasterid,
                            ivz_mastername: data[i].ivz_mastername,
                            ivz_leftterritory: data[i].ivz_leftterritory,
                            ivz_emailcontact: data[i].ivz_emailcontact,
                            ivz_leadermail: data[i].ivz_leadermail,
                            ivz_ccmail: data[i].ivz_ccmail,
                            ivz_empid: data[i].ivz_empid,
                            ivz_empname: data[i].ivz_empname,
                            ivz_statusempid: data[i].ivz_statusempid,
                            description: data[i].description
                        });
                        setTimeout(function () {
                            callback();
                        }, 600);
                    }
                }
                if($scope.$phase){$scope.$apply();}
            });

        } else {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.playlists', {}, {
                reload: true
            });
        }
        $scope.goaccountlist = function (id) {
            Data.termas = id;
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.accountlist', {
                terriid: id,
                mastertype: Data.mastertype
            }, {
                reload: true
            });
        }
    })
    .controller('AccountListCtrl', function ($scope, $state, $stateParams, $cookies, Data, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        var ckUser = $cookies.get('ivz_empid');
        if (ckUser) {
            $scope.Data = Data;
            $ionicHistory.clearHistory();
            $scope.territoryid = $stateParams.terriid;
            //$scope.filtertxt = '';
            $scope.listaccount = [];
            GetAccount($stateParams.terriid, retername($cookies.get('mastertype')), 1, function (data) {
                $scope.showLoadingProperTimesRegter('โหลดข้อมูล');
                if (data.length > 0) {
                    var x = 0;
                    var loopArray = function (arr) {
                        getPush(x, function () {
                            x++;
                            if (x < arr.length) {
                                loopArray(arr);
                            } else {
                                $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                                setTimeout(function () {
                                    $ionicLoading.hide();
                                }, 2000);
                            }
                        });
                    }
                    loopArray(data);

                    function getPush(i, callback) {
                        if (data[i].statuscode == 1 || data[i].statuscode == '1') {
                            $scope.showLoadingProperTimesRegter('โหลดข้อมูลของ ' + data[i].name);
                            $scope.listaccount.push({
                                accountid: data[i].accountid,
                                name: data[i].name,
                                ivz_addresscountry: data[i].ivz_addresscountry,
                                ivz_addressprovince: data[i].ivz_addressprovince,
                                ivz_addressdistrict: data[i].ivz_addressdistrict,
                                ivz_availablefromtime: data[i].ivz_availablefromtime,
                                ivz_availabletotime: data[i].ivz_availabletotime,
                                territoryid: data[i].territoryid,
                                customertypecode: data[i].customertypecode,
                                statuscode: data[i].statuscode,
                                accountnumber: data[i].accountnumber,
                                filtername: data[i].filtername,
                                ivz_customer: data[i].ivz_customer,
                                accountype: data[i].accountype,
                                ivz_statuscomplete: data[i].ivz_statuscomplete,
                                remarkreject: data[i].remarkreject,
                                ivz_taxid: data[i].ivz_taxid,
                                customertypecode: data[i].customertypecode
                            });
                        }
                        setTimeout(function () {
                            callback();
                        }, 0);
                    }
                }else{
                  setTimeout(function () {
                      $ionicLoading.hide();
                  }, 2000);
                }
                if($scope.$phase){$scope.$apply();}
            });
            $scope.openaccount = function () {
                $state.go('app.openaccount', {
                    territoryid: Data.termas,
                    mastertype: Data.mastertype,
                    getguid: guid(),
                    pricelevel: Data.pricelevel,
                    transactioncurrency: Data.transactioncurrency
                }, {
                    reload: true
                });
            };
            $scope.reloaddata = function () {
                    $scope.showLoadingProperTimesRegter('โหลดข้อมูล');
                    $scope.listaccount = [];
                    GetAccount($cookies.get('territoryid'),retername($cookies.get('mastertype')), 1, function (data) {
                        $scope.showLoadingProperTimesRegter('โหลดข้อมูล');
                        if (data.length > 0) {
                            var x = 0;
                            var loopArray = function (arr) {
                                getPush(x, function () {
                                    x++;
                                    if (x < arr.length) {
                                        loopArray(arr);
                                    } else {
                                        $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                                        setTimeout(function () {
                                            $ionicLoading.hide();
                                        }, 2000);
                                    }
                                });
                            }
                            loopArray(data);

                            function getPush(i, callback) {
                                if (data[i].statuscode == 1 || data[i].statuscode == '1') {
                                    $scope.showLoadingProperTimesRegter('โหลดข้อมูลของ ' + data[i].name);
                                    $scope.listaccount.push({
                                        accountid: data[i].accountid,
                                        name: data[i].name,
                                        ivz_addresscountry: data[i].ivz_addresscountry,
                                        ivz_addressprovince: data[i].ivz_addressprovince,
                                        ivz_addressdistrict: data[i].ivz_addressdistrict,
                                        ivz_availablefromtime: data[i].ivz_availablefromtime,
                                        ivz_availabletotime: data[i].ivz_availabletotime,
                                        territoryid: data[i].territoryid,
                                        customertypecode: data[i].customertypecode,
                                        statuscode: data[i].statuscode,
                                        accountnumber: data[i].accountnumber,
                                        filtername: data[i].filtername,
                                        ivz_customer: data[i].ivz_customer,
                                        accountype: data[i].accountype,
                                        ivz_statuscomplete: data[i].ivz_statuscomplete,
                                        remarkreject: data[i].remarkreject,
                                        ivz_taxid: data[i].ivz_taxid,
                                        customertypecode: data[i].customertypecode
                                    });
                                }
                                setTimeout(function () {
                                    callback();
                                }, 25);
                            }
                        }else{
                          setTimeout(function () {
                              $ionicLoading.hide();
                          }, 2000);
                        }
                        if($scope.$phase){$scope.$apply();}
                    });
                }
                //$scope.filtertype = 0 = no,1=complete,2=wait,3=reject,4=yes
            //$scope.filtertype = '';
            $scope.setfilter = function (txtfilter) {
                $scope.listaccount = [];
                GetAccount($cookies.get('territoryid'),retername($cookies.get('mastertype')), 1, function (data) {
                    $scope.showLoadingProperTimesRegter('โหลดข้อมูล');
                    if (data.length > 0) {
                        var x = 0;
                        var loopArray = function (arr) {
                            getPush(x, function () {
                                x++;
                                if (x < arr.length) {
                                    loopArray(arr);
                                } else {
                                    $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                                    setTimeout(function () {
                                        $ionicLoading.hide();
                                    }, 2000);
                                }
                            });
                        }
                        loopArray(data);

                        function getPush(i, callback) {
                            if (data[i].statuscode == txtfilter) {
                                $scope.showLoadingProperTimesRegter('โหลดข้อมูลของ ' + data[i].name);
                                $scope.listaccount.push({
                                    accountid: data[i].accountid,
                                    name: data[i].name,
                                    ivz_addresscountry: data[i].ivz_addresscountry,
                                    ivz_addressprovince: data[i].ivz_addressprovince,
                                    ivz_addressdistrict: data[i].ivz_addressdistrict,
                                    ivz_availablefromtime: data[i].ivz_availablefromtime,
                                    ivz_availabletotime: data[i].ivz_availabletotime,
                                    territoryid: data[i].territoryid,
                                    customertypecode: data[i].customertypecode,
                                    statuscode: data[i].statuscode,
                                    accountnumber: data[i].accountnumber,
                                    filtername: data[i].filtername,
                                    ivz_customer: data[i].ivz_customer,
                                    accountype: data[i].accountype,
                                    ivz_statuscomplete: data[i].ivz_statuscomplete,
                                    remarkreject: data[i].remarkreject,
                                    ivz_taxid: data[i].ivz_taxid,
                                    customertypecode: data[i].customertypecode
                                });
                            }
                            setTimeout(function () {
                                callback();
                            }, 25);
                        }
                    }else{
                      setTimeout(function () {
                          $ionicLoading.hide();
                      }, 2000);
                    }
                    if($scope.$phase){$scope.$apply();}
                });
            }
            $scope.setfilterPendding = function (txtfilter, txtfilter2) {
                //alert(txtfilter);
                $scope.showLoadingProperTimes();
                $scope.listaccount = [];
                GetAccount($cookies.get('territoryid'),retername($cookies.get('mastertype')), 1, function (data) {
                    $scope.showLoadingProperTimesRegter('โหลดข้อมูล');
                    if (data.length > 0) {
                        var x = 0;
                        var loopArray = function (arr) {
                            getPush(x, function () {
                                x++;
                                if (x < arr.length) {
                                    loopArray(arr);
                                } else {
                                    $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                                    setTimeout(function () {
                                        $ionicLoading.hide();
                                    }, 2000);
                                }
                            });
                        }
                        loopArray(data);

                        function getPush(i, callback) {
                            if (data[i].statuscode == txtfilter || data[i].statuscode == txtfilter2) {
                                $scope.showLoadingProperTimesRegter('โหลดข้อมูลของ ' + data[i].name);
                                $scope.listaccount.push({
                                    accountid: data[i].accountid,
                                    name: data[i].name,
                                    ivz_addresscountry: data[i].ivz_addresscountry,
                                    ivz_addressprovince: data[i].ivz_addressprovince,
                                    ivz_addressdistrict: data[i].ivz_addressdistrict,
                                    ivz_availablefromtime: data[i].ivz_availablefromtime,
                                    ivz_availabletotime: data[i].ivz_availabletotime,
                                    territoryid: data[i].territoryid,
                                    customertypecode: data[i].customertypecode,
                                    statuscode: data[i].statuscode,
                                    accountnumber: data[i].accountnumber,
                                    filtername: data[i].filtername,
                                    ivz_customer: data[i].ivz_customer,
                                    accountype: data[i].accountype,
                                    ivz_statuscomplete: data[i].ivz_statuscomplete,
                                    remarkreject: data[i].remarkreject,
                                    ivz_taxid: data[i].ivz_taxid,
                                    customertypecode: data[i].customertypecode
                                });
                            }
                            setTimeout(function () {
                                callback();
                            }, 25);
                        }
                    }else{
                      setTimeout(function () {
                          $ionicLoading.hide();
                      }, 2000);
                    }
                    if($scope.$phase){$scope.$apply();}
                });
            }
        } else {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.playlists', {}, {
                reload: true
            });
        }
    })
    /*------------------------------- account editor ---------------------------*/
    .controller('AccountEditorCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data; //accountid;accountname
        Data.mastertype = $stateParams.mastertype;
        Data.getparaaccount = $stateParams.accountid;
        Data.getparaname = $stateParams.accountname;
        Data.gettxtid = $stateParams.accounttxtid;
        $scope.uistate = function () {
            $state.go('app.openaccount', {
                territoryid: Data.termas,
                mastertype: Data.mastertype,
                getguid: $stateParams.accountid,
                pricelevel: Data.pricelevel,
                transactioncurrency: Data.transactioncurrency
            }, {
                reload: true
            });
        }
        $scope.deteaccount = function () {
            $scope.showLoadingProperTimes();
            try {
                var ins = new MobileCRM.DynamicEntity("account", $stateParams.accountid);
                ins.properties.statuscode = parseInt(2);
                ins.properties.ivz_statuscomplete = parseInt(0);
                ins.save(function (er) {
                    if (er) {
                        alert('error deteaccount 2697 ' + er);
                    } else {
                        setTimeout(function () {
                            $ionicLoading.hide();
                            $ionicHistory.goBack(-1);
                        }, 2000);
                    }
                });
            } catch (er) {
                alert("error27006" + er);
            }
        }
    })
    /*-------------------------- Wait Controller -------------------------*/
    .controller('WaitCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        Data.mastertype = $stateParams.mastertype;
        $scope.typego = $stateParams.typego;
        //:masname/:mastertype/:typego
        $scope.loaddata = function(){
          $scope.listmaster = [];
          gettername($cookies.get('name'), function (data) {
              if (data) {
                  var x = 0;
                  var loopArray = function (arr) {
                      getPush(x, function () {
                          x++;
                          if (x < arr.length) {
                              loopArray(arr);
                          } else {
                              $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                              setTimeout(function () {
                                  $ionicLoading.hide();
                              }, 2000);
                          }
                      });
                  }
                  loopArray(data);
                  function getPush(i, callback) {
                    //alert(data[i].description);
                      $scope.showLoading('โหลดข้อมูลเขตการขาย ' + data[i].description);
                      $scope.listmaster.push({
                          ivz_territorymasterid: data[i].ivz_territorymasterid,
                          ivz_mastername: data[i].ivz_mastername,
                          ivz_leftterritory: data[i].ivz_leftterritory,
                          ivz_emailcontact: data[i].ivz_emailcontact,
                          ivz_leadermail: data[i].ivz_leadermail,
                          ivz_ccmail: data[i].ivz_ccmail,
                          ivz_empid: data[i].ivz_empid,
                          ivz_empname: data[i].ivz_empname,
                          ivz_statusempid: data[i].ivz_statusempid,
                          description: data[i].description
                      });
                      setTimeout(function () {
                          callback();
                      }, 100);
                  }
              }
              if($scope.$phase){$scope.$apply();}
          });
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.loaddata();
        });
        $scope.clickgo = function (idter) {
            if ($stateParams.typego == 1 || $stateParams.typego == '1') {
                $state.go('app.waitaccount', {
                    terid: idter
                }, {
                    reload: true
                });
            }
        }
    })
    .controller('WaitAccountCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        $scope.$on('$ionicView.enter',function(){
          Data.showcart = false;
          $scope.Data = Data;
          $scope.loaddata();
        });
        $scope.loaddata = function(){
          $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
          $scope.loadaccount();
        }
        $scope.loadaccount = function(){
          $scope.listaccount = [];
          GetAccount($stateParams.terid,Data.mastertype,1,function(data){
            //alert(data.length);
            if(data.length > 0){
              var x = 0;
              var loopArray = function(arr){
                loopPush(x,function(){
                  x++;
                  if(x < arr.length){
                    loopArray(arr);
                  }else{
                    $ionicLoading.hide();
                  }
                });
              }
              loopArray(data);
              function loopPush(i,callback){
                switch (data[i].statuscode) {
                  case 917970000:
                  case '917970000':
                  $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล : '+data[i].name);
                        $scope.listaccount.push({
                          accountid:data[i].accountid,
                          name:data[i].name,
                          ivz_addresscountry:data[i].ivz_addresscountry,
                          ivz_addressprovince:data[i].ivz_addressprovince,
                          ivz_addressdistrict:data[i].ivz_addressdistrict,
                          ivz_availablefromtime:data[i].ivz_availablefromtime,
                          ivz_availabletotime:data[i].ivz_availabletotime,
                          territoryid:data[i].territoryid,
                          customertypecode:data[i].customertypecode,
                          statuscode:data[i].statuscode,
                          accountnumber:data[i].accountnumber,
                          filtername:data[i].filtername,
                          ivz_customer:data[i].ivz_customer,
                          accountype:data[i].accountype,
                          ivz_statuscomplete:data[i].ivz_statuscomplete,
                          remarkreject:data[i].remarkreject,
                          ivz_taxid:data[i].ivz_taxid,
                          customertypecode:data[i].customertypecode,
                          statustype:data[i].statustype,
                          ivz_doc01:data[i].ivz_doc01,
                          ivz_doc02:data[i].ivz_doc02,
                          ivz_doc03:data[i].ivz_doc03,
                          ivz_dochouseholdregis:data[i].ivz_dochouseholdregis,
                          ivz_docidcard:data[i].ivz_docidcard,
                          matchtype:data[i].matchtype,
                          statusempid:data[i].statusempid,
                          ivz_balancecredit:data[i].ivz_balancecredit,
                          ivz_integrationid:data[i].ivz_integrationid
                        });
                        setTimeout(function(){
                          callback();
                        },5);
                    break;
                  default:
                  callback();
                }
              }
            }
          });
        }
        $scope.detailaccount = function(accountid,statustype,balancecredit,territoryid,accountname){
          $state.go('app.accountdetailnew',{accountid:accountid,statustype:statustype,credit:balancecredit,terid:territoryid,acname:accountname},{reload:true});
        };
    })
    .controller('WaitListCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $scope.gotoleft = function (txt) {
            if (txt == 0 || txt == '0') {
                $state.go('app.approveplanning', {
                    mastertype: Data.mastertype
                });
            } else if (txt == 1 || txt == '1') {
                $state.go('app.waitapprove', {
                    masname: $cookies.get('name'),
                    mastertype: Data.mastertype,
                    typego: 1
                }, {
                    reload: true
                });
            } else if (txt == 2 || txt == '2') {
                $state.go('app.waitapproveadjust', {
                    masname: $cookies.get('name'),
                    mastertype: Data.mastertype,
                    typego: 1
                }, {
                    reload: true
                });
            } else if (txt == 3 || txt == '3') {
                $state.go('app.waitapproveorder', {
                    masname: $cookies.get('name'),
                    mastertype: Data.mastertype,
                    typego: 2
                }, {
                    reload: true
                });
              } else if (txt == 4 || txt == '4') {
                  $state.go('app.waitapproveactivities', {
                      masname: $cookies.get('name')
                  }, {
                      reload: true
                  });
              }
        }
    })

.controller('WaitAccountRejectCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, arrlist) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        Data.mastertype = $stateParams.mastertype;
        //$stateParams.salename,$stateParams.tername
        $scope.salename = $stateParams.salename;
        $scope.tername = $stateParams.tername;
        $scope.txtreject;
        $scope.txthidden = true;
        $scope.user = {
                txtreject: ''
            }
            /*-------------reject account ---------------*/
        $scope.confirmreject = function (comment) {
            var listac = arrlist.listac;
            if (comment) {
                $scope.txthidden = true;
                var x = 0;
                var loopArray = function (arr) {
                    //  alert(x);
                    upins(x, function () {
                        x++;
                        if (x < arr.length) {
                            loopArray(arr);
                        } else {
                            $ionicLoading.hide();
                            var terid = listac[0].territoryid;
                            //alert(terid.id);
                            getTerEmp(terid.id, function (data) {
                                if (data) {
                                    var title = 'ไม่อนุมัติเปิดบัญชีลูกค้าใหม่';
                                    var text = "เรียน พนักงานขายเขต " + data[0].name + " ไม่สามารถเปิดบัญชีลูกค้าใหม่ได้เนื่องจาก" + comment +
                                        " ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                                    SendMail(data[0].ivz_emailcontact, title, text);
                                    setTimeout(function () {
                                        $ionicHistory.goBack(-1);
                                    }, 2000);
                                }
                                if($scope.$phase){$scope.$apply();}
                            });
                        }
                    });
                }
                loopArray(listac);

                function upins(i, callback) {
                    $scope.showLoadingProperTimesRegter('บันทึกข้อมูลลูกค้า ' + listac[i].name);
                    var ins = new MobileCRM.DynamicEntity('account', listac[i].accountid);
                    ins.properties.statuscode = parseInt(917970003);
                    ins.properties.ivz_remarkreject = comment;
                    ins.save(function (es) {
                        if (es) {
                            alert('error 2918 ' + es);
                        } else {
                            setTimeout(function () {
                                callback();
                            }, 1000);
                        }
                    });
                }
            } else {
                $scope.txthidden = false;
            }
        };
        $scope.cancelback = function () {
            $ionicHistory.goBack(-1);
        }
    })
    .controller('WaitAdjustCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, arrlist) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $scope.reloaddata = function () {
            $scope.listmaster = [];
            gettername($cookies.get('name'), function (data) {
                if (data) {
                    var x = 0;
                    var loopArray = function (arr) {
                        getPush(x, function () {
                            x++;
                            if (x < arr.length) {
                                loopArray(arr);
                            } else {
                                $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                                setTimeout(function () {
                                    $ionicLoading.hide();
                                }, 2000);
                            }
                        });
                    }
                    loopArray(data);

                    function getPush(i, callback) {
                        $scope.showLoadingProperTimesRegter('โหลดข้อมูลเขตการขาย ' + data[i].description);
                        $scope.listmaster.push({
                            ivz_territorymasterid: data[i].ivz_territorymasterid,
                            ivz_mastername: data[i].ivz_mastername,
                            ivz_leftterritory: data[i].ivz_leftterritory,
                            ivz_emailcontact: data[i].ivz_emailcontact,
                            ivz_leadermail: data[i].ivz_leadermail,
                            ivz_ccmail: data[i].ivz_ccmail,
                            ivz_empid: data[i].ivz_empid,
                            ivz_empname: data[i].ivz_empname,
                            ivz_statusempid: data[i].ivz_statusempid,
                            description: data[i].description
                        });
                        setTimeout(function () {
                            callback();
                        }, 10);
                    }
                }
                if($scope.$phase){$scope.$apply();}
            });
        }
        $scope.$on("$ionicView.enter", function () {
            $scope.reloaddata();
        })
        $scope.adjustaccountlist = function (id) {
            $state.go('app.approveadjust', {
                terid: id,
                mastertype: Data.mastertype,
                typego: $stateParams.typego
            }, {
                reload: true
            });
        }
    })
    ///////////////////////////// Account Adjustment/////////////////////////////////////////
    .controller('WaitAccountAdjustCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal) {
        $state.reload();
        Data.showcart = false;
        $ionicLoading.hide();
        //alert($stateParams.typego);
        $scope.typego = $stateParams.typego;
        $scope.user = {
            id: '',
            adjustid: '',
            txtname: '',
            tername: '',
            terid: '',
            filetername: '',
            remarkname: '',
            typego: '',
            newcredit:0,
            appcredit:0
        };
        $scope.chk = {
            remark: true
        };

        $scope.reload = function () {
            $scope.listaccount = [];
            GetAcAdjustmentByTerid($stateParams.terid, function (data) {
                //$scope.listaccount = data;
                var x = 0;
                var loopArray = function (arr) {
                    getPush(x, function () {
                        x++;
                        if (x < arr.length) {
                            loopArray(arr);
                        } else {
                            $ionicLoading.hide();
                        }
                    });
                }
                loopArray(data);

                function getPush(i, callback) {
                    $scope.showLoadingProperTimesRegter(' กำลังโหลดข้อมูล ' + data[i].ivz_customernumber.primaryName);
                    if (data[i].statuscode === 917970000 || data[i].statuscode === '917970000') {
                        $scope.listaccount.push({
                            ivz_accountadjustmentid: data[i].ivz_accountadjustmentid,
                            ivz_name: data[i].ivz_name,
                            ivz_transdate: new Date(data[i].createdon),
                            ivz_adjcredcloseaccount: data[i].ivz_adjcredcloseaccount,
                            ivz_adjcredclosereason: data[i].ivz_adjcredclosereason,
                            ivz_adjcredit: data[i].ivz_adjcredit,
                            ivz_adjcredreopenaccount: data[i].ivz_adjcredreopenaccount,
                            ivz_adjcredreopenreason: data[i].ivz_adjcredreopenreason,
                            ivz_adjgenaddress: data[i].ivz_adjgenaddress,
                            ivz_adjgencontact: data[i].ivz_adjgencontact,
                            ivz_adjgeneral: data[i].ivz_adjgeneral,
                            ivz_adjgenname: data[i].ivz_adjgenname,
                            ivz_adjgentransport: data[i].ivz_adjgentransport,
                            ivz_newcredcredit: data[i].ivz_newcredcredit,
                            ivz_newcredcreditincdec: data[i].ivz_newcredcreditincdec,
                            ivz_newcredcreditlimitnew: data[i].ivz_newcredcreditlimitnew,
                            ivz_newcredcreditlimitold: data[i].ivz_newcredcreditlimitold,
                            ivz_newgenaddresspostalcode: data[i].ivz_newgenaddresspostalcode,
                            ivz_newgenaddressstreet1: data[i].ivz_newgenaddressstreet1,
                            ivz_newgenaddressstreet2: data[i].ivz_newgenaddressstreet2,
                            ivz_newgenaddressstreet3: data[i].ivz_newgenaddressstreet3,
                            ivz_newgencontactfirstname: data[i].ivz_newgencontactfirstname,
                            ivz_newgencontactlastname: data[i].ivz_newgencontactlastname,
                            ivz_newgenname: data[i].ivz_newgenname,
                            ivz_newgentransport: data[i].ivz_newgentransport,
                            ivz_customernumber: data[i].ivz_customernumber,
                            ivz_newgenaddresscountry: data[i].ivz_newgenaddresscountry,
                            ivz_newgenaddressdistrict: data[i].ivz_newgenaddressdistrict,
                            ivz_newgenaddressprovince: data[i].ivz_newgenaddressprovince,
                            ivz_adjgenaddressoption: data[i].ivz_adjgenaddressoption,
                            ivz_adjgenaddresstype: data[i].ivz_adjgenaddresstype,
                            ivz_adjgencontactoption: data[i].ivz_adjgencontactoption,
                            ivz_adjgenother: data[i].ivz_adjgenother,
                            ivz_adjgenotherdescription: data[i].ivz_adjgenotherdescription,
                            ivz_newcredcreditoption: data[i].ivz_newcredcreditoption,
                            ivz_empid: data[i].ivz_empid,
                            ivz_approvaldate: data[i].ivz_approvaldate,
                            ivz_approvedby: data[i].ivz_approvedby,
                            ivz_territory: data[i].ivz_territory,
                            ivz_remark: data[i].ivz_remark,
                            statuscode: data[i].statuscode,
                            typego: $stateParams.typego,
                            ivz_remarkcredit: data[i].ivz_remarkcredit
                        });
                    }
                    setTimeout(function () {
                        callback();
                    }, 0);
                }
                if($scope.$phase){$scope.$apply();}
            });
        }
        $scope.reload();
        $scope.removeitem = function (index) {
            $scope.listaccount.splice(index, 1);
        }
        $scope.approveaccount = function () {
            var x = 0;
            var loopArray = function (arr) {
                getUpdate(x, function () {
                    x++;
                    if (x < arr.length) {
                        //$scope.listaccount.splice(x,1);
                        loopArray(arr);
                    } else {
                        $ionicLoading.hide();
                    }
                });
            }
            loopArray($scope.listaccount);

            function getUpdate(i, callback) {
                $scope.showLoadingProperTimesRegter('กำลังทำการบันทึก ' + $scope.listaccount[i].name);
                console.log($scope.listaccount[i].name);
                setTimeout(function () {
                    callback();
                }, 2000);
            }
            console.log('update to approve');
            setTimeout(function () {
                console.log('sendmail');
            }, 2000);
        }

        $scope.rejectapprove = function () {
            console.log('update to Reject ');
            setTimeout(function () {
                console.log('sendmail');
            }, 2000);
        }

        $ionicModal.fromTemplateUrl('templates/comment/commentrejapprov.html', {
            id: 1,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal1 = modal;
        });
        $ionicModal.fromTemplateUrl('templates/comment/rejectcredit.html', {
            id: 2,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal2 = modal;
        });
        $ionicModal.fromTemplateUrl('templates/comment/rejectall.html', {
            id: 3,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal3 = modal;
        });

        // Triggered in the login modal to close it
        $scope.closereject = function () {
          try {
            $scope.modal1.hide();
          }catch(ex){}
          try {
            $scope.modal2.hide();
          }catch(ex){}
          try {
            $scope.modal3.hide();
          }catch(ex){}
        };
        $scope.closereject2 = function () {
          try {
            $scope.modal1.hide();
          }catch(ex){}
          try {
            $scope.modal2.hide();
          }catch(ex){}
          try {
            $scope.modal3.hide();
          }catch(ex){}
        };
        // Open the login modal
        $scope.showcomment = function (index, id, txt, ter, contxt ,credit) {
            //alert(ter.id);
            $scope.user.id = index;
            $scope.user.adjustid = id;
            $scope.user.txtname = txt;
            $scope.user.tername = ter;
            $scope.user.terid = ter.id;
            $scope.user.filetername = contxt;
            $scope.user.remarkname = '';
            $scope.user.typego = $stateParams.typego;
            $scope.user.newcredit = credit;
            $scope.user.appcredit = credit;
            $scope.modal2.show();
        };
        $scope.rejectapprove = function () {
            $scope.modal1.show();
        };

        $scope.showcommentcredit = function (index, id, txt, ter, contxt ,credit) {
            //alert(ter.id);
            $scope.user.id = index;
            $scope.user.adjustid = id;
            $scope.user.txtname = txt;
            $scope.user.tername = ter;
            $scope.user.terid = ter.id;
            $scope.user.filetername = contxt;
            $scope.user.remarkname = '';
            $scope.user.typego = $stateParams.typego;
            $scope.user.newcredit = credit;
            $scope.user.appcredit = credit;
            $scope.modal3.show();
        };

        function updatestatus(id, code, txt, callback) {
            try {
                var ins = new MobileCRM.DynamicEntity('ivz_accountadjustment', id);
                ins.properties.statuscode = parseInt(code);
                ins.properties.ivz_remarkcomment = txt;
                ins.properties.ivz_approvedby = $cookies.get('ivz_empid');
                ins.properties.ivz_approvaldate = new Date();
                if($scope.user.appcredit){
                  ins.ivz_newcredcreditlimitnew = parseInt($scope.user.appcredit);
                }
                ins.save(function (er) {
                    if (er) {
                        alert('error 3709 ' + er);
                    } else {
                        callback($scope.user.filetername);
                    }
                });
            } catch (e) {
                alert(e);
            }
        }
        var upsendmail = function(txt){
          getTerEmp($scope.user.terid, function (data) {
              if (data) {
                if(parseInt($scope.user.newcredit) > 100000){
                  var title = 'อนุมัติ'+(txt).trim();
                  var text = "เรียน Director   Sup./Sales Manger ได้ทำการอนุมัติ"+(txt).trim()+"เขตการขาย" + data[0].name + " แล้วรบกวน Director ทำการอนุมัติ"+(txt).trim()+"ในลำดับถัดไปด้วยครับ ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                  SendMail(data[0].ivz_ccmail, title, text);
                }else{
                  var title = 'อนุมัติ'+(txt).trim();
                  var text = "เรียน หน่วยงานบัญชี Sup./Sales Manger ได้ทำการอนุมัติ"+(txt).trim()+"เรียบร้อยแล้ว รบกวนหน่วยงานบัญชีช่วยดำเนินการ POST "+(txt).trim()+"ให้ด้วยครับ ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                  SendMail('acc@yss.co.th', title, text);
                }
                  setTimeout(function () {
                      $ionicLoading.hide();
                      $scope.closereject2();
                  }, 2000);
              }
              if($scope.$phase){$scope.$apply();}
          });
        }
        $scope.approveAdj = function (id, txt, statuscode) {
            var data = $scope.listaccount;
            for (var i in data) {
                if (data[i].ivz_accountadjustmentid === txt) {
                  updatestatus(txt, 917970001, null,upsendmail);
                  break;
                }
            }
        }
        $scope.rejectAdj = function (id, txt, statuscode) {
            if ($scope.user.remarkname) {
                $scope.chk.remark = true;
                var data = $scope.listaccount;
                for (var i in data) {
                    if (data[i].ivz_accountadjustmentid === txt) {
                        // alert('reject index sendmail '+txt+'::'+statuscode);
                        // data.splice(id,1);
                        // $scope.modal2.hide();
                        //alert(txt);
                        updatestatus(txt, 917970002, $scope.user.remarkname, function () {
                            if ($stateParams.typego === '1' || $stateParams.typego === 1) {
                                $scope.sendmailtosales($scope.user.terid, 'ไม่อนุมัติ'+$scope.user.filetername, 'ไม่สามารถอนุมัติ' + $scope.user.filetername + ' ร้าน' + $scope.user.txtname + 'ได้เนื่องจาก' + $scope.user.remarkname, function () {
                                    data.splice(id, 1);
                                    $scope.modal2.hide();
                                    $scope.modal2.hide();
                                });
                            } else {
                                $scope.sendmailtosales($scope.user.terid, 'ไม่อนุมัต'+$scope.user.filetername, 'ไม่สามารถอนุมัติ' + $scope.user.filetername + ' ร้าน' + $scope.user.txtname + 'ได้เนื่องจาก' + $scope.user.remarkname, function () {
                                    data.splice(id, 1);
                                    $scope.modal2.hide();
                                    $scope.modal2.hide();
                                });
                            }
                        });
                        break;
                    }
                }
            } else {
                $scope.chk.remark = false;
            }
        }
        $scope.changetxt = function (txt) {
            if (txt) {
                $scope.chk.remark = true;
            } else {
                $scope.chk.remark = false;
            }
        }
        $scope.confirmAdjTer = function (territory, statuscode) {
            if ($scope.user.remarkname) {
                $scope.chk.remark = true;
                var data = $scope.listaccount;
                var x = 0;
                var loopArray = function (arr) {
                    getUpdate(x, function () {
                        x++;
                        if (x < arr.length) {
                            loopArray(arr);
                        } else {
                            $scope.modal1.hide();
                            $ionicLoading.hide();
                        }
                    });
                }
                loopArray(data);
                function getUpdate(i, callback) {
                    $scope.showLoadingProperTimesRegter('กำลังทำการบันทึก ' + data[i].ivz_customernumber);
                    setTimeout(function () {
                        callback();
                    }, 2000);
                }
            } else {
                $scope.chk.remark = false;
            }
        }
        $scope.reback = function () {
            $scope.reback();
        }
    })
    ///////////////////////////// order territory /////////////////////////
    .controller('WaitOrderCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, arrlist) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $scope.reloaddata = function () {
            $scope.listmaster = [];
            gettername($cookies.get('name'), function (data) {
                if (data) {
                    var x = 0;
                    var loopArray = function (arr) {
                        getPush(x, function () {
                            x++;
                            if (x < arr.length) {
                                loopArray(arr);
                            } else {
                                $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                                setTimeout(function () {
                                    $ionicLoading.hide();
                                }, 2000);
                            }
                        });
                    }
                    loopArray(data);

                    function getPush(i, callback) {
                        $scope.showLoadingProperTimesRegter('โหลดข้อมูลเขตการขาย ' + data[i].description);
                        $scope.listmaster.push({
                            ivz_territorymasterid: data[i].ivz_territorymasterid,
                            ivz_mastername: data[i].ivz_mastername,
                            ivz_leftterritory: data[i].ivz_leftterritory,
                            ivz_emailcontact: data[i].ivz_emailcontact,
                            ivz_leadermail: data[i].ivz_leadermail,
                            ivz_ccmail: data[i].ivz_ccmail,
                            ivz_empid: data[i].ivz_empid,
                            ivz_empname: data[i].ivz_empname,
                            ivz_statusempid: data[i].ivz_statusempid,
                            description: data[i].description
                        });
                        setTimeout(function () {
                            callback();
                        }, 10);
                    }
                }
                if($scope.$phase){$scope.$apply();}
            });
        }
        $scope.$on("$ionicView.enter", function () {
            $scope.reloaddata();
        })

        $scope.orderlist = function (id) {
          //alert(id);
            $state.go('app.approveorder', {
                terid: id,
                mastertype: Data.mastertype,
                typego: 2
            }, {
                reload: true
            });
        }
    })
    .controller('WaitOrderListCtrl',function ($scope, $ionicModal,Setting, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $compile, $ionicPopup, $timeout) {
      $state.reload();
      $scope.Data = Data;
      $scope.$on('$ionicView.enter',function(){
        $scope.ordedetail();
      });
      $scope.ordedetail = function () {
          $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
          setTimeout(function () {
              $ionicLoading.hide();
              $scope.loadData();
          }, 3000);
      }
      $scope.loadData = function(){
        GetOrder($stateParams.terid,Setting.setValorder,1,function(data){
          if(data){
            $scope.listorder = [];
            var x = 0;
            var loopArray = function(arr){
              getPush(x,function(){
                x++;
                if(x < arr.length){
                  loopArray(arr);
                }else{
                  $ionicLoading.hide();
                }
              });
            }
            loopArray(data);
            function getPush(i,callback){
              $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล '+data[i].name);
              $scope.listorder.push({
                salesorderid:data[i].salesorderid,
                customerid:data[i].customerid,
                name:data[i].name,
                transactioncurrencyid:data[i].transactioncurrencyid,
                requestdeliveryby:data[i].requestdeliveryby,
                pricelevelid:data[i].pricelevelid,
                shippingmethodcode:data[i].shippingmethodcode,
                paymenttermscode:data[i].paymenttermscode,
                ivz_province:data[i].ivz_province,
                ivz_district:data[i].ivz_district,
                ivz_territory:data[i].ivz_territory,
                ivz_balancecredit:data[i].ivz_balancecredit,
                totalamount:data[i].totalamount,
                ivz_empid:data[i].ivz_empid,
                statuscode:data[i].statuscode,
                ivz_statussales:data[i].ivz_statussales,
                description:data[i].description,
                ivz_ordernumber:data[i].ivz_ordernumber,
                ordernumber:data[i].ordernumber,
                createdon:new Date(data[i].createdon)
              });
              setTimeout(function(){
                callback();
              },10);
            }
          }
          if($scope.$phase){$scope.$apply();}
        });
      }
      $scope.showdetail = function(index,name,tername){
        //$scope.listorder.splice(index,1);
        $state.go('app.approveorderdetail',{
          terid:$stateParams.terid,
          orderid:index,
          mastertype:Data.mastertype,
          name:name,
          tername:tername
        },{reload:true});
      }
      $scope.reback = function(){
        $ionicHistory.goBack(-1);
      }
    })
    .controller('WaitOrderDetailCtrl',function ($scope, $ionicModal,Setting, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $compile, $ionicPopup, $timeout) {
      $state.reload();
      $scope.Data = Data;
      $scope.user = {
        name:$stateParams.name,
        tername:$stateParams.tername,
        remarkname:''
      };
      $scope.chk = {
        remark:true
      };
      $scope.$on('$ionicView.enter',function(){
        $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
        setTimeout(function () {
            $ionicLoading.hide();
            $scope.loadData();
        }, 3000);
      });
      $scope.ordedetail = function () {
          $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
          setTimeout(function () {
              $ionicLoading.hide();
              $scope.loadData();
          }, 3000);
      }
      $scope.loadData = function(){
        $scope.listorderdetail = [];
        var a = new MobileCRM.FetchXml.Entity('salesorderdetail');
          a.addAttribute('salesorderdetailid');//0
          a.addAttribute('salesorderid');//1
          a.addAttribute('productid');//2
          a.addAttribute('priceperunit');//3
          a.addAttribute('uomid');//4
          a.addAttribute('quantity');//5
       var filter = new MobileCRM.FetchXml.Filter();
            filter.where('salesorderid','eq',$stateParams.orderid.trim());
            a.filter = filter;
        var l = a.addLink('product','productid','productid','outer');
          l.addAttribute('price');//6
          l.addAttribute('productnumber');//7
        var fetch = new MobileCRM.FetchXml.Fetch(a);
          fetch.execute('array',function(data){
              if(data.length > 0){
                var x = 0;
                var loopArray = function(arr){
                  getPush(x,function(){
                    x++;
                    if(x < arr.length){
                      loopArray(arr);
                    }else{
                      $ionicLoading.hide();
                    }
                  });
                }
                loopArray(data);
                function getPush(i,callback){
                  $scope.listorderdetail.push({
                    salesorderdetail:data[i][0],
                    salesorderid:data[i][1],
                    productid:data[i][2].id,
                    productname:data[i][2].primaryName,
                    priceperunit:data[i][3],
                    uomid:data[i][4].id,
                    quality:data[i][5],
                    price:data[i][6],
                    productnumber:data[i][7],
                    tatol:parseInt(data[i][3]) * parseInt(data[i][5])
                  });
                  callback();
                };
              }
            if($scope.$phase){$scope.$apply();}
          },function(er){
            alert("ERROR 6892:"+er);
          },null);
      }
      $scope.addpluss = function (data) {
          var m = 0;
          for (var i in $scope.listorderdetail) {
              m += parseInt($scope.listorderdetail[i].quality) * parseInt($scope.listorderdetail[i].priceperunit);
          }
          return m;
      }
      function approveorder(statuscode,txt,callback){
        var ups = new MobileCRM.DynamicEntity('salesorder',$stateParams.orderid);
            ups.properties.statuscode = parseInt(statuscode);
            ups.properties.ivz_remarkcomment = txt;
            ups.save(function(er){
              if(er){
                alert('error 4259 '+er);
              }else{
                setTimeout(function(){
                  callback();
                },1000);
              }
            });
      }
      $scope.confirmapproveorder = function(){
        approveorder(917970000,'',function(){
          $ionicHistory.goBack(-1);
        });
      }
      $scope.confirmrej = function(statecode,remarktxt){
        if(remarktxt){
          approveorder(4,remarktxt,function(){
            $scope.sendmailtosales($stateParams.terid,'ไม่อนุมัติเปิดใบสั่งขาย','ไม่สามารถอนุมัติเปิดใบสั่งขายให้กลับลูกค้า'+$scope.user.name+'ได้เนื่องจาก'+remarktxt,function(){
              $scope.closereject();
              $ionicHistory.goBack(-1);
            });
          });
        }
      }
      $scope.closereject = function(){
        $scope.modal2.hide();
      }
      $scope.confirmrejectorder = function(){
        $scope.modal2.show();
      }
      $ionicModal.fromTemplateUrl('templates/comment/rejapprovorder.html', {
          id: 2,
          scope: $scope,
          animation: 'slide-in-up'
      }).then(function (modal) {
          $scope.modal2 = modal;
      });
    })
    ///////////////////////////////////////////////////////////////////////
    .controller('AccountNewCtrl', function ($scope, $ionicModal, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $compile, $ionicPopup, $timeout) {
        $state.reload();
        $scope.user = {
            accountid: '',
            txtname: '',
            txtstate: '',
            txtcredit: '',
            txtresult: '',
            territory: '',
            txtcomment: '',
            stateture: false
        };
        $scope.$on('$ionicView.enter',function(){
          Data.showcart = false;
          $scope.user.txtname = "Test Accountid";
          var x = $stateParams.accountid + '\n' +
              $stateParams.acname + '\n' +
              $stateParams.statustype + '\n' +
              $stateParams.credit + '\n' +
              $stateParams.credit + '\n' +
              $stateParams.terid;
          //alert(x);
          $scope.user = {
              accountid: $stateParams.accountid,
              txtname: $stateParams.acname ,
              txtstate: $stateParams.statustype,
              txtcredit: $stateParams.credit,
              txtresult: $stateParams.credit,
              territory: $stateParams.terid,
              txtcomment: '',
              stateture: false
          };
          var checkstate = $stateParams.statustype;
          if (checkstate.length > 10) {
              $scope.user.stateture = true;
          } else {
              $scope.user.stateture = false;
          }
          $scope.annoteable();
        });
        $scope.Data = Data;
        Data.mastertype = $stateParams.mastertype;
        $scope.txtname = $stateParams.acname;
        $scope.annote = [];

        $scope.annoteable = function(){
          getAnnote($stateParams.accountid.trim(), function (data) {
              if (data) {
                  if (data.length > 0) {
                      $scope.showLoadingProperTimesRegter('');
                      var x = 0;
                      var loopArray = function (arr) {
                          GetPush(x, function () {
                              x++;
                              if (x < arr.length) {
                                  loopArray(arr);
                              } else {
                                  $ionicLoading.hide();
                              }
                          });
                      }
                      loopArray(data);

                      function GetPush(i, callback) {
                          $scope.showLoadingComplete('กำลังโหลดข้อมูล ' + data[i].subject);
                          //alert(data[i].documentbody);
                          MobileCRM.DynamicEntity.loadDocumentBody("annotation", data[i].annotationid.trim(), function (result) {
                              if (result) {
                                  $scope.annote.push({
                                      documentbody: "data:image/jpeg;base64," + result,
                                      subject: data[i].subject
                                  });
                              }
                          });
                          //alert(data[i].annotationid);
                          setTimeout(function () {
                              callback();
                          }, 60);
                      };
                  }
              } else {
                  alert('ไม่พบข้อมูลเอกสารไฟล์แนบ');
              }
              if($scope.$phase){$scope.$apply();}
          });
        }
        $scope.opop = function (baby, title) {
            $scope.imageSrc = baby;
            $scope.titlem = title;
            $scope.openModal(1);
        };
        $scope.clickmodel = function () {
            console.log('click logout');
            $scope.showcomment();
        }
        $ionicModal.fromTemplateUrl('templates/comment/comment.html', {
            id: '2',
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.oModal2 = modal;
        });

        $ionicModal.fromTemplateUrl('templates/modal-1.html', {
            id: '1',
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.oModal1 = modal;
        });

        $scope.openModal = function (index) {
            if (index == 1) $scope.oModal1.show();
            else $scope.oModal2.show();
        };

        $scope.closeModal = function (index) {
            if (index == 1) $scope.oModal1.hide();
            else $scope.oModal2.hide();
        };

        function updateconfirm(id, callback) {
            $scope.showLoadingProperTimesRegter('กำลังบันทึกข้อมูล');
            var ins = new MobileCRM.DynamicEntity('account', id);
                ins.properties.statuscode = parseInt(917970001);
                ins.properties.ivz_balancecredit = parseInt($scope.user.txtresult);
                ins.properties.creditlimit = parseInt($scope.user.txtresult);
                ins.properties.ivz_approvedby = $cookies.get('ivz_empid');
                ins.properties.ivz_approvaldate = new Date();
                ins.save(function (es) {
                    if (es) {
                        alert('error 3613 ' + es);
                    } else {
                        setTimeout(function () {
                            callback();
                        }, 1000);
                    }
                });
        }

        function rejectconfirm(id, txtcomment, callback) {
            $scope.showLoadingProperTimesRegter('กำลังบันทึกข้อมูล');
            var ins = new MobileCRM.DynamicEntity('account', id);
                ins.properties.statuscode = parseInt(917970002);
                ins.properties.ivz_remarkreject = txtcomment;
                ins.properties.ivz_approvedby = $cookies.get('ivz_empid');
                ins.properties.ivz_approvaldate = new Date();
                ins.save(function (es) {
                    if (es) {
                        alert('error 3613 ' + es);
                    } else {
                        setTimeout(function () {
                            callback();
                        }, 1000);
                    }
                });
        }
        $scope.cAdjustment = function () {
            //alert($stateParams.accountid);
            if ($stateParams.accountid) {
                $scope.showLoadingProperTimesRegter('กำลังบันทึกข้อมูล');
                updateconfirm($stateParams.accountid.trim(), function () {
                    $scope.showLoadingProperTimesRegter('บันทึกข้อมูลเสร็จแล้ว');
                    getTerEmp($scope.user.territory, function (data) {
                        if (data) {
                          if(parseInt(Data.creditlimit) > 100000){
                            var title = 'อนุมัติเปิดบัญชีลูกค้าใหม่';
                            var text = "เรียน Director   Sup./Sales Manger ได้ทำการอนุมัติเปิดบัญชีลูกค้าใหม่เขตการขาย" + data[0].name + " แล้วรบกวน Director ทำการอนุมัติเปิดบัญชีลูกค้าใหม่ในลำดับถัดไปด้วยครับ ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                            SendMail(data[0].ivz_ccmail, title, text);
                          }else{
                            var title = 'อนุมัติเปิดบัญชีลูกค้าใหม่';
                            var text = "เรียน หน่วยงานบัญชี Sup./Sales Manger ได้ทำการอนุมัติเปิดบัญชีลูกค้าใหม่เรียบร้อยแล้ว รบกวนหน่วยงานบัญชีช่วยดำเนินการอนุมัติเปิดบัญชีลูกค้าใหม่ให้ด้วยครับ ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                            SendMail('acc@yss.co.th', title, text);
                          }
                            setTimeout(function () {
                                $ionicLoading.hide();
                                $scope.reback();
                            }, 2000);
                        }
                        if($scope.$phase){$scope.$apply();}
                    });
                });
            }
        }
        $scope.forwardback = function () {
            $ionicHistory.goBack(-1);
        }
        $scope.confirmreject = function (accountid, txtcomment) {
            if (txtcomment) {
                rejectconfirm(accountid, txtcomment, function () {
                    getTerEmp($scope.user.territory, function (data) {
                        if (data) {
                            var title = 'ไม่อนุมัติเปิดบัญชีลูกค้าใหม่';
                            var text = "เรียน พนักงานขายเขต " + data[0].name + " ไม่สามารถเปิดบัญชีลูกค้าใหม่ได้เนื่องจาก" + txtcomment +
                                " ขอบคุณครับ  (อีเมลฉบับนี้ส่งอัตโนมัติจากระบบ CRM)";
                            SendMail(data[0].ivz_emailcontact, title, text);
                            $scope.closeModal(2);
                            setTimeout(function () {
                                $ionicLoading.hide();
                                $scope.reback();
                            }, 2000);
                        }
                        if($scope.$phase){$scope.$apply();}
                    });
                });
            } else {
                alert('กรุณาระบบเหตุผลที่ไม่อนุมัติด้วย');
            }
        }
        $scope.cAdjustmentCancel = function () {
            $scope.showcomment();
        }
    })
    /*
    ------------------------------------------------------------------------------------------
    */
    .controller('AccountDetailCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        Data.mastertype = $stateParams.mastertype;
        $scope.user = {
          accountid:$stateParams.accountid,
          name:'',
          ivz_addresscountry:'',
          ivz_addressprovince:'',
          provincename:'',
          ivz_addressdistrict:'',
          ivz_availablefromtime:'',
          ivz_availabletotime:'',
          territoryid:'',
          customertypecode:'',
          statuscode:'',
          accountnumber:'',
          filtername:'',
          ivz_customer:'',
          accountype:'',
          ivz_statuscomplete:'',
          remarkreject:'',
          ivz_taxid:'',
          customertypecode:'',
          statustype:'',
          statustypecode:'',
          ivz_doc01:'',
          ivz_doc02:'',
          ivz_doc03:'',
          ivz_dochouseholdregis:'',
          ivz_docidcard:'',
          matchtype:'',
          statusempid:'',
          ivz_balancecredit:'',
          ivz_integrationid:'',
          currencyid:'',
          shippingmethodcode:'',
          paymenttermscode:'',
          avatar:'img/avatar-6.png'
        }
        $scope.getAccount = function(){
          GetAccountById($stateParams.accountid,$stateParams.mastertype,function(data){
            if(data.length > 0){
              $scope.user.accountid = data[0].accountid;
              $scope.user.name = data[0].name;
              $scope.user.ivz_addresscountry = data[0].ivz_addresscountry;
              $scope.user.ivz_addressprovince = data[0].ivz_addressprovince;
              $scope.user.provincename = data[0].provincename;
              $scope.user.ivz_addressdistrict = data[0].ivz_addressdistrict;
              $scope.user.ivz_availablefromtime = data[0].ivz_availablefromtime;
              $scope.user.ivz_availabletotime = data[0].ivz_availabletotime;
              $scope.user.territoryid = data[0].territoryid;
              $scope.user.customertypecode = data[0].customertypecode;
              $scope.user.statuscode = data[0].statuscode;
              $scope.user.accountnumber = data[0].accountnumber;
              $scope.user.filtername = data[0].filtername;
              $scope.user.ivz_customer = data[0].ivz_customer;
              $scope.user.accountype = data[0].accountype;
              $scope.user.ivz_statuscomplete = data[0].ivz_statuscomplete;
              $scope.user.remarkreject = data[0].remarkreject;
              $scope.user.ivz_taxid = data[0].ivz_taxid;
              $scope.user.customertypecode = data[0].customertypecode;
              $scope.user.statustype = data[0].statustype;
              $scope.user.statustypecode = data[0].statustypecode;
              $scope.user.ivz_doc01 = data[0].ivz_doc01;
              $scope.user.ivz_doc02 = data[0].ivz_doc02;
              $scope.user.ivz_doc03 = data[0].ivz_doc03;
              $scope.user.ivz_dochouseholdregis = data[0].ivz_dochouseholdregis;
              $scope.user.ivz_docidcard = data[0].ivz_docidcard;
              $scope.user.matchtype = data[0].matchtype;
              $scope.user.statusempid = data[0].statusempid;
              $scope.user.ivz_balancecredit = data[0].ivz_balancecredit;
              $scope.user.ivz_integrationid = data[0].ivz_integrationid;
              $scope.user.currencyid = data[0].currencyid;
              $scope.user.shippingmethodcode = data[0].shippingmethodcode;
              $scope.user.paymenttermscode = data[0].paymenttermscode;
              $scope.user.telephone1 = data[0].telephone1;
              $scope.user.address1_name = data[0].address1_name;
              $scope.user.fax = data[0].fax;
              $scope.user.address1_postalcode = data[0].address1_postalcode;
            }
            if($scope.$phase){
              $scope.$apply();
            }
          });
        }
        $scope.openAccountEditDetail = function() {
            var account = new MobileCRM.FetchXml.Entity("account");
            account.addAttribute("accountid");
            // only active record can have edit form
            account.filter = new MobileCRM.FetchXml.Filter();
            account.filter.where("accountid", "eq", $scope.user.accountid);
            // only one record will be fetched
            var fetch = new MobileCRM.FetchXml.Fetch(account, 1);
            fetch.execute(
              "Array",  // Take the results as an array of arrays with field values
              function (res) {
                MobileCRM.UI.FormManager.showEditDialog("account", res[0][0], null);
              },
              MobileCRM.bridge.alert
            );
          }
        $scope.$on('$ionicView.enter',function(){
          $scope.getAccount();
        });
    })
    .controller('AccountInvoiceCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        Data.mastertype = $stateParams.mastertype;
        $scope.vCheckAll = 0;
        $scope.getInvoiceChecker = function(){
          $scope.listaccountinvoice = [];
          getInvoiceBid($stateParams.accountid,function(data){
            $scope.showLoading('กำลังโหลดข้อมูล');
            if(data.length > 0){
              var x = 0;
              var loopArray = function(arr){
                getPush(x,function(){
                  x++;
                  if(x < arr.length){
                    loopArray(arr);
                  }else{
                    $ionicLoading.hide();
                  }
                });
              }
              loopArray(data);
              function getPush(i,callback){
                $scope.listaccountinvoice.push({
                  ivz_invoicedate:new Date(data[i].ivz_invoicedate),
	                invoicenumber:data[i].invoicenumber,
	            		customerid:data[i].customerid,
	                territoryid:data[i].territoryid,
	            		accountnumber:data[i].accountnumber,
									ivz_addressprovince:data[i].ivz_addressprovince,
									ivz_addressdistrict:data[i].ivz_addressdistrict,
									filtername:data[i].filtername,
									accountype:$stateParams.mastertype,
                  txtid:data[i].txtid
                });
                setTimeout(function(){
                  callback();
                },10);
              }
            }else{
              setTimeout(function(){
                alert('ไม่พบข้อมูล');
                $ionicLoading.hide();
              },3000);
            }
            if($scope.$phase){
              $scope.$apply();
            }
          });
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.getInvoiceChecker();
        });
    })
    .controller('AccountBillingCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        Data.mastertype = $stateParams.mastertype;
        $scope.vCheckAll = 0;
        $scope.getInvoiceChecker = function(){
          $scope.listaccountbilling = [];
          GetBillingByIaccount($stateParams.accountid,function(data){
            $scope.showLoading('กำลังโหลดข้อมูล');
            if(data.length > 0){
              var x = 0;
              var loopArray = function(arr){
                getPush(x,function(){
                  x++;
                  if(x < arr.length){
                    loopArray(arr);
                  }else{
                    $ionicLoading.hide();
                  }
                });
              }
              loopArray(data);
              function getPush(i,callback){
                $scope.listaccountbilling.push({
                  ivz_billingnotestableid:data[i].ivz_billingnotestableid,
                  ivz_name:data[i].ivz_name,
                  ivz_billingnumber:data[i].ivz_billingnumber,
                  ivz_sumbillingamount:data[i].ivz_sumbillingamount,
                  ivz_billingdate:new Date(data[i].ivz_billingdate),
                  ivz_customername:data[i].ivz_customername,
                  createdon:data[i].createdon,
                  ivz_customernumber:data[i].ivz_customernumber,
                  ivz_addressdistrict:data[i].ivz_addressdistrict,
                  ivz_addressprovince:data[i].ivz_addressprovince,
                  territoryid:data[i].territoryid,
                  txtid:data[i].txtid
                });
                setTimeout(function(){
                  callback();
                },10);
              }
            }else{
              setTimeout(function(){
                alert('ไม่พบข้อมูล');
                $ionicLoading.hide();
              },3000);
            }
            if($scope.$phase){
              $scope.$apply();
            }
          });
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.getInvoiceChecker();
        });
    })
    ////////////////////// end /////////////////
    ////////////////////// Adjustment ///////////////
    .controller('AdjustmentListCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, dataaccount) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $scope.dataaccount = dataaccount;
        Data.territoryadjust = $stateParams.terid;
        $scope.group = {
            accountid: ''
        };
        //alert($stateParams.terid);
        $scope.reloader = function () {
            $scope.listaccount = [];
            GetAccount(Data.territoryadjust,retername($cookies.get('mastertype')), 1, function (data) {
              $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
                var x = 0;
                var loopArray = function (arr) {
                    getPush(x, function () {
                        x++;
                        if (x < arr.length) {
                            loopArray(arr);
                        } else {
                            $ionicLoading.hide();
                        }
                    });
                }
                loopArray(data);
                function getPush(i, callback) {
                    if (data[i].statuscode === '1' || data[i].statuscode === 1 || data[i].statuscode === '0' || data[i].statuscode === 0) {
                        // $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล ' + data[i].filtername);
                        $scope.listaccount.push({
                            accountid: data[i].accountid,
                            name: data[i].name,
                            ivz_addresscountry: data[i].ivz_addresscountry,
                            ivz_addressprovince: data[i].ivz_addressprovince,
                            ivz_addressdistrict: data[i].ivz_addressdistrict,
                            ivz_availablefromtime: data[i].ivz_availablefromtime,
                            ivz_availabletotime: data[i].ivz_availabletotime,
                            territoryid: data[i].territoryid,
                            customertypecode: data[i].customertypecode,
                            statuscode: data[i].statuscode,
                            accountnumber: data[i].accountnumber,
                            filtername: data[i].filtername,
                            ivz_customer: data[i].ivz_customer,
                            accountype: data[i].accountype,
                            ivz_statuscomplete: data[i].ivz_statuscomplete,
                            remarkreject: data[i].remarkreject,
                            ivz_taxid: data[i].ivz_taxid,
                            customertypecode: data[i].customertypecode,
                            statustype: data[i].statustype,
                            ivz_doc01: data[i].ivz_doc01,
                            ivz_doc02: data[i].ivz_doc02,
                            ivz_doc03: data[i].ivz_doc03,
                            ivz_dochouseholdregis: data[i].ivz_dochouseholdregis,
                            ivz_docidcard: data[i].ivz_docidcard,
                            matchtype: data[i].matchtype,
                            statusempid: data[i].statusempid
                        });
                        // dataaccount.user.push({
                        //   accountid:data[i].accountid,
                        //   name:data[i].name,
                        //   ivz_addresscountry:data[i].ivz_addresscountry,
                        //   ivz_addressprovince:data[i].ivz_addressprovince,
                        //   ivz_addressdistrict:data[i].ivz_addressdistrict,
                        //   ivz_availablefromtime:data[i].ivz_availablefromtime,
                        //   ivz_availabletotime:data[i].ivz_availabletotime,
                        //   territoryid:data[i].territoryid,
                        //   customertypecode:data[i].customertypecode,
                        //   statuscode:data[i].statuscode,
                        //   accountnumber:data[i].accountnumber,
                        //   filtername:data[i].filtername,
                        //   ivz_customer:data[i].ivz_customer,
                        //   accountype:data[i].accountype,
                        //   ivz_statuscomplete:data[i].ivz_statuscomplete,
                        //   remarkreject:data[i].remarkreject,
                        //   ivz_taxid:data[i].ivz_taxid,
                        //   customertypecode:data[i].customertypecode,
                        //   statustype:data[i].statustype,
                        //   ivz_doc01:data[i].ivz_doc01,
                        //   ivz_doc02:data[i].ivz_doc02,
                        //   ivz_doc03:data[i].ivz_doc03,
                        //   ivz_dochouseholdregis:data[i].ivz_dochouseholdregis,
                        //   ivz_docidcard:data[i].ivz_docidcard,
                        //   matchtype:data[i].matchtype,
                        //   statusempid:data[i].statusempid
                        // });
                    }
                    setTimeout(function () {
                        callback();
                    }, 0);
                }
                if($scope.$phase){$scope.$apply();}
            });
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.reloader();
        });
        $scope.cAdjustment = function () {
            //alert($scope.group.accountid);
            if ($scope.group.accountid) {
                $scope.showLoadingProperTimes();
                $state.go('app.adjustment', {
                    accountid: $scope.group.accountid,
                    mastertype: Data.mastertype
                }, {
                    reload: true
                });
            }
        }
        $scope.cAdjustmentCredit = function () {
            if ($scope.group.accountid) {
                $scope.showLoadingProperTimes();
                $state.go('app.adjustmentcredit', {
                    accountid: $scope.group.accountid,
                    mastertype: Data.mastertype
                }, {
                    reload: true
                });
            };
        }
    })
    .controller('AdjustmentCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, dataaccount) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $ionicLoading.hide();
        $scope.dataaccount = dataaccount;
        Data.mastertype = $stateParams.mastertype;
        //  var index = $stateParams.id;
        var acountid = $stateParams.accountid;
        //alert(dataaccount.user[0].accountid);
        $scope.group = {
            accountid: ''
        }
        $scope.user = {
            accountid: '',
            name: '',
            ivz_addresscountry: '',
            ivz_addressprovince: '',
            ivz_addressdistrict: '',
            ivz_availablefromtime: '',
            ivz_availabletotime: '',
            territoryid: '',
            customertypecode: '',
            statuscode: '',
            accountnumber: '',
            filtername: '',
            ivz_customer: '',
            accountype: '',
            ivz_statuscomplete: '',
            remarkreject: '',
            ivz_taxid: '',
            customertypecode: '',
            statustype: '',
            ivz_doc01: '',
            ivz_doc02: '',
            ivz_doc03: '',
            ivz_dochouseholdregis: '',
            ivz_docidcard: '',
            matchtype: '',
            statusempid: '',
            ivz_balancecredit: '',
            ivz_integrationid: '',
            statustypecode: ''
        }
        $scope.chk = {
            doc004: true,
            doc005: true
        }
        $scope.loaddata = function(){
          try {
              GetAccountById($stateParams.accountid.trim(),retername($cookies.get('mastertype')), function (data) {
                  $scope.user.accountid = data[0].accountid;
                  $scope.user.name = data[0].name;
                  $scope.user.ivz_addresscountry = data[0].ivz_addresscountry;
                  $scope.user.ivz_addressprovince = data[0].ivz_addressprovince;
                  $scope.user.ivz_addressdistrict = data[0].ivz_addressdistrict;
                  $scope.user.ivz_availablefromtime = data[0].ivz_availablefromtime;
                  $scope.user.ivz_availabletotime = data[0].ivz_availabletotime;
                  $scope.user.territoryid = data[0].territoryid;
                  $scope.user.customertypecode = data[0].customertypecode;
                  $scope.user.statuscode = data[0].statuscode;
                  $scope.user.accountnumber = data[0].accountnumber;
                  $scope.user.filtername = data[0].filtername;
                  $scope.user.ivz_customer = data[0].ivz_customer;
                  $scope.user.accountype = data[0].accountype;
                  $scope.user.ivz_statuscomplete = data[0].ivz_statuscomplete;
                  $scope.user.remarkreject = data[0].remarkreject;
                  $scope.user.ivz_taxid = data[0].ivz_taxid;
                  $scope.user.customertypecode = data[0].customertypecode;
                  $scope.user.statustype = data[0].statustype;
                  $scope.user.ivz_doc01 = data[0].ivz_doc01;
                  $scope.user.ivz_doc02 = data[0].ivz_doc02;
                  $scope.user.ivz_doc03 = data[0].ivz_doc03;
                  $scope.user.ivz_dochouseholdregis = data[0].ivz_dochouseholdregis;
                  $scope.user.ivz_docidcard = data[0].ivz_docidcard;
                  $scope.user.matchtype = data[0].matchtype;
                  $scope.user.statusempid = data[0].statusempid;
                  $scope.user.ivz_balancecredit = data[0].ivz_balancecredit;
                  $scope.user.ivz_integrationid = data[0].ivz_integrationid;
                  $scope.user.statustypecode = data[0].statustypecode;
                  Data.statustypecode = data[0].statustypecode;
                  if($scope.$phase){$scope.$apply();}
              });

          } catch (er) {
              //document.getElementById('log').innerHTML = 'loop ' + er + '<br />';
          }
        }
        $scope.$on('$ionicView.enter',function(){
          $scope.loaddata();
          $ionicLoading.hide();
        });

        $scope.goop = function (id) {
            if (id == 1 || id == '1') {
                var xc = $scope.user.accountid + '\n' +
                    $scope.user.name + '\n' +
                    $stateParams.mastertype + '\n' +
                    $scope.user.territoryid.id;
                $scope.showLoadingProperTimes();
                $state.go('app.adjustmentname', {
                                                  accountid: $scope.user.accountid,
                                                  accountname: $scope.user.name,
                                                  mastertype: $stateParams.mastertype,
                                                  terid: $scope.user.territoryid.id,
                                                  ivz_integrationid: $scope.user.ivz_integrationid
                                              }, {
                                                  reload: true
                                              });
            } else if (id == 2 || id == '2') {
                $scope.showLoadingProperTimes();
                $state.go('app.adjustmentaddress', {
                    accountid: $scope.user.accountid,
                    statustypecode: $scope.user.statustypecode,
                    mastertype: $stateParams.mastertype,
                    terid: $scope.user.territoryid.id
                }, {
                    reload: true
                });
            } else if (id == 3 || id == '3') {
                $scope.showLoadingProperTimes();
                $state.go('app.adjustmenttransport', {
                    accountid: $scope.user.accountid,
                    mastertype: $stateParams.mastertype,
                    cusname: $scope.user.name
                }, {
                    reload: true
                });
            } else if (id == 4 || id == '4') {
                $scope.showLoadingProperTimes();
                $state.go('app.adjustmentcontact', {
                    accountid: $scope.user.accountid,
                    mastertype: $stateParams.mastertype,
                    cusname: $scope.user.name
                }, {
                    reload: true
                });
              } else if (id == 5 || id == '5') {
                  $scope.showLoadingProperTimes();
                  $state.go('app.adjustmentcontact', {
                      accountid: $scope.user.accountid,
                      mastertype: $stateParams.mastertype,
                      cusname: $scope.user.name
                  }, {
                      reload: true
                  });
              }else if (id == 6 || id == '6') {
                  $scope.showLoadingProperTimes();
                  $state.go('app.adjustmentcontact', {
                      accountid: $scope.user.accountid,
                      mastertype: $stateParams.mastertype,
                      cusname: $scope.user.name
                  }, {
                      reload: true
                  });
              }else if (id == 7 || id == '7') {
                  $scope.showLoadingProperTimes();
                  $state.go('app.adjustmentcontact', {
                      accountid: $scope.user.accountid,
                      mastertype: $stateParams.mastertype,
                      cusname: $scope.user.name
                  }, {
                      reload: true
                  });
              }else if (id == 8 || id == '8') {
                  $scope.showLoadingProperTimes();
                  $state.go('app.adjustmentcontact', {
                      accountid: $scope.user.accountid,
                      mastertype: $stateParams.mastertype,
                      cusname: $scope.user.name
                  }, {
                      reload: true
                  });
              }
        }

        $scope.cAdjustmentCancel = function () {
            console.log('back');
            $scope.reback();
        }
    })
    .controller('AdjustmentNameCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $ionicLoading.hide();
        $scope.user = {
            accountid: $stateParams.accountid.trim(),
            txtname: $stateParams.accountname,
            bs4: '',
            bs5: ''
        };
        $scope.chk = {
            doc004: true,
            doc005: true
        };
        $('#doc004').change(function () {
            GetAtt('#doc004', '#idcImg04', 'canvas04', function (data) {
                $ionicLoading.hide();
                $scope.chk.doc004 = true;
                console.log(data.length);
                $scope.user.bs4 = data;
                //document.getElementById('log').innerHTML = 'bs4 '+data;
            });
        });
        $('#doc005').change(function () {
            GetAtt('#doc005', '#idcImg05', 'canvas05', function (data) {
                $ionicLoading.hide();
                $scope.chk.doc005 = true;
                $scope.user.bs5 = data;
                //document.getElementById('log').innerHTML = 'bs5 '+data;
            });
        });
        $scope.cAdjustmentCancel = function () {
            //document.getElementById('log').innerHTML = 'Click Back';
            $ionicHistory.goBack(-1);
        }
        $scope.cAdjustment = function () {
            var a = $scope.user.bs4;
            var b = $scope.user.bs5;
            if (a) {
                $scope.chk.doc004 = true;
            } else {
                $scope.chk.doc004 = false;
            }
            if (b) {
                $scope.chk.doc005 = true;
            } else {
                $scope.chk.doc005 = false;
            }

            function insertadjustment(diug, id, txt, name, callback) {
                var ins = new MobileCRM.DynamicEntity.createNew('ivz_accountadjustment');
                ins.properties.ivz_accountadjustmentid = diug;
                ins.properties.ivz_adjgeneral = parseInt(1);
                ins.properties.ivz_adjgenname = parseInt(1);
                ins.properties.ivz_newgenname = txt;
                ins.properties.ivz_name = $scope.user.txtname;
                ins.properties.ivz_refrecid = parseInt($stateParams.ivz_integrationid);
                ins.properties.ivz_customernumber = new MobileCRM.Reference('account', id);
                ins.properties.ivz_statusempid = parseInt(Data.mastertype);
                ins.properties.ivz_empid = $cookies.get('ivz_empid');
                ins.properties.ivz_territory = new MobileCRM.Reference('territory', Data.territoryadjust);
                ins.properties.statuscode = parseInt(917970000);
                ins.save(function (er) {
                    if (er) {
                        alert("ADJUSTMENT4157:" + er);
                    } else {
                        callback();
                    }
                });
            }

            function updateadjustment(idadj, id, txt, name, callback) {
                var ins = new MobileCRM.DynamicEntity('ivz_accountadjustment', idadj);
                ins.properties.ivz_name = $scope.user.txtname;
                ins.properties.ivz_adjgeneral = parseInt(1);
                ins.properties.ivz_adjgenname = parseInt(1);
                ins.properties.ivz_newgenname = txt;
                ins.properties.ivz_refrecid = parseInt($stateParams.ivz_integrationid);
                ins.properties.ivz_customernumber = new MobileCRM.Reference('account', id);
                ins.properties.ivz_statusempid = parseInt(Data.mastertype);
                ins.properties.ivz_empid = $cookies.get('ivz_empid');
                ins.properties.ivz_territory = new MobileCRM.Reference('territory', Data.territoryadjust);
                ins.properties.statuscode = parseInt(917970000);
                ins.save(function (er) {
                    if (er) {
                        alert("ADJUSTMENT4176:" + er);
                    } else {
                        callback();
                    }
                });
            }
            if ($scope.chk.doc004 == true && $scope.chk.doc005 == true) {
                //$stateParams.terid;
                chkAdjustment($stateParams.accountid.trim(), function (data) {
                    if (data) {
                        //alert(data.length);
                        if (data.length > 0) {
                            $scope.showLoadingProperTimesRegter('กำลังบันทึกข้อมูล');
                            var x = 'update ' + data[0].ivz_accountadjustmentid + '::' + data[0].ivz_customernumber.id;
                            //alert(x);
                            updateadjustment(data[0].ivz_accountadjustmentid, data[0].ivz_customernumber.id, $scope.user.txtname, $stateParams.accountname, function () {
                                console.log('insert ad');
                                $scope.InAnnoteAttract('ivz_accountadjustment', data[0].ivz_accountadjustmentid, $scope.user.bs4, 'สำเนาทะเบียนบ้าน(ต้องมี) เปลี่ยนแปลงข้อมูล ' + data[0].ivz_customernumber.primaryName, 3, function () {
                                    console.log('ok att');
                                });
                                setTimeout(function () {
                                    $scope.InAnnoteAttract('ivz_accountadjustment', data[0].ivz_accountadjustmentid, $scope.user.bs5, 'สำเนาประจำตัวบัตรประชาชน(ต้องมี) เปลี่ยนแปลงข้อมูล ' + data[0].ivz_customernumber.primaryName, 3, function () {
                                        console.log('ok att');
                                        $scope.showLoadingComplete('บันทึกข้อมูลเสร็จแล้ว');
                                    });
                                }, 1000);
                            });
                        } else {
                            var x = 'insert ' + $stateParams.accountid + '::' + $stateParams.ivz_integrationid;
                            //alert(x);
                            var dui = guid();
                            insertadjustment(dui, $stateParams.accountid, $scope.user.txtname, $stateParams.accountname, function () {
                                console.log('insert ad');
                                $scope.InAnnoteAttract('ivz_accountadjustment', dui, $scope.user.bs4, 'สำเนาทะเบียนบ้าน(ต้องมี) เปลี่ยนแปลงข้อมูล ' + $stateParams.accountname, 3, function () {
                                    console.log('ok att');
                                });
                                setTimeout(function () {
                                    $scope.InAnnoteAttract('ivz_accountadjustment', dui, $scope.user.bs5, 'สำเนาประจำตัวบัตรประชาชน(ต้องมี) เปลี่ยนแปลงข้อมูล ' + $stateParams.accountname, 3, function () {
                                        console.log('ok att');
                                        $scope.showLoadingComplete('บันทึกข้อมูลเสร็จแล้ว');
                                    });
                                }, 1000);
                            });
                        }
                        setTimeout(function () {
                            $ionicHistory.goBack(-1);
                            $ionicLoading.hide();
                            $scope.sendmailtosup($stateParams.terid, 'เปลี่ยนแปลงข้อมูลชื่อลูกค้า', 'ร้าน'+$scope.user.txtname, function () {
                                console.log('ok');
                                $ionicLoading.hide();
                            });
                        }, 3000);
                    }
                    if($scope.$phase){$scope.$apply();}
                });
            } else {
                console.log('not insert');
            }
        }
    })
    .controller('AdjustmentOptionCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory ,$ionicModal) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $ionicLoading.hide();
        Data.mastertype = $stateParams.mastertype;
        $scope.getCusAds = function (id) {
            $scope.listaddressaccount = [];
            GetCustomerAddres(id, function (data) {
               //alert(data.length);
                var x = 0;
                var loopArray = function (arr) {
                    getPush(x, function () {
                        x++;
                        if (x < arr.length) {
                            loopArray(arr);
                        } else {
                            $ionicLoading.hide();
                        }
                    });
                }
                loopArray(data);
                function getPush(i, callback) {
                    $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล' + data[i].addressname);
                    $scope.listaddressaccount.push({
                        customeraddressid: data[i].customeraddressid,
                        addressname: data[i].addressname,
                        line1: data[i].line1,
                        city: data[i].city,
                        stateorprovince: data[i].stateorprovince,
                        postalcode: data[i].postalcode,
                        addrscode: data[i].addrscode,
                        addresstypecode: data[i].addresstypecode,
                        ivz_integrationid: data[i].ivz_integrationid,
                        parentid: data[i].parentid,
                        addresscode: data[i].addresscode
                    });
                    setTimeout(function () {
                        callback();
                    }, 10);
                };
                if($scope.$phase){$scope.$apply();}
            });
        }
        $scope.$on("$ionicView.enter", function () {
            $scope.getCusAds($stateParams.accountid);
        });
        $scope.goaddress = function (id) {
            ///$state.go('app.adjustmentaddressform',{reload:true});
            $scope.showLoadingProperTimes();
            $state.go('app.adjustmentaddressform', {
                addressid: id,
                accountid: $stateParams.accountid,
                statustypecode: $stateParams.statustypecode,
                mastertype: Data.mastertype,
                typeinsert: 1,
                terid:$stateParams.terid
            }, {
                reload: true
            });
        }

        $scope.cAdjustment = function () {
            $state.go('app.adjustmentaddressform', {
                addressid: '',
                accountid: $stateParams.accountid,
                statustypecode: $stateParams.statustypecode,
                mastertype: Data.mastertype,
                typeinsert: 2,
                terid:$stateParams.terid
            }, {
                reload: true
            });
        }
        $scope.cAdjustmentCancel = function () {
            $ionicHistory.goBack(-1);
        }
    })
    .controller('AdjustmentAddressFormCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        // Data.mastertype = $stateParams.mastertype;
         //alert($stateParams.accountid);
        $scope.user = {
            customeraddressid: '',
            txtcode: '',
            txtname: '',
            txtcustname:'',
            txtaddress: '',
            txtprovice: '',
            provinceid: '',
            txtdistrict: '',
            districtid: '',
            txtzipcode: '',
            addrscode: '',
            addresstypecode: '',
            ivz_integrationid: '',
            parentid: $stateParams.accountid,
            mastertype: '',
            doc01: '',
            doc02: '',
            doc03: '',
            doc04: '',
            doc05: '',
            docmatch:''
        };
        $scope.chk = {
            accounttype: true,
            addresprovice: true,
            addressdistrict: true,
            section: Data.statustypecode,
            doc01: true,
            doc02: true,
            doc03: true,
            doc04: true,
            doc05: true
        };
        Getivz_CustomerAddress(function (data) {
            $scope.adjusttype = data;
            if($scope.$phase){$scope.$apply();}
        });

        GetProvinceList(function (data) {
            $scope.provincelist = data;
            if($scope.$phase){$scope.$apply();}
        });
        GetDistrict(function (data) {
            $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
            setTimeout(function () {
                $ionicLoading.hide();
            }, 1000);
            $scope.districtlist = data;
            if($scope.$phase){$scope.$apply();}
        });
        if($stateParams.accountid){
          GetAccountById($stateParams.accountid,Data.mastertype,function(data){
            //alert(data.length);
            $scope.user.txtcustname = data[0].name;
            if($scope.$phase){
              $scope.$apply();
            }
          });
        }
        var getCusAds = function (id) {
            if (id) {
                GetCustomerAddresById(id, function (data) {
                    //alert(id+'::'+data[0].stateorprovince+'::'+data[0].city);
                    var x = 0;
                    var loopArray = function (arr) {
                        getPush(x, function () {
                            x++;
                            if (x < arr.length) {
                                loopArray(arr);
                            } else {
                                $ionicLoading.hide();
                            }
                        });
                    };
                    loopArray(data);

                    function getPush(i, callback) {
                        try {
                            $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล ' + data[i].addressname);
                            $scope.user.customeraddressid = data[i].customeraddressid;
                            $scope.user.txtcode = data[i].addresstypecode;
                            $scope.user.txtname = data[i].addressname;
                            $scope.user.txtaddress = data[i].line1;
                            $scope.user.txtprovice = data[i].stateorprovince;
                            $scope.user.txtdistrict = data[i].city;
                            $scope.user.txtzipcode = data[i].postalcode;
                            $scope.user.addresstypecode = data[i].addresscode;
                            $scope.user.ivz_integrationid = data[i].ivz_integrationid;
                            $scope.user.parentid = data[i].parentid.id;
                            $scope.user.mastertype = $stateParams.mastertype;
                            $scope.user.provinceid = data[i].provinceid.id;
                            $scope.user.districtid = data[i].districtid.id;
                            setTimeout(function () {
                                callback();
                            }, 1000);
                        } catch (er) {
                            alert('error 4375 ' + er);
                        }
                    }
                    if($scope.$phase){$scope.$apply();}
                });
            } else {
                //alert($stateParams.accountid);
                try {
                  GetAccountById(id,Data.mastertype,function(data){
                    $scope.user.customeraddressid = '';
                    $scope.user.txtcode = '';
                    $scope.user.txtname = data[0].name;
                    $scope.user.txtaddress = '';
                    $scope.user.txtprovice = '';
                    $scope.user.provinceid = '';
                    $scope.user.txtdistrict = '';
                    $scope.user.districtid = '';
                    $scope.user.txtzipcode = '';
                    $scope.user.addresstypecode = '';
                    $scope.user.ivz_integrationid = '';
                    $scope.user.parentid = $stateParams.accountid;
                    $scope.user.mastertype = $stateParams.mastertype;
                    if($scope.$phase){
                      $scope.$apply();
                    }
                  });
                } catch (er) {
                    alert('error 4396 ' + er);
                }
            }
        }
        $scope.$on("$ionicView.enter", function () {
            $ionicLoading.hide();
            //console.log('reload complete');
            if($stateParams.addressid){
              getCusAds($stateParams.addressid);
            }

            $(function(){
              $('#doc01').change(function () {
                  GetAtt('#doc01', '#idcImg01', 'canvas01', function (data) {
                      //alert('changer'+data.length);
                      if (data) {
                          $scope.user.doc01 = data;
                      }
                      $scope.$apply();
                  });
              });
              $('#doc02').change(function () {
                  GetAtt('#doc02', '#idcImg02', 'canvas02', function (data) {
                      if (data) {

                          $scope.user.doc02 = data;
                      }
                      $scope.$apply();
                  });
              });
              $('#doc03').change(function () {
                  GetAtt('#doc03', '#idcImg03', 'canvas03', function (data) {
                      if (data) {

                          $scope.user.doc03 = data;
                      }
                      $scope.$apply();
                  });
              });
              $('#doc04').change(function () {
                  GetAtt('#doc04', '#idcImg04', 'canvas04', function (data) {
                      if (data) {

                          $scope.user.doc04 = data;
                      }
                      $scope.$apply();
                  });
              });
              $('#doc05').change(function () {
                  GetAtt('#doc05', '#idcImg05', 'canvas05', function (data) {
                      if (data) {
                          $scope.user.doc05 = data;
                      }
                      $scope.$apply();
                  });
              });
            });

        }); //end on view
        $scope.mdSlProv = function (id) {
          $scope.user.provinceid = id;
            $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
            if(id){
              GetDistrictById(id, function (data) {
                  $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                  setTimeout(function () {
                      $ionicLoading.hide();
                  }, 1000);
                  $scope.districtlist = data;
                  if($scope.$phase){$scope.$apply();}
              });
            }
        };
        //get just
        $scope.searchtype = function (txt) {
            if (txt) {
                $scope.chk.accounttype = false;
            } else {
                $scope.chk.accounttype = true;
            }
        }
        $scope.cSetType = function (id, txt) {
            //alert(id+'::'+txt);
            if (id) {
                $scope.user.addrscode = id;
                $scope.user.txtcode = txt;
                $scope.chk.accounttype = true;
            } else {
                $scope.user.addrscode = null;
                $scope.user.txtcode = null;
                $scope.chk.accounttype = true;
            }
        }

        //Data.mastertype = $stateParams.mastertype;
        /////////////////////// Chk change ////////////////////
        $scope.searchtype = function (txt) {
            if (txt) {
                $scope.chk.accounttype = false;
            } else {
                $scope.chk.accounttype = true;
            }
        }
        $scope.cSetType = function (id, txt) {
            console.log(id + '::' + txt.length);
            if (txt.length > 0) {
                $scope.chk.accounttype = true;
                $scope.user.txtcode = txt;
                $scope.user.addresstypecode = id;
                console.log(id + '::' + txt);
            } else {
                $scope.chk.accounttype = false;
                $scope.user.txtcode = null;
                $scope.user.addresstypecode = null;
                console.log('null id txt');
            }
        }

        $scope.searchProvince = function (txt) {
            if (txt) {
                $scope.chk.addresprovice = false;
            } else {
                $scope.chk.addresprovice = true;
            }
        }
        $scope.cSetTypeProvince = function (id, txt) {
          //alert('id, txt:'+id+'=='+txt);
            $scope.user.txtdistrict = null;
            $scope.user.districtid = null;
            if (txt.length > 0) {
                $scope.chk.addresprovice = true;
                $scope.user.txtprovice = txt;
                $scope.user.provinceid = id;
                console.log(id + '::' + txt);
            } else {
                $scope.chk.addresprovice = false;
                $scope.user.txtprovice = null;
                $scope.user.provinceid = null;
                console.log('null id txt');
            }
        }

        $scope.searchDistrict = function (txt) {
            if (txt) {
                $scope.chk.addressdistrict = false;
            } else {
                $scope.chk.addressdistrict = true;
            }
        }
        $scope.cSetTypeDistrict = function (id, txt) {
          //alert('id, txt:'+id+'=='+txt);
            if (txt.length > 0) {
                $scope.chk.addressdistrict = true;
                $scope.user.txtdistrict = txt;
                $scope.user.districtid = id;
                console.log(id + '::' + txt);
            } else {
                $scope.chk.addressdistrict = false;
                $scope.user.txtdistrict = null;
                $scope.user.districtid = null;
                console.log('null id txt');
            }
        }
        // $scope.chk.doc01 = false;
        // $scope.chk.doc02 = false;
        // $scope.chk.doc03 = false;
        // $scope.chk.doc04 = false;
        // $scope.chk.doc05 = false;
        var invarrible = 0;
        $scope.$watch('user.doc01', function () {
            if ($scope.user.doc01) {
                $scope.chk.doc01 = false;
                invarrible = 1;
            }
            console.log('watch::' + $scope.user.doc01.length);
        });
        $scope.$watch('user.doc02', function () {
            if ($scope.user.doc02) {
                $scope.chk.doc02 = false;
                invarrible = 1;
            }
            console.log('watch::' + $scope.user.doc02.length);
        });
        $scope.$watch('user.doc03', function () {
            if ($scope.user.doc03) {
                $scope.chk.doc03 = false;
                invarrible = 1;
            }
            console.log('watch::' + $scope.user.doc03.length);
        });
        $scope.$watch('user.doc04', function () {
            if ($scope.user.doc04) {
                $scope.chk.doc04 = false;
            }
            console.log('watch::' + $scope.user.doc02.length);
        });
        $scope.$watch('user.doc05', function () {
            if ($scope.user.doc05) {
                $scope.chk.doc05 = false;
            }
            console.log('watch::' + $scope.user.doc03.length);
        });
        $scope.$watch('user.provinceid', function () {
            if ($scope.user.provinceid) {
                //alert($scope.user.provinceid);
                $scope.mdSlProv($scope.user.provinceid);
            }
        });
        ///////////////////////// End ////////////////////////
        function insadjustment(id,callback){
          // var txt = '$scope.user.txtname:'+$scope.user.txtname+'\n'+
          //           '$stateParams.typeinsert:'+$stateParams.typeinsert+'\n'+
          //           '$scope.user.addresstypecode:'+$scope.user.addresstypecode+'\n'+
          //           '$scope.user.ivz_integrationid:'+$scope.user.ivz_integrationid+'\n'+
          //           '$scope.user.txtname:'+$scope.user.txtname+'\n'+
          //           '$scope.user.txtaddress:'+$scope.user.txtaddress+'\n'+
          //           '$scope.user.provinceid:'+$scope.user.provinceid+'\n'+
          //           '$scope.user.districtid:'+$scope.user.districtid+'\n'+
          //           '$scope.user.txtzipcode:'+$scope.user.txtzipcode+'\n'+
          //           '$cookies:'+$cookies.get('ivz_empid')+'\n'+
          //           'Data.territoryadjust:'+Data.territoryadjust+'\n'+
          //           '$scope.user.parentid:'+$scope.user.parentid;
          // alert('Insert db Address:'+txt);
          try {
            $scope.showLoadingProperTimesRegter('กำลังทำการบันทึกข้อมูล');
            var ins = new MobileCRM.DynamicEntity.createNew('ivz_accountadjustment');
                ins.properties.ivz_accountadjustmentid = id;
                ins.properties.ivz_name = $scope.user.txtname;
                ins.properties.ivz_transdate = new Date();
                ins.properties.ivz_adjgeneral = parseInt(1);
                ins.properties.ivz_adjgenaddress = parseInt(1);
                ins.properties.ivz_adjgenaddressoption = parseInt($stateParams.typeinsert);
                ins.properties.ivz_adjgenaddresstype = parseInt($scope.user.addresstypecode); //set invoice deliverry
                ins.properties.ivz_refrecid = $scope.user.ivz_integrationid;
                ins.properties.ivz_newgenaddressname = $scope.user.txtname;
                ins.properties.ivz_newgenaddressstreet1 = $scope.user.txtaddress;
                ins.properties.ivz_newgenaddressprovince = new MobileCRM.Reference('ivz_addressprovince', $scope.user.provinceid);
                ins.properties.ivz_newgenaddressdistrict = new MobileCRM.Reference('ivz_addressdistrict', $scope.user.districtid);
                ins.properties.ivz_newgenaddresscountry = new MobileCRM.Reference('ivz_addresscountry',Data.countrymaster);
                ins.properties.ivz_newgenaddresspostalcode = $scope.user.txtzipcode;
                ins.properties.ivz_empid = $cookies.get('ivz_empid');
                ins.properties.ivz_statusempid = parseInt(Data.mastertype);
                ins.properties.ivz_territory = new MobileCRM.Reference('territory', $stateParams.terid);
                ins.properties.statuscode = parseInt(917970000);
                ins.properties.ivz_customernumber = new MobileCRM.Reference('account', $scope.user.parentid);
                ins.save(function (er) {
                    if (er) {
                        alert("error 8259 :" + er);
                    }else{
                        //alert('complate');
                        $scope.user.docmatch = [{id:0,doc_annote:$scope.user.doc01},
                                                {id:1,doc_annote:$scope.user.doc02},
                                                {id:2,doc_annote:$scope.user.doc03},
                                                {id:3,doc_annote:$scope.user.doc04},
                                                {id:4,doc_annote:$scope.user.doc05}];
                        callback(id);
                    }
                });
          } catch (e) {
            alert('error 8182 '+e);
          }
        }
        var insertannote = function(gid){
          var data = $scope.user.docmatch;
          var x = 0;
          var loopArray = function(arr){
            insannote(x,function(){
              x++;
              if(x < arr.length){
                loopArray(arr);
              }else{
                setTimeout(function () {
                  $scope.sendmailtosup($cookies.get('territoryid'), 'ขออนุมัติเปลี่ยนแปลงข้อมูลที่อยู่', 'ร้าน' + $scope.user.txtcustname, function () {
                      $scope.showLoadingComplete('บันทึกข้อมูลเสร็จแล้ว');
                      $ionicLoading.hide();
                      $scope.reback();
                  });
              }, 2000);
              }
            });
          }
          loopArray(data);
          function insannote(i,callback){
            if(data[i].doc_annote.length > 0){
              $scope.InAnnoteAttract('ivz_accountadjustment',gid, data[i].doc_annote, i+'เปลี่ยนแปลงข้อมูลที่อยู่ ' + $scope.user.txtcustname, 1,null);
            }
            setTimeout(function(){
              callback();
            },3000);
          }
        }
        $scope.cAdjustment = function () {
            var type = $stateParams.statustypecode;
            var doc01 = $scope.user.doc01;
            var doc02 = $scope.user.doc02;
            var doc03 = $scope.user.doc03;
            var doc04 = $scope.user.doc04;
            var doc05 = $scope.user.doc05;
            var tPass = 0;
            if(doc01.length > 0 || doc02.length > 0 || doc03.length > 0){
              tPass = 1;
            }
            if($scope.user.doc04 && $scope.user.doc05 && tPass === 1){
              insadjustment(guid(),insertannote);
            }else{
              alert('กรุณาแนบเอกสารให้ครบด้วย');
            }
        }
        $scope.cAdjustmentCancel = function () {
            $scope.showLoadingProperTimes();
            $scope.user.customeraddressid = '';
            $scope.user.txtcode = '';
            $scope.user.txtname = '';
            $scope.user.txtcustname = '';
            $scope.user.txtaddress = '';
            $scope.user.txtprovice = '';
            $scope.user.provinceid = '';
            $scope.user.txtdistrict = '';
            $scope.user.districtid = '';
            $scope.user.txtzipcode = '';
            $scope.user.addrscode = '';
            $scope.user.addresstypecode = '';
            $scope.user.ivz_integrationid = '';
            $scope.user.parentid = '';
            $scope.user.mastertype = '';
            $scope.user.doc01 = '';
            $scope.user.doc02 = '';
            $scope.user.doc03 = '';
            $scope.user.doc04 = '';
            $scope.user.doc05 = '';
            setTimeout(function () {
                $ionicLoading.hide();
                $scope.reback();
            }, 1000);
        }
    })
    .controller('AdjustmentTransportCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $ionicLoading.hide();
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        Data.mastertype = $stateParams.mastertype;
        $scope.user = {
            txtname: '',
            txttel: '',
            remark:''
        };

        function inserttransport(callback) {
            var ins = new MobileCRM.DynamicEntity.createNew('ivz_accountadjustment');
            //ins.properties.ivz_accountadjustmentid = $scope.uid;
            ins.properties.ivz_name = $stateParams.cusname;
            ins.properties.ivz_transdate = new Date();
            ins.properties.ivz_adjgeneral = parseInt(1);
            ins.properties.ivz_adjgentransport = parseInt(1);
            ins.properties.ivz_newgentransport = $scope.user.txtname;
            ins.properties.ivz_newgenphonetransport = $scope.user.txttel;
            ins.properties.ivz_remarkcomment = $scope.user.remark;
            ins.properties.ivz_empid = $cookies.get('ivz_empid');
            ins.properties.ivz_statusempid = parseInt(Data.mastertype);
            ins.properties.ivz_territory = new MobileCRM.Reference('territory', Data.territoryadjust);
            ins.properties.statuscode = parseInt(917970000);
            ins.properties.ivz_customernumber = new MobileCRM.Reference('account', $stateParams.accountid);
            ins.save(function (er) {
                if (er) {
                    alert("ADJUSTMENT4796:" + er);
                } else {
                    callback();
                }
            });
        }
        $scope.cAdjustment = function () {
            console.log('insert address');
            if ($scope.user.txtname && $scope.user.txttel) {
                $scope.showLoadingProperTimesRegAll();
                inserttransport(function () {
                    setTimeout(function () {
                        $scope.sendmailtosup($cookies.get('territoryid'), 'ขออนุมัติเปลี่ยนแปลงข้อมูลขนส่ง', 'ร้าน' + $stateParams.cusname, function () {
                            $scope.showLoadingComplete('บันทึกข้อมูลเสร็จแล้ว');
                            $ionicLoading.hide();
                            $ionicHistory.goBack(-1);
                        });
                    }, 2000);
                });
            }
        }
        $scope.cAdjustmentCancel = function () {
            console.log('back');
            $scope.txtname = '';
            $scope.txttel = '';
            $ionicLoading.hide();
            $ionicHistory.goBack(-1);
        }
    })
    .controller('AdjustmentCreditCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        Data.mastertype = $stateParams.mastertype;
        $ionicLoading.hide();
        $scope.user = {
            accountid: '',
            txtname: '',
            swCloseAccount: false,
            slRemark: '',
            swCredit: false,
            txtCreditOld: '',
            txtCreditNew: 0
        }
        $scope.$on("$ionicView.enter", function () {
            GetResionStatus(function (data) {
                $scope.optionRession = data;
                if($scope.$phase){$scope.$apply();}
            });
            GetAccountById($stateParams.accountid,retername($cookies.get('mastertype')), function (data) {
                $scope.user.accountid = data[0].accountid;
                $scope.user.txtname = data[0].name;
                $scope.user.swCloseAccount = false;
                $scope.user.slRemark = '';
                $scope.user.swCredit = false;
                $scope.user.txtCreditOld = data[0].ivz_balancecredit;
                $scope.user.txtCreditNew = 0;
                if($scope.$phase){$scope.$apply();}
            });
            $scope.chkSwitch = function (id) {
                console.log(id);
                $scope.user.swCloseAccount = id;
                if ($scope.user.swCredit == true) {
                    $scope.user.swCredit = !(id);
                } else {
                    $scope.user.swCredit = false;
                }
            }
            $scope.chkSwitchCredit = function (id) {
                console.log(id);
                $scope.user.swCredit = id;
                if ($scope.user.swCloseAccount == true) {
                    $scope.user.swCloseAccount = !(id);
                } else {
                    $scope.user.swCloseAccount = false;
                }
            }
        });

        function retrue(expression) {
            switch (expression) {
            case false:
                return 0;
                break;
            case expression:
                return 1;
                break;
            default:

            }
        }

        function insertcredit(callback) {
            var ins = new MobileCRM.DynamicEntity.createNew('ivz_accountadjustment');
            if ($scope.user.swCredit == true) {
                ins.properties.ivz_newcredcredit = parseInt(1);
                ins.properties.ivz_adjcredit = parseInt(1);
                if (parseInt($scope.user.txtCreditOld) > parseInt($scope.user.txtCreditNew)) {
                    ins.properties.ivz_newcredcreditoption = parseInt(2);
                } else {
                    ins.properties.ivz_newcredcreditoption = parseInt(1);
                }
                ins.properties.ivz_newcredcreditlimitold = parseInt($scope.user.txtCreditOld);
                ins.properties.ivz_newcredcreditlimitnew = parseInt($scope.user.txtCreditNew);
            } else {
                ins.properties.ivz_adjcredcloseaccount = retrue($scope.user.swCloseAccount);
                ins.properties.ivz_adjcredclosereason = parseInt($scope.user.slRemark);
            }
            ins.properties.ivz_name = $scope.user.txtname;
            ins.properties.ivz_transdate = new Date();
            //ins.properties.ivz_refrecid = $scope.ivz_integrationid;
            ins.properties.ivz_statusempid = parseInt(Data.mastertype);
            ins.properties.ivz_empid = $cookies.get('ivz_empid');
            ins.properties.ivz_territory = new MobileCRM.Reference('territory', Data.territoryadjust);
            ins.properties.statuscode = parseInt(917970000);
            ins.properties.ivz_customernumber = new MobileCRM.Reference('account', $stateParams.accountid);
            ins.save(function (er) {
                if (er) {
                    alert("ADJUSTMENT4920:" + er);
                } else {
                    callback();
                }
            });
        }

        function setclear() {
            $scope.user.accountid = '';
            $scope.user.txtname = '';
            $scope.user.swCloseAccount = false;
            $scope.user.slRemark = '';
            $scope.user.swCredit = false;
            $scope.user.txtCreditOld = 0;
            $scope.user.txtCreditNew = 0;
        }

        $scope.cAdjustment = function () {
            //alert('insert adjustment credit :'+$scope.user.swCloseAccount+':::'+$scope.user.swCredit);
            if($scope.user.swCloseAccount === false && $scope.user.swCredit === false){
              console.log('null data');
            }else{
              if($scope.user.swCloseAccount === true){
                //alert($scope.user.swCloseAccount+':::'+$scope.user.slRemark);
                if($scope.user.slRemark){
                  $scope.showLoadingProperTimesRegAll();
                  insertcredit(function () {
                      setTimeout(function () {
                        $scope.sendmailtosup($cookies.get('territoryid'), 'ขออนุมัติปิดบัญชี', 'ร้าน' + $scope.user.txtname, function () {
                            $scope.showLoadingComplete('บันทึกข้อมูลเสร็จแล้ว');
                            $ionicLoading.hide();
                            setclear();
                            $scope.reback();
                        });
                      }, 2000);
                  });
                }else{
                  alert('กรุณาเลือกเหตุผลที่ปิดบัญชีด้วย');
                }
              }else if($scope.user.swCredit === true){
                //alert($scope.user.swCredit);
                $scope.showLoadingProperTimesRegAll();
                insertcredit(function () {
                    setTimeout(function () {
                      $scope.sendmailtosup($cookies.get('territoryid'), 'ขออนุมัติเปลี่ยนแปลงข้อมูลเครดิต', 'ร้าน' + $scope.user.txtname, function () {
                          $scope.showLoadingComplete('บันทึกข้อมูลเสร็จแล้ว');
                          $ionicLoading.hide();
                          setclear();
                          $scope.reback();
                      });
                    }, 2000);
                });
              }
            }
        }
        $scope.cAdjustmentCancel = function () {
            console.log('back');
            setclear();
            $scope.reback();
        }
    })
    .controller('AdjustmentContactCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        Data.mastertype = $stateParams.mastertype;
        ///adjustmentcontact/:accountid/:mastertype/:cusname',
        $ionicLoading.hide();
        GetOptionContact(function (data) {
            $scope.listcontact = data;
            if($scope.$phase){$scope.$apply();}
        });
        $scope.user = {
            accountid: $stateParams.accountid,
            contype: '',
            txtcontactname: '',
            txtcontactlastname: ''
        }

        function insertcontact(callback) {
            var ins = new MobileCRM.DynamicEntity.createNew('ivz_accountadjustment');
            ins.properties.ivz_adjgeneral = parseInt(1);
            ins.properties.ivz_adjgencontact = parseInt(1);
            ins.properties.ivz_newgencontactfirstname = $scope.user.txtcontactname;
            ins.properties.ivz_newgencontactlastname = $scope.user.txtcontactlastname;
            ins.properties.ivz_contacttype = parseInt($scope.user.contype);
            ins.properties.ivz_name = $stateParams.cusname;
            ins.properties.ivz_transdate = new Date();
            //ins.properties.ivz_refrecid = $scope.ivz_integrationid;
            ins.properties.ivz_statusempid = parseInt(Data.mastertype);
            ins.properties.ivz_empid = $cookies.get('ivz_empid');
            ins.properties.ivz_territory = new MobileCRM.Reference('territory', Data.territoryadjust);
            ins.properties.statuscode = parseInt(917970000);
            ins.properties.ivz_customernumber = new MobileCRM.Reference('account', $stateParams.accountid);
            ins.save(function (er) {
                if (er) {
                    alert("ADJUSTMENT4888:" + er);
                } else {
                    callback();
                }
            });
        }

        function setclear() {
            $scope.user.accountid = '';
            $scope.user.contype = '';
            $scope.user.txtcontactname = '';
            $scope.user.txtcontactlastname = '';
        }

        $scope.cAdjustment = function () {
            console.log('insert adjustment credit');
            $scope.showLoadingProperTimesRegAll();
            insertcontact(function () {
                setTimeout(function () {
                    $scope.sendmailtosup($cookies.get('territoryid'), 'ขออนุมัติเปลี่ยนแปลงข้อมูลผู้ติดต่อ', 'ร้าน' + $stateParams.cusname, function () {
                        $scope.showLoadingComplete('บันทึกข้อมูลเสร็จแล้ว');
                        $ionicLoading.hide();
                        setclear();
                        $ionicHistory.goBack(-1);
                    });
                }, 2000);
            });
        }
        $scope.cAdjustmentCancel = function () {
            console.log('back');
            setclear();
            $ionicHistory.goBack(-1);
        }
    })

//////////////////////////////////////////////////////////////////////////////////////
.controller('AdjustmentSupTerCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        Data.mastertype = $stateParams.mastertype;
        $scope.listmaster = [];
        gettername($cookies.get('name'), function (data) {
            if (data) {
                var x = 0;
                var loopArray = function (arr) {
                    getPush(x, function () {
                        x++;
                        if (x < arr.length) {
                            loopArray(arr);
                        } else {
                            $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                            setTimeout(function () {
                                $ionicLoading.hide();
                            }, 2000);
                        }
                    });
                }
                loopArray(data);

                function getPush(i, callback) {
                    $scope.showLoadingProperTimesRegter('โหลดข้อมูลเขตการขาย ' + data[i].description);
                    $scope.listmaster.push({
                        ivz_territorymasterid: data[i].ivz_territorymasterid,
                        ivz_mastername: data[i].ivz_mastername,
                        ivz_leftterritory: data[i].ivz_leftterritory,
                        ivz_emailcontact: data[i].ivz_emailcontact,
                        ivz_leadermail: data[i].ivz_leadermail,
                        ivz_ccmail: data[i].ivz_ccmail,
                        ivz_empid: data[i].ivz_empid,
                        ivz_empname: data[i].ivz_empname,
                        ivz_statusempid: data[i].ivz_statusempid,
                        description: data[i].description
                    });
                    setTimeout(function () {
                        callback();
                    }, 10);
                }
            }
            if($scope.$phase){$scope.$apply();}
        });
        $scope.goaccountlist = function (id) {
            //alert(id);
            $state.go('app.adjustmentlist', {
                terid: id,
                mastertype: Data.mastertype
            }, {
                reload: true
            });
        };
    })
    //////////////////////// End ////////////////////
    ////////////////////// Order ///////////////
    .controller('OrderListCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, $ionicSlideBoxDelegate) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        //Data.mastertype = $stateParams.mastertype;
        $scope.clickmodel = function () {
            console.log('click logout');
            $scope.showcomment();
        }
        $ionicModal.fromTemplateUrl('templates/comment/comment.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closereject = function () {
            $scope.modal.hide();
        };
        // Open the login modal
        $scope.showcomment = function () {
            $scope.modal.show();
        };
        $scope.gobb = function () {
            $ionicHistory.goBack(-1);
        }
    })
    .controller('OrderCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory ,Setting) {
        $state.reload();
        Data.showcart = false;
        $scope.Data = Data;
        $scope.listorderoption = Setting.orderoption;
        Data.mastertype = $stateParams.mastertype; //$stateParams.accountid
        $scope.gooporder = function (id) {
            var getguid = guid();
            GetAccountById($stateParams.accountid,Data.mastertype,function(data){
              Data.balancecredit = parseInt(data[0].ivz_balancecredit);
              $state.go('app.productlist', {
                  accountid: $stateParams.accountid,
                  mastertype: $stateParams.mastertype,
                  ordertype: id,
                  getguid: getguid
              }, {
                  reload: true
              });
            });
        }
    })
    .controller('ProductLisCtrl', function ($scope, Setting, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder) {
        $state.reload();
        $scope.Data = Data;
        $scope.filtertxt = '';
        $ionicHistory.clearHistory();
        $scope.listproduct = [];
        $scope.$on('$ionicView.enter', function () {
            console.log($stateParams.ordertype);
            if ($stateParams.ordertype == 1 || $stateParams.ordertype == 2) {
                Data.showcart = true;
            } else {
                Data.showcart = false;
            }
        });
        $scope.user = {
            id: '',
            adjustid: '',
            txtname: '',
            tername: '',
            filetername: '',
            remarkname: ''
        };
        $scope.chk = {
            remark: true
        };
        $scope.item = {
            adjustid: '',
            productid: '',
            productname: '',
            priceperunit: '',
            uomid: '',
            pricelevel: '',
            tatol: '',
            matchitem: '',
            tatolmatch: 0,
            itemname: '',
            itemnumber: ''
        };
        $scope.clearfilter = function () {
            console.log('clickkkk');
            $scope.filtertxt.length = 0;
        }
        $scope.minplus = 0;
        $scope.reload = function () {
            $scope.listproduct.length = 0;
            //set show product
            GetProductList(Setting.requestproduct, 1, function (data) {
                var x = 0;
                var loopArray = function (arr) {
                    getPush(x, function () {
                        x++;
                        if (x < arr.length) {
                            loopArray(arr);
                        } else {
                            $ionicLoading.hide();
                        }
                    });
                }
                loopArray(data);

                function getPush(i, callback) {
                    $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล ' + data[i].filtername);
                    $scope.listproduct.push({
                        productid: data[i].productid,
                        name: data[i].name,
                        productnumber: data[i].productnumber,
                        price: data[i].price,
                        uomid: data[i].uomid.id,
                        pricelevelid: data[i].pricelevelid.id,
                        createdon: data[i].createdon,
                        stockstatus: data[i].stockstatus,
                        defaultuomscheduleid: data[i].defaultuomscheduleid,
                        filtername: data[i].filtername
                    });
                    setTimeout(function () {
                        callback();
                    }, 1);
                }
                if($scope.$phase){$scope.$apply();}
            });
        }
        $scope.reload();
        $ionicModal.fromTemplateUrl('templates/comment/productdetail.html', {
            id: 1,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal1 = modal;
        });
        $ionicModal.fromTemplateUrl('templates/comment/searchitem.html', {
            id: 2,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal2 = modal;
        });
        // Triggered in the login modal to close it
        $scope.chktrueminus = false;
        $scope.closereject = function () {
            Data.tatolminplus = parseInt(Data.tatolminplus) - parseInt($scope.item.matchitem);
            //Data.tatolmatch =  parseInt(Data.tatolmatch) - parseInt($scope.item.tatol);
            $scope.modal1.hide();
        };
        $scope.open1 = function (productid, name, priceperunit, pricelevel, uomid) {
            var y = productid + '\n' + name + '\n' + priceperunit + '\n' + pricelevel + '\n' + uomid;
            //alert(y);
            $scope.item.productid = productid;
            $scope.item.productname = name;
            $scope.item.priceperunit = priceperunit;
            $scope.item.uomid = uomid;
            $scope.item.pricelevel = pricelevel;
            $scope.item.tatol = 0;
            $scope.item.matchitem = 0;
            $scope.modal1.show();
        };
        $scope.closesearch = function () {
            $scope.modal2.hide();
        }
        $scope.opensearch = function () {
            $scope.modal2.show();
        }
        var j = 0;
        $scope.addplus = function (id) {
            if ($scope.item.matchitem <= 0) {
                $scope.item.matchitem = 0 + parseInt(id);
            } else {
                $scope.item.matchitem = parseInt($scope.item.matchitem) + parseInt(id);
                //Data.tatolminplus = parseInt(Data.tatolminplus) + parseInt($scope.item.matchitem);
            }
            if (Data.tatolminplus <= 0) {
                $scope.item.tatol = parseInt($scope.item.priceperunit) * 1;
                Data.tatolminplus = 0 + 1;
            } else {
                $scope.item.tatol = parseInt($scope.item.priceperunit) * parseInt($scope.item.matchitem);
                Data.tatolminplus = parseInt(Data.tatolminplus) + 1;
            }
        };
        $scope.minus = function (id) {
            if ($scope.item.matchitem <= 0) {
                $scope.item.matchitem = 0;
                //$scope.item.tatol = parseInt($scope.item.priceperunit) * 0;
            } else {
                $scope.item.matchitem = parseInt($scope.item.matchitem) - parseInt(id);
            }
            if (Data.tatolminplus <= 0) {
                Data.tatolminplus = 0;
            } else {
                if ($scope.item.matchitem <= 0) {
                    Data.tatolminplus = parseInt(Data.tatolminplus);
                } else {
                    Data.tatolminplus = parseInt(Data.tatolminplus) - 1;
                }
            }
        };
        $scope.$watch('item.matchitem', function () {
            if ($scope.item.matchitem <= 0) {
                $scope.item.matchitem = 0;
                $scope.item.tatol = parseInt($scope.item.priceperunit) * 0;
                //Data.tatolmatch =
            } else {
                $scope.item.tatol = parseInt($scope.item.priceperunit) * parseInt($scope.item.matchitem);
            }
            console.log('$scope.item.matchitem :' + $scope.item.matchitem);
        });
        $scope.searclickitem = function (txtname, itemid) {
            $scope.clearfilter();
            if (txtname.length > 0) {
              $scope.listproduct.length = 0;
                //alert('txtname:'+txtname);
                GetProductListName(txtname, 10000, 1, function (data) {
                    if (data.length > 0) {
                        var x = 0;
                        var loopArray = function (arr) {
                            getPush(x, function () {
                                x++;
                                if (x < arr.length) {
                                    loopArray(arr);
                                } else {
                                    $scope.item.itemname = "";
                                    $ionicLoading.hide();
                                    $scope.modal2.hide();
                                }
                            });
                        }
                        loopArray(data);
                        function getPush(i, callback) {
                            $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล ' + data[i].filtername);
                            $scope.listproduct.push({
                                productid: data[i].productid,
                                name: data[i].name,
                                productnumber: data[i].productnumber,
                                price: data[i].price,
                                uomid: data[i].uomid,
                                pricelevelid: data[i].pricelevelid,
                                createdon: data[i].createdon,
                                stockstatus: data[i].stockstatus,
                                defaultuomscheduleid: data[i].defaultuomscheduleid,
                                filtername: data[i].filtername
                            });
                            setTimeout(function () {
                                callback();
                            }, 5);
                        }
                    }
                    if($scope.$phase){$scope.$apply();}
                });
            } else if (itemid.length > 0) {
                //alert('itemid:'+itemid);
                GetProductListNumber(itemid, 10000, 1, function (data) {
                    if (data) {
                        var x = 0;
                        var loopArray = function (arr) {
                            getPush(x, function () {
                                x++;
                                if (x < arr.length) {
                                    loopArray(arr);
                                } else {
                                  $scope.item.itemnumber = '';
                                    $ionicLoading.hide();
                                    $scope.modal2.hide();
                                }
                            });
                        }
                        loopArray(data);
                        function getPush(i, callback) {
                            $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล ' + data[i].filtername);
                            $scope.listproduct.push({
                                productid: data[i].productid,
                                name: data[i].name,
                                productnumber: data[i].productnumber,
                                price: data[i].price,
                                uomid: data[i].uomid,
                                pricelevelid: data[i].pricelevelid,
                                createdon: data[i].createdon,
                                stockstatus: data[i].stockstatus,
                                defaultuomscheduleid: data[i].defaultuomscheduleid,
                                filtername: data[i].filtername
                            });
                            setTimeout(function () {
                                callback();
                            }, 5);
                        }
                    }
                    if($scope.$phase){$scope.$apply();}
                });
            } else {
                $scope.item.itemname = '';
                $scope.item.itemnumber = '';
                $scope.reload();
                $scope.modal2.hide();
                //console.log('all:'+txtname +'&&' +itemid);
            }
        }
        $scope.itemcart = [];
        $scope.additem = function () {
          if($scope.item.matchitem === 0 || $scope.item.matchitem === '0'){
            alert('กรุณาระบุจำนวนที่ต้องการด้วย');
          }else{
                var minu = 0;
                      if (DataOrder.order.length > 0) {
                          for (var i in DataOrder.order) {
                              if (DataOrder.order[i].productid == $scope.item.productid) {
                                  console.log('break ' + i);
                                  minu = parseInt(DataOrder.order[i].tatol) + parseInt($scope.item.tatol);
                                  DataOrder.order[i].tatol = parseInt(DataOrder.order[i].tatol) + parseInt($scope.item.tatol);
                                  DataOrder.order[i].quality = parseInt(DataOrder.order[i].quality) + parseInt($scope.item.matchitem);
                                  break;
                              }
                          }
                          if (!minu) {
                              DataOrder.order.push({
                                  getguid: $stateParams.getguid,
                                  accountid: $stateParams.accountid,
                                  ordertype: $stateParams.ordertype,
                                  productid: $scope.item.productid,
                                  productname: $scope.item.productname,
                                  priceperunit: $scope.item.priceperunit,
                                  pricelevelid: $scope.item.pricelevel,
                                  uomid: $scope.item.uomid,
                                  tatol: $scope.item.tatol,
                                  quality: $scope.item.matchitem
                              });
                          }
                      } else {
                          DataOrder.order.push({
                              getguid: $stateParams.getguid,
                              accountid: $stateParams.accountid,
                              ordertype: $stateParams.ordertype,
                              productid: $scope.item.productid,
                              productname: $scope.item.productname,
                              priceperunit: $scope.item.priceperunit,
                              pricelevelid: $scope.item.pricelevel,
                              uomid: $scope.item.uomid,
                              tatol: $scope.item.tatol,
                              quality: $scope.item.matchitem
                          });
                      }
                      setTimeout(function () {
                          Data.tatolmatch = parseInt(Data.tatolmatch) + parseInt($scope.item.tatol);
                          $scope.modal1.hide();
                      }, 1000);
          }
        }
        $scope.confirm = function () {}
    })
    .controller('ListOrderCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder) {
        $state.reload();
        $scope.Data = Data;
        //Data.showcart = false;
        $scope.$on('$ionicView.enter',function(){
          //alert($stateParams.terid);
          //alert('loading list order');
          Data.showcart = false;
        });
        $scope.user = {
          accountid:'',
          name:'',
          territoryname:'',
          terid:'',
          currency:'',
          creditlimit:'',
          district:'',
          provinceid:'',
          shippingmethodcode:'',
          paymenttermscode:'',
          remark:'',
          statustypecode:''
        }
        $scope.item = {
          productid:'',
          productname:'',
          priceperunit:'',
          tatol:'',
          matchitem:''
        };
        $scope.loading = function () {
            $scope.listorderdetail = [];
            var dataorder = DataOrder.order;
            var x = 0;
            var loopArray = function (arr) {
                getPush(x, function () {
                    x++;
                    if (x < arr.length) {
                        loopArray(arr);
                    } else {
                        $ionicLoading.hide();
                    }
                });
            }
            loopArray(dataorder);
            function getPush(i, callback) {
                $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล ' + dataorder[i].productname);
                $scope.listorderdetail.push({
                    getguid:dataorder[i].getguid,
                    accountid:dataorder[i].accountid,
                    ordertype:dataorder[i].ordertype,
                    productid:dataorder[i].productid,
                    productname:dataorder[i].productname,
                    priceperunit:dataorder[i].priceperunit,
                    pricelevelid:dataorder[i].pricelevelid,
                    uomid:dataorder[i].uomid,
                    tatol:dataorder[i].tatol,
                    quality:dataorder[i].quality
                });
                setTimeout(function () {
                    callback();
                }, 5);
            }
        }

        $scope.$on('$ionicView.enter', function () {
            $scope.loading();
        });
        $scope.ordedetail = function () {
            $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
            setTimeout(function () {
                $ionicLoading.hide();
            }, 3000);
        }
        $scope.opendetail = function(id,name,price,tatol,quality){
          console.log(id+'\n'+name+'\n'+price+'\n'+tatol+'\n'+quality);
          $scope.item.productid = id;
          $scope.item.productname = name;
          $scope.item.priceperunit = price;
          $scope.item.tatol = tatol;
          $scope.item.matchitem = quality;
          $scope.showmodal(2);
        }

        /*------------- add product quality ---------------*/
        $scope.addpluss = function (data) {
            var m = 0;
            for (var i in $scope.listorderdetail) {
                m += parseInt($scope.listorderdetail[i].quality) * parseInt($scope.listorderdetail[i].priceperunit);
            }
            return m;
        }
        $scope.addtatol = function(){
          var m = 0;
          for (var i in $scope.listorderdetail) {
              m += parseInt($scope.listorderdetail[i].quality) + 0;
          }
          return m;
        }
        $scope.removeitem = function(id){
          DataOrder.order.splice(id,1);
          $scope.listorderdetail.splice(id,1);
        }
        $scope.addplus = function (id) {
            if ($scope.item.matchitem <= 0) {
                $scope.item.matchitem = 0 + parseInt(id);
            } else {
                $scope.item.matchitem = parseInt($scope.item.matchitem) + parseInt(id);
                //Data.tatolminplus = parseInt(Data.tatolminplus) + parseInt($scope.item.matchitem);
            }
            if (Data.tatolminplus <= 0) {
                $scope.item.tatol = parseInt($scope.item.priceperunit) * 1;
                //Data.tatolminplus = 0 + 1;
            } else {
                $scope.item.tatol = parseInt($scope.item.priceperunit) * parseInt($scope.item.matchitem);
                //Data.tatolminplus = parseInt(Data.tatolminplus) + 1;
            }
        };
        $scope.minus = function (id) {
            if ($scope.item.matchitem <= 0) {
                $scope.item.matchitem = 0;
                //$scope.item.tatol = parseInt($scope.item.priceperunit) * 0;
            } else {
                $scope.item.matchitem = parseInt($scope.item.matchitem) - parseInt(id);
            }
        };
        $scope.$watch('item.matchitem', function () {
            if ($scope.item.matchitem <= 0) {
                $scope.item.matchitem = 0;
                $scope.item.tatol = parseInt($scope.item.priceperunit) * 0;
                //Data.tatolmatch =
            } else {
                $scope.item.tatol = parseInt($scope.item.priceperunit) * parseInt($scope.item.matchitem);
            }
            console.log('$scope.item.matchitem :' + $scope.item.matchitem);
        });
        $scope.additem = function () {
            if (DataOrder.order.length > 0) {
                for (var i in DataOrder.order) {
                    if (DataOrder.order[i].productid == $scope.item.productid) {
                        console.log('break ' + i);
                        DataOrder.order[i].tatol = parseInt($scope.item.tatol);
                        DataOrder.order[i].quality = parseInt($scope.item.matchitem);
                        break;
                    }
                }
            }
            setTimeout(function () {
                Data.tatolmatch = parseInt(Data.tatolmatch) + parseInt($scope.item.tatol);
                $scope.loading();
                $scope.modal2.hide();
            }, 1000);
        }
        /*--------------- end -----------------*/
        $ionicModal.fromTemplateUrl('templates/comment/customerremark.html', {
            id: 1,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal1 = modal;
        });
        $ionicModal.fromTemplateUrl('templates/comment/orderdetail.html', {
            id: 2,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal2 = modal;
        });
        $scope.showmodal = function (id) {
            $scope.idmodal = id;
            if (id == 1) {
              console.log('loop accountiid get name territory');
              $scope.modal1.show();
            }else if(id == 2){
              $scope.modal2.show();
            }
        }
        $scope.$watch('idmodal',function(){
          GetAccountById($scope.listorderdetail[0].accountid,Data.mastertype,function(data){
            $scope.user.accountid = data[0].accountid;
            $scope.user.name = data[0].name;
            $scope.user.territoryname = data[0].territoryid;
            $scope.user.terid = data[0].territoryid.id;
            $scope.user.currency =  data[0].currencyid.id;
            $scope.user.creditlimit = data[0].ivz_balancecredit;
            $scope.user.district = data[0].ivz_addressdistrict.id;
            $scope.user.provinceid = data[0].ivz_addressprovince.id;
            $scope.user.shippingmethodcode = data[0].shippingmethodcode;
            $scope.user.paymenttermscode = data[0].paymenttermscode;
            $scope.user.remark = '';
            $scope.user.statustypecode = parseInt(data[0].statustypecode);
            if($scope.$phase){$scope.$apply();}
          });
        });
        $scope.closemodal = function (id) {
            if (id == 1) {
                $scope.user.accountid = '';
                $scope.user.name = '';
                $scope.user.territoryname = '';
                $scope.user.terid = '';
                $scope.user.currency = '';
                $scope.user.creditlimit = '';
                $scope.user.district = '';
                $scope.user.provinceid = '';
                $scope.user.shippingmethodcode = '';
                $scope.user.paymenttermscode = '';
                $scope.user.remark = '';
                $scope.modal1.hide();
              }else if(id == 2){
                $scope.modal2.hide();
              }
        }
        $scope.closereject = function(){
          $scope.modal2.hide();
        }
        function insertorder(id,callback){
            $scope.showLoadingProperTimesRegter('กำลังบันทึกข้อมูลออร์เดอร์ร้าน '+'$scope.user.name');
            try {
              //alert('pricreid:'+$scope.listorderdetail[0].pricelevelid+'\n'+$scope.listorderdetail[0].getguid+'\n'+$scope.listorderdetail[0].ordertype);
              var ins = new MobileCRM.DynamicEntity.createNew('salesorder');
                  ins.properties.salesorderid = id;
                  ins.properties.customerid = new MobileCRM.Reference('account',$scope.user.accountid);
                  ins.properties.name = $scope.user.name;
                  ins.properties.transactioncurrencyid = new MobileCRM.Reference('transactioncurrency',$scope.user.currency);
                  ins.properties.requestdeliveryby = new Date();
    							ins.properties.pricelevelid = new MobileCRM.Reference('pricelevel',Data.pricelevel);
                  ins.properties.shippingmethodcode = parseInt($scope.user.shippingmethodcode);
                  ins.properties.paymenttermscode = parseInt($scope.user.paymenttermscode);
                  ins.properties.ivz_province = new MobileCRM.Reference('ivz_addressprovince',$scope.user.provinceid);
                  ins.properties.ivz_district =  new MobileCRM.Reference('ivz_addressdistrict',$scope.user.district);
                  ins.properties.ivz_territory = new MobileCRM.Reference('territory',$scope.user.terid);
                  ins.properties.ivz_balancecredit = $scope.user.creditlimit;
                  ins.properties.totalamount = parseInt($scope.addpluss());
                  ins.properties.ivz_empid = $cookies.get('ivz_empid');
                  ins.properties.statuscode = parseInt(2);
    							ins.properties.ivz_statussales = parseInt($scope.listorderdetail[0].ordertype);
    							ins.properties.description = $scope.user.remark;
                  ins.save(function(er){
                    if(er){
                      alert('error 8576 '+er);
                    }else{
                      //alert('insert order complete');
                      callback(id);
                    }
                  });
            } catch (e) {
              alert('insert order 6080 '+e);
            }
          }
        var insertorderdetail = function(id){
            var x = 0;
            var loopArray = function(arr){
              console.log('Detail x:'+x);
              getPush(x,function(){
                x++;
                if(x < arr.length){
                  loopArray(arr);
                }else{
                  $ionicLoading.hide();
                  Data.tatolmatch = 0;
                  Data.tatolminplus = 0;
                  Data.balancecredit = 0;
                  DataOrder.order.length = 0;
                  //$scope.modal1.hide();
                  $ionicHistory.nextViewOptions({
                      disableBack: true
                  });
                  setTimeout(function(){
                    var expression = $scope.listorderdetail[0].ordertype;//get ordertype
                    switch (expression) {
                      case '1':
                      case 1:
                          //alert('default order');
                        break;
                      case '2':
                      case 2:
                          $scope.sendmailtosup($scope.user.terid,'เปิดใบสั่งขาย(สนับสนุนขาย)','เปิดใบสั่งขาย(สนับสนุนขาย) ร้าน'+$scope.user.name,function(){
                            //alert('special order sendmail');
                          });
                        break;
                      default:
                    }
                    $state.go('app.orderlistpending', {
                        terid: Data.termas,//$cookies.get('territoryid'),//if direct sale can change get value by Data factory
                        mastertype: Data.mastertype,
                        ordertype: $scope.listorderdetail[0].ordertype
                    }, {
                        reload: true
                    });
                  },100);
                }
              });
            }
          loopArray($scope.listorderdetail);
          function getPush(i,callback){
            $scope.showLoadingProperTimesRegter('กำลังทำการบันทึกข้อมูล '+$scope.listorderdetail[i].productname);
            if($scope.listorderdetail[i].uomid.id){
              //alert('insert order detail '+i +'::'+ $scope.listorderdetail[i].uomid.id);
              var ins = new MobileCRM.DynamicEntity.createNew('salesorderdetail');
                  ins.properties.salesorderid = new MobileCRM.Reference('salesorder',id);
                  ins.properties.productid = new MobileCRM.Reference('product',$scope.listorderdetail[i].productid);
                  ins.properties.ispriceoverridden = parseInt(0);
                  ins.properties.priceperunit = $scope.listorderdetail[i].priceperunit;
                  ins.properties.uomid = new MobileCRM.Reference('uom',$scope.listorderdetail[i].uomid.id);
                  ins.properties.quantity = $scope.listorderdetail[i].quality;
                  ins.save(function(er){
                    if(er){
                        alert(er);
                      }else{
                        setTimeout(function(){
                          callback();
                        },1000);
                      }
                    });
            }else{
              //alert('insert order detail '+i +'::'+ $scope.listorderdetail[i].uomid);
              var ins = new MobileCRM.DynamicEntity.createNew('salesorderdetail');
                  ins.properties.salesorderid = new MobileCRM.Reference('salesorder',id);
                  ins.properties.productid = new MobileCRM.Reference('product',$scope.listorderdetail[i].productid);
                  ins.properties.ispriceoverridden = parseInt(0);
                  ins.properties.priceperunit = $scope.listorderdetail[i].priceperunit;
                  ins.properties.uomid = new MobileCRM.Reference('uom',$scope.listorderdetail[i].uomid);
                  ins.properties.quantity = $scope.listorderdetail[i].quality;
                  ins.save(function(er){
                    if(er){
                        alert(er);
                      }else{
                        setTimeout(function(){
                          callback();
                        },1000);
                      }
                    });
            }
          }
        }
        $scope.confirmordersales = function () {
          //alert('click');
          if($scope.listorderdetail[0].ordertype === 1 || $scope.listorderdetail[0].ordertype === '1'){
            //alert($scope.listorderdetail[0].ordertyp);
              var tatol = $scope.addpluss();
              if(parseInt(tatol) > 2999){
                if($scope.user.paymenttermscode === 100000011|| $scope.user.paymenttermscode === '100000011') {
                        $scope.modal1.hide();
                        insertorder(guid(),insertorderdetail);
                }else{
                  if(parseInt($scope.user.statustypecode) === 1){
                    $scope.modal1.hide();
                    insertorder(guid(),insertorderdetail);
                  }else{
                    if(parseInt($scope.user.creditlimit) >= parseInt(tatol)){
                        $scope.modal1.hide();
                        insertorder(guid(),insertorderdetail);
                    }else{
                        alert('วงเงินเครดิตของลูกค้าไม่พอกรุณาเพิ่มวงเงินเครดิตของลูกค้าด้วย');
                      }
                  }
                }
              }else{
                alert('ยอดรวมสั่งซื้อยังน้อยกว่า 3,000');
              }
          }else{
            $scope.modal1.hide();
            insertorder(guid(),insertorderdetail);
          }
        }
    })
    .controller('ListOrderPendingCtrl', function ($scope, $stateParams,Setting, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder) {
        $state.reload();
        $scope.Data = Data;
        $ionicHistory.clearHistory();
        $scope.group = {
                filter: ''
            }
        $scope.user = {
          filtername:''
        }
        $scope.$on('$ionicView.enter',function(){
          Data.showcart = false;
          $scope.loaddata();
        });
        $scope.loaddata = function(){
          GetOrder($stateParams.terid,Setting.setValorder,1,function(data){
            if(data.length > 0){
              $scope.listorder = [];
              var x = 0;
              var loopArray = function(arr){
                getPush(x,function(){
                  x++;
                  if(x < arr.length){
                    loopArray(arr);
                  }else{
                    $ionicLoading.hide();
                  }
                });
              }
              loopArray(data);
              function getPush(i,callback){
                $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล '+data[i].name);
                $scope.listorder.push({
    							salesorderid:data[i].salesorderid,
    							customerid:data[i].customerid,
    							name:data[i].name,
    							transactioncurrencyid:data[i].transactioncurrencyid,
    							requestdeliveryby:data[i].requestdeliveryby,
    							pricelevelid:data[i].pricelevelid,
    							shippingmethodcode:data[i].shippingmethodcode,
    							paymenttermscode:data[i].paymenttermscode,
    							ivz_province:data[i].ivz_province,
    							ivz_district:data[i].ivz_district,
    							ivz_territory:data[i].ivz_territory,
    							ivz_balancecredit:data[i].ivz_balancecredit,
    							totalamount:data[i].totalamount,
    							ivz_empid:data[i].ivz_empid,
    							statuscode:data[i].statuscode,
    							ivz_statussales:data[i].ivz_statussales,
    							description:data[i].description,
                  ivz_ordernumber:data[i].ivz_ordernumber,
                  ordernumber:data[i].ordernumber
    						});
                setTimeout(function(){
                  callback();
                },0);
              }
            }
            if($scope.$phase){$scope.$apply();}
          });
        }
            //Data.showcart = false;
        $scope.ordedetail = function () {
            $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
            setTimeout(function () {
                $ionicLoading.hide();
            }, 3000);
        }
        $scope.$watch('group.filter',function(){
          $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
          setTimeout(function () {
              $ionicLoading.hide();
          }, 3000);
        });
        $ionicModal.fromTemplateUrl('templates/comment/selectfilter.html', {
            id: 1,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal1 = modal;
        });
        $scope.showmodal = function (id) {
            if (id == 1) {
                $scope.modal1.show();
            }
        }
        $scope.closemodal = function (id) {
            if (id == 1) {
                $scope.modal1.hide();
            }
        }
        $scope.showdetailorder = function (id,name,terid,salestype,typehide) {
          //alert(id);
            $state.go('app.orderlistother', {
                orderid: id,
                mastertype: Data.mastertype,
                ordertype:$stateParams.ordertype,
                accountname:name,
                terid:terid,
                salestype:salestype,
                typehide:typehide
            }, {
                reload: true
            });
        }

    })
    .controller('ListOrderOtherCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder) {
        $state.reload();
        $scope.Data = Data;
        //alert($stateParams.typehide);
        $scope.item = {
           productid:'',
           productname:'',
           priceperunit:'',
           tatol:'',
           matchitem:'',
           typehide:$stateParams.typehide
        }
        $scope.salestype = true;
        $scope.$on('$ionicView.enter',function(){
          Data.showcart = false;
          $scope.ordedetail();
          if($stateParams.salestype == 1 || $stateParams.salestype == '1'){
            $scope.salestype = true;
          }else{
            $scope.salestype = false;
          }
        });
        $scope.loadData = function(){
          $scope.listorderdetail = [];
          var a = new MobileCRM.FetchXml.Entity('salesorderdetail');
        		a.addAttribute('salesorderdetailid');//0
        		a.addAttribute('salesorderid');//1
        		a.addAttribute('productid');//2
        		a.addAttribute('priceperunit');//3
        		a.addAttribute('uomid');//4
        		a.addAttribute('quantity');//5
        	var l = a.addLink('product','productid','productid','outer');
        		l.addAttribute('price');//6
            l.addAttribute('productnumber');//7
        	var filter = new MobileCRM.FetchXml.Filter();
        		filter.where('salesorderid','eq',$stateParams.orderid.trim());
        		a.filter = filter;
        	var fetch = new MobileCRM.FetchXml.Fetch(a);
        		fetch.execute('array',function(data){
                if(data){
                    for(var i in data){
                      $scope.listorderdetail.push({
                        salesorderdetail:data[i][0],
                        salesorderid:data[i][1],
                        productid:data[i][2].id,
                        productname:data[i][2].primaryName,
                        priceperunit:data[i][3],
                        uomid:data[i][4].id,
                        quality:data[i][5],
                        price:data[i][6],
                        productnumber:data[i][7],
                        tatol:parseInt(data[i][3]) * parseInt(data[i][5])
                      });
                    }
                  }
                  if($scope.$phase){$scope.$apply();}
        		},function(er){
              alert("ERROR 9560:"+er);
            },null);
        }

        $scope.plusquery = function(price,tatol){
          return parseInt(price) * parseInt(tatol);
        }

        $scope.ordedetail = function () {
            $scope.showLoadingProperTimesRegter('กำลังโหลดข้อมูล');
            $scope.loadData();
            setTimeout(function () {
                $ionicLoading.hide();
            }, 3000);
        }
        $scope.showmodal = function (id) {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $ionicHistory.goBack(-1);
        }

        $ionicModal.fromTemplateUrl('templates/comment/orderdetail.html', {
            id: 2,
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal2 = modal;
        });
        $scope.showmodal = function (id) {
            $scope.idmodal = id;
            if (id == 1) {
              console.log('loop accountiid get name territory');
              $scope.modal1.show();
            }else if(id == 2){
              $scope.modal2.show();
            }
        }
        $scope.closereject = function(){
          $scope.modal2.hide();
        }
        $scope.opendetail = function(id,name,price,tatol,quality){
          console.log(id+'\n'+name+'\n'+price+'\n'+tatol+'\n'+quality);
          $scope.item.productid = id;
          $scope.item.productname = name;
          $scope.item.priceperunit = price;
          $scope.item.tatol = tatol;
          $scope.item.matchitem = quality;
          $scope.showmodal(2);
        }

        /*------------- add product quality ---------------*/
        $scope.addpluss = function (data) {
            var m = 0;
            for (var i in $scope.listorderdetail) {
                m += parseInt($scope.listorderdetail[i].quality) * parseInt($scope.listorderdetail[i].priceperunit);
            }
            return m;
        }
        $scope.removeitem = function(id){
          $scope.showLoadingProperTimesRegterComplete();
          MobileCRM.DynamicEntity.deleteById("salesorderdetail",id,
          function () {
              $scope.loadData();
              setTimeout(function(){
                $ionicLoading.hide();
              },2000);
          },function (er) {
                            MobileCRM.bridge.alert("An error occurred: " + er);
                          });
        }
        $scope.addplus = function (id) {
            if ($scope.item.matchitem <= 0) {
                $scope.item.matchitem = 0 + parseInt(id);
            } else {
                $scope.item.matchitem = parseInt($scope.item.matchitem) + parseInt(id);
            }
        };
        $scope.minus = function (id) {
            if ($scope.item.matchitem <= 0) {
                $scope.item.matchitem = 0;
                //$scope.item.tatol = parseInt($scope.item.priceperunit) * 0;
            } else {
                $scope.item.matchitem = parseInt($scope.item.matchitem) - parseInt(id);
            }
        };
        $scope.$watch('item.matchitem', function () {
            if ($scope.item.matchitem <= 0) {
                $scope.item.matchitem = 0;
                $scope.item.tatol = parseInt($scope.item.priceperunit) * 0;
            } else {
                $scope.item.tatol = parseInt($scope.item.priceperunit) * parseInt($scope.item.matchitem);
            }
            console.log('$scope.item.matchitem :' + $scope.item.matchitem);
        });
        $scope.additem = function () {
            if ($scope.listorderdetail.length > 0) {
                for (var i in $scope.listorderdetail) {
                    if ($scope.listorderdetail[i].productid == $scope.item.productid) {
                        console.log('break ' + i);
                        $scope.listorderdetail[i].tatol = parseInt($scope.item.tatol);
                        $scope.listorderdetail[i].quality = parseInt($scope.item.matchitem);
                        break;
                    }
                }
            }
            setTimeout(function () {
                $scope.closereject();
            }, 1000);
        }
        $scope.$watch('listorderdetail',function(){
          $scope.loading();
        });
        function setApproveOrder(){
          var ups = new MobileCRM.DynamicEntity('salesorder',$stateParams.orderid.trim());
              ups.properties.statuscode = parseInt(917970000);
              ups.save(function(er){
                if(er){
                  alert('error 6436 '+er);
                }else{
                  //call function insert deatil
                  //alert('approved done');
                  try {
                    $ionicLoading.hide();
                    setTimeout(function(){
                      switch ($scope.salestype) {
                        case true:
                          $ionicHistory.goBack(-1);
                          break;
                        case false:
                          $scope.sendmailtosup($stateParams.terid.trim(),'เปิดใบสั่งขาย(สนับสนุนขาย)','ร้าน'+$stateParams.accountname,function(){
                            //alert('special order sendmail');
                            $ionicHistory.goBack(-1);
                          });
                          break;
                      }
                    },10);
                    //deleteorderdetail();
                  } catch (e) {
                    alert('error 6445 '+e);
                  }
                }
              });
        }

        function deleteorderdetail(){
          $scope.showLoadingProperTimesRegter('กำลังทำแก้ไขข้อมูล');
          console.log('delete orderdetail');
          //call function insert orderdetail
          var x = 0;
          var loopArray = function(arr){
            getDelete(x,function(){
              x++;
              if(x < arr.length){
                loopArray(arr);
              }else{
                //alert('delete done');
                orderdetailproduct();
              }
            });
          }
          loopArray($scope.listorderdetail);
          function getDelete(i,callback){
              try {
                MobileCRM.DynamicEntity.deleteById("salesorderdetail",$scope.listorderdetail[i].salesorderdetail,
                function () {

                },function (er) {
                                  MobileCRM.bridge.alert("An error occurred: " + er);
                              	});
              } catch (e) {
                alert('error 6479 '+er);
              } finally {
                setTimeout(function(){
                  callback();
                },10);
              }
          }
        }

        function orderdetailproduct(){
          //loop approve
          var x = 0;
          var loopArray = function(arr){
            inSertDetail(x,function(){
              x++;
              if(x < arr.length){
                loopArray(arr);
              }else{
                //alert('insert detail done ');
                $ionicLoading.hide();
                setTimeout(function(){
                  switch ($scope.salestype) {
                    case true:
                      $ionicHistory.goBack(-1);
                      break;
                    case false:
                      $scope.sendmailtosup($stateParams.terid.trim(),'เปิดใบสั่งขาย(สนับสนุนขาย)','ร้าน'+$stateParams.accountname,function(){
                        //alert('special order sendmail');
                        $ionicHistory.goBack(-1);
                      });
                      break;
                  }
                },10);
              }
            });
          }
          loopArray($scope.listorderdetail);
          function inSertDetail(i,callback){
            $scope.showLoadingProperTimesRegter('กำลังทำการบันทึกข้อมูล '+$scope.listorderdetail[i].productname);
            var ins = new MobileCRM.DynamicEntity.createNew('salesorderdetail');
                ins.properties.salesorderid = new MobileCRM.Reference('salesorder',$stateParams.orderid.trim());
                ins.properties.productid = new MobileCRM.Reference('product',$scope.listorderdetail[i].productid);
                ins.properties.ispriceoverridden = parseInt(0);
                ins.properties.priceperunit = $scope.listorderdetail[i].priceperunit;
                ins.properties.uomid = new MobileCRM.Reference('uom',$scope.listorderdetail[i].uomid);
                ins.properties.quantity = $scope.listorderdetail[i].quality;
                ins.save(function(er){
                  if(er){
                    alert(er);
                  }else{
                    setTimeout(function(){
                      callback();
                    },1000);
                  }
              });
          }
        }
        $scope.confirmorder = function(){
          switch ($scope.salestype) {
            case true:
                ///alert('default order');
                setApproveOrder();
              break;
            case false:
                //alert('sales order support');
                deleteorderdetail();
              break;
          }
        }
      //});
        function detids(id,callback){
          try {
                var ups = new MobileCRM.DynamicEntity('salesorder',$stateParams.orderid.trim());
                    ups.properties.statuscode = parseInt(917970001);
                    ups.save(function(er){
                      if(er){
                        alert('error 9779 '+er);
                      }else{
                        callback();
                      }
                    });
          } catch (e) {
            alert('error 9780 '+e);
          }
        }
        var dedetail = function(id){
            $scope.showLoadingProperTimesRegter('กำลังทำแก้ไขข้อมูล');
            console.log('delete orderdetail');
            //call function insert orderdetail
            var x = 0;
            var loopArray = function(arr){
              getDelete(x,function(){
                x++;
                if(x < arr.length){
                  loopArray(arr);
                }else{
                  $scope.reback();
                }
              });
            }
            loopArray($scope.listorderdetail);
            function getDelete(i,callback){
                try {
                  MobileCRM.DynamicEntity.deleteById("salesorderdetail",$scope.listorderdetail[i].salesorderdetail,
                  function () {

                  },function (er) {
                                    MobileCRM.bridge.alert("An error occurred: " + er);
                                	});
                } catch (e) {
                  alert('error 6479 '+er);
                } finally {
                  setTimeout(function(){
                    callback();
                  },10);
                }
            }
        }
        $scope.delorder = function(){
          var x = confirm('ยืนยันการลบรายการใบสั่งซื้อ');
          if(x == true){
            detids($stateParams.orderid,dedetail);
          }
        }
        /*--------------- end -----------------*/
    })
    /*------------------------------- end order ------------------------------*/
/*-------------- approve billing -------------------*/
.controller('ListWaitApproveBillingAccountCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
  $state.reload();
  $scope.loaddataterritory = function(){
    $scope.listmaster = [];
    gettername($cookies.get('name'), function (data) {
        if (data) {
            var x = 0;
            var loopArray = function (arr) {
                getPush(x, function () {
                    x++;
                    if (x < arr.length) {
                        loopArray(arr);
                    } else {
                        $scope.showLoadingComplete('โหลดข้อมูลเสร็จแล้ว');
                        setTimeout(function () {
                            $ionicLoading.hide();
                        }, 2000);
                    }
                });
            }
            loopArray(data);

            function getPush(i, callback) {
                $scope.showLoadingProperTimesRegter('โหลดข้อมูลเขตการขาย ' + data[i].description);
                $scope.listmaster.push({
                    ivz_territorymasterid: data[i].ivz_territorymasterid,
                    ivz_mastername: data[i].ivz_mastername,
                    ivz_leftterritory: data[i].ivz_leftterritory,
                    ivz_emailcontact: data[i].ivz_emailcontact,
                    ivz_leadermail: data[i].ivz_leadermail,
                    ivz_ccmail: data[i].ivz_ccmail,
                    ivz_empid: data[i].ivz_empid,
                    ivz_empname: data[i].ivz_empname,
                    ivz_statusempid: data[i].ivz_statusempid,
                    description: data[i].description
                });
                setTimeout(function () {
                    callback();
                }, 5);
            }
        }
        if($scope.$phase){$scope.$apply();}
    });
  }
  var loaddefualt = function(){
    if(!$scope.listmaster){
        $scope.showLoading('กำลังโหลดข้อมูล');
        $scope.loaddataterritory();
    }
  }
  $scope.$on('$ionicView.enter',function(){
    loaddefualt();
  });
  $scope.gotosection = function(id){
    try {
      $state.go('app.approvebillingcollection',{terid:id},{reload:true});
    } catch (e) {
      alert(e);
    }
  }
})
.controller('ListApproveBillingAccountCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
  $state.reload();
  var loaddata = function(){
      $scope.listresultplanning = [];
      GetResultAppointment($stateParams.terid,1,function(data){
        if(data){
          var x = 0;
          var loopArray = function(arr){
            getPush(x,function(){
              x++;
              if(x < arr.length){
                loopArray(arr);
              }else{
                $ionicLoading.hide();
              }
            });
          }
          loopArray(data);
          function getPush(i,callback){
            switch (data[i].ivz_statuscomplete) {
              case 1:
              case '1':
                      $scope.showLoading('กำลังโหลดข้อมูล ' + data[i].ivz_resultname);
                      $scope.listresultplanning.push({
                        ivz_resultappointid:data[i].ivz_resultappointid,
        								ivz_resultname:data[i].ivz_resultname,
        								ivz_visit:data[i].ivz_visit,
        								ivz_visitsuggest:data[i].ivz_visitsuggest,
        								ivz_productrecall:data[i].ivz_productrecall,
        								ivz_visitprospect:data[i].ivz_visitprospect,
        								ivz_visitorder:data[i].ivz_visitorder,
        								ivz_visitopenaccount:data[i].ivz_visitopenaccount,
        								ivz_visitmarket:data[i].ivz_visitmarket,
        								ivz_visitcompetitor:data[i].ivz_visitcompetitor,
        								ivz_visitcollecttion:data[i].ivz_visitcollecttion,
        								ivz_visitclaimorder:data[i].ivz_visitclaimorder,
        								ivz_visitbilling:data[i].ivz_visitbilling,
        								ivz_visitadjustment:data[i].ivz_visitadjustment,
        								ivz_visitactivities:data[i].ivz_visitactivities,
        								ivz_activitiestext:data[i].ivz_activitiestext,
        								ivz_territory:data[i].ivz_territory,
        								ivz_addressprovince:data[i].ivz_addressprovince,
        								ivz_addressdistrict:data[i].ivz_addressdistrict,
        								ivz_shedulestart:new Date(data[i].ivz_shedulestart),
        								ivz_sheduleend:new Date(data[i].ivz_sheduleend),
        								ivz_customer:data[i].ivz_customer,
        								ivz_salesprospect:data[i].ivz_salesprospect,
        								ivz_latitude:data[i].ivz_latitude,
        								ivz_longtitude:data[i].ivz_longtitude,
        								ivz_billingnumber:data[i].ivz_billingnumber,
        								ivz_billingamount:data[i].ivz_billingamount,
        								ivz_resultstatus:data[i].ivz_resultstatus,
        								ivz_statuscomplete:data[i].ivz_statuscomplete,
        								ivz_resultremark:data[i].ivz_resultremark
                      });
                      setTimeout(function(){
                        callback();
                      },10);
                break;
              default:
              callback();
            }
          }
        }
        if($scope.$phase){$scope.$apply();}
      });
  }
  $scope.$on('$ionicView.enter',function(){
    $scope.loaddata();
  });
  $scope.loaddata = function(){
    $scope.showLoading('กำลังโหลดข้อมูล');
    loaddata();
  }
})
.controller('ListApproveBillingAccountDetailCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
  $state.reload();
  //alert($stateParams.ivz_visitbilling);
  $scope.user = {
    resultid:$stateParams.resultid,
    accountid:$stateParams.accountid,
    txtname:$stateParams.txtname,
    territorid:$stateParams.territorid,
    txtterritory:$stateParams.txtterritory,
    txtcomment:$stateParams.txtcomment,
    txtremarcomment:$stateParams.txtremarcomment,
    txtbillingnumber:$stateParams.txtbillingnumber,
    txtamount:$stateParams.txtamount,
    ivz_visitbilling:$stateParams.ivz_visitbilling,
    ivz_visitsuggest:$stateParams.ivz_visitsuggest,
    ivz_visitprospect:$stateParams.ivz_visitprospect,
    ivz_visitorder:$stateParams.ivz_visitorder,
    ivz_visitopenaccount:$stateParams.ivz_visitopenaccount,
    ivz_visitadjustment:$stateParams.ivz_visitadjustment,
    ivz_visitmarket:$stateParams.ivz_visitmarket,
    ivz_visitcompetitor:$stateParams.ivz_visitcompetitor,
    ivz_visitclaimorder:$stateParams.ivz_visitclaimorder,
    ivz_visitactivities:$stateParams.ivz_visitactivities,
    ivz_productrecall:$stateParams.ivz_productrecall
  }
  $ionicModal.fromTemplateUrl('templates/comment/commentall.html', {
      id: 1,
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function (modal) {
      $scope.modal1 = modal;
  });
  $scope.reject = function(){
    $scope.modal1.show();
  }
  $scope.closeModal = function(id){
    $scope.modal1.hide();
  }
  var updateresult = function(status,txt,callback){
    try {
      var ins = new MobileCRM.DynamicEntity("ivz_resultappoint",$stateParams.resultid);
          ins.properties.ivz_statuscomplete = parseInt(status);
          ins.properties.ivz_resultremark = txt;
          ins.save(function(er){
            if(er){
              alert('update result error 8799 '+er);
            }else{
              callback();
            }
          });
    } catch (e) {
        alert('update result error 8789 '+e);
    }
  }
  $scope.confirmreject = function(resultid,txtcomment){
    if(txtcomment){
      $scope.modal1.hide();
      $scope.showLoading('กำลังบันทึกข้อมูล');
      updateresult(3,txtcomment,function(){
        setTimeout(function(){
          $scope.sendmailtosales($stateParams.territorid,'ไม่อนุมัติร้องขอไม่ทำกิจกรรม','ไม่อนุมัติร้องขอไม่ทำกิจกรรมได้เนื่องจาก'+txtcomment,function(){
            $ionicLoading.hide();
            $scope.reback();
          });
        },3000);
      });
    }else{
      alert('กรุณาระบบเหตุผลด้วย');
    }
  }
  $scope.confirmapprove = function(){
    $scope.showLoading('กำลังบันทึกข้อมูล');
    updateresult(2,null,function(){
      setTimeout(function(){
        $scope.sendmailtosales($stateParams.territorid,'อนุมัติร้องขอไม่ทำกิจกรรม','อนุมัติร้องขอไม่ทำกิจกรรมแล้ว',function(){
            $ionicLoading.hide();
            $scope.reback();
          },3000);
        });
    });
  }
  $scope.showpic = function(id){
    $state.go('app.detailpic',{tableresult:'ivz_resultappoint',idguid:id},{reload:true});
  }
})
.controller('ListDetailPicCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
  $state.reload();
  $scope.deatil = {
    documentbody:''
  }
  $scope.loadpic = function(){
    $scope.pushpic = [];
    getAnnote($stateParams.idguid.trim(), function (data) {
        if (data) {
            if (data.length > 0) {
                $scope.showLoadingProperTimesRegter('');
                var x = 0;
                var loopArray = function (arr) {
                    GetPush(x, function () {
                        x++;
                        if (x < arr.length) {
                            loopArray(arr);
                        } else {
                            $ionicLoading.hide();
                        }
                    });
                }
                loopArray(data);

                function GetPush(i, callback) {
                    $scope.showLoadingComplete('กำลังโหลดข้อมูล ' + data[i].subject);
                    //alert(data[i].documentbody);
                    MobileCRM.DynamicEntity.loadDocumentBody("annotation", data[i].annotationid.trim(), function (result) {
                        if (result) {
                            $scope.pushpic.push({
                                documentbody: "data:image/jpeg;base64," + result,
                                subject: data[i].subject
                            });
                        }
                    });
                    setTimeout(function () {
                        callback();
                    }, 60);
                };
            }
        } else {
            alert('ไม่พบข้อมูลเอกสารไฟล์แนบ');
        }
        if($scope.$phase){$scope.$apply();}
    });
  }
  $scope.$on('$ionicView.enter',function(){
    $scope.loadpic();
  });
  $ionicModal.fromTemplateUrl('templates/modal-1.html', {
      id: 1,
      scope: $scope,
      animation: 'slide-in-up'
  }).then(function (modal) {
      $scope.modal1 = modal;
  });

  $scope.showimg = function(doc){
    if(doc){
      $scope.imageSrc = doc;
      $scope.modal1.show();
    }
  }
  $scope.closeModal = function(id){
    $scope.modal1.hide();
  }
})
.controller('ListActivitiesCtrl', function ($scope, $compile,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
  $state.reload();
  $scope.user = {
    txtname:$cookies.get('ivz_empname'),
    txtterritory:$cookies.get('name'),
    txtcomment:'',
    filedoc01:[]
  };
  $scope.activitieslistload = function(){
    $scope.listActivities = [];
    GetActivities(function(data){
      //alert(data.length);
      var x = 0;
      var loopArray = function(arr){
        getPush(x,function(){
          x++;
          if(x < arr.length){
            loopArray(arr);
          }else{
            $ionicLoading.hide();
          }
        });
      }
      loopArray(data);
      function getPush(i,callback){
        $scope.showLoading('กำลังโหลดข้อมูล');
        $scope.listActivities.push({
          ivz_activitiesid:data[i].ivz_activitiesid,
          ivz_name:data[i].ivz_name,
          ivz_displaystatus:data[i].ivz_displaystatus,
          ivz_activitiesgroup:data[i].ivz_activitiesgroup,
          dateresult:new Date()
        });
        setTimeout(function(){
          callback();
        },10);
      };
      if($scope.$phase){$scope.$apply();}
    });
  }
  // $scope.callfile = function(elid){
  //   $('#'+elid).trigger('click');
  // }
  $scope.$on('$ionicView.enter',function(){
    if($scope.listActivities){
      if($scope.listActivities.length < 0){
        $scope.activitieslistload();
      }
    }else{
      $scope.activitieslistload();
    }
    /* img 01 */
    // $('#txtfile01').change(function(){
    //   GetAtt('#txtfile01', '', 'canvas01', function (data) {
    //     alert('tx change :'+$scope.user.filedoc01.length);
    //     console.log(data.length);
    //       $scope.user.filedoc01.push({docfile:data,title:'รูปก่อนทำกิจกรรม '});
    //       pushImg('img01');
    //   });
    // });
    // function pushImg(dClass){
    //   $('.divimg').remove();
    //   if($scope.user.filedoc01){
    //     for(var i in $scope.user.filedoc01){
    //       var html = '<div class="col col-20 divimg">' +
    //           '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc01[i].docfile + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
    //           '</div>';
    //       angular.element(document.getElementById(dClass)).append($compile(html)($scope));
    //     }
    //   }
    // }
    // $scope.removeimg = function(id){
    //   $scope.user.filedoc01.splice(id,1);
    //   pushImg('img01');
    // }
    /* end img */
  });
  $scope.activitieslist = [];
  var checkmatch = function(id){
    console.log('length:'+$scope.activitieslist.length);
    return $scope.activitieslist.indexOf(id);
  }
  $scope.clickadd = function(id){
    var chtatol = checkmatch(id);
    if(chtatol > 0){
      $scope.activitieslist.splice(chtatol,1);
      console.log('act delete :'+chtatol);
    }else{
      $scope.activitieslist.push(id);
      console.log('act add :'+chtatol);
    }
  }
  // $ionicModal.fromTemplateUrl('templates/modal-1.html', {
  //     id: 1,
  //     scope: $scope,
  //     animation: 'slide-in-up'
  // }).then(function (modal) {
  //     $scope.modal1 = modal;
  // });
  // $ionicModal.fromTemplateUrl('templates/modal-2.html', {
  //     id: 2,
  //     scope: $scope,
  //     animation: 'slide-in-up'
  // }).then(function (modal) {
  //     $scope.modal2 = modal;
  // });
  // $scope.oppup = function(id){
  //   switch (id) {
  //     case 1:
  //       $scope.modal1.show();
  //       break;
  //     case 2:
  //       $scope.modal2.show();
  //       break;
  //   }
  // }
  // $scope.closeModal = function(id){
  //   switch (id) {
  //     case 1:
  //       $scope.modal1.hide();
  //       break;
  //     case 2:
  //       $scope.modal2.hide();
  //       break;
  //   }
  // }

  $scope.cActivities = function(){
    //$scope.oppup(2);
    $state.go('app.plannedactivitiesdetail',{
      activitieslist:$scope.activitieslist,
      accountid: $stateParams.accountid,
      mastertype: Data.mastertype,
      retype:1,
      terid:Data.termas,
      accountname:$stateParams.accountname,
      province:$stateParams.province,
      distid:$stateParams.distid
    },{reload:true});
  }
  $scope.cNotDoActivities = function(){
    $state.go('app.plannedactivitiesnotdo',{
      activitieslist:$scope.activitieslist,
      accountid: $stateParams.accountid,
      mastertype: Data.mastertype,
      retype:1,
      terid:Data.termas,
      accountname:$stateParams.accountname,
      province:$stateParams.province,
      distid:$stateParams.distid
    },{reload:true});
  }
})
.controller('ListActivitiesDetailNotDoCtrl', function ($scope, $compile ,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
  $state.reload();
  $scope.user = {
    accountname:$stateParams.accountname,
    province:$stateParams.province,
    distid:$stateParams.distid,
    accountid:$stateParams.accountid,
    txtname:$cookies.get('ivz_empname'),
    txtterritory:$cookies.get('name'),
    activitieslist:$stateParams.activitieslist.toString(),
    txtcomment:'',
    filedoc01:[]
  };
  $scope.callfile = function(elid){
    $('#'+elid).trigger('click');
  }
  $scope.$on('$ionicView.enter',function(){
    /* img 01 */
    $('#txtfile01').change(function(){
      GetAtt('#txtfile01', '', 'canvas01', function (data) {
        //alert('tx change :'+$scope.user.filedoc01.length);
        console.log(data.length);
          $scope.user.filedoc01.push({docfile:data,title:'รูปไม่ทำกิจกรรม '});
          pushImg('img01');
      });
    });
    function pushImg(dClass){
      $('.divimg').remove();
      if($scope.user.filedoc01){
        for(var i in $scope.user.filedoc01){
          var html = '<div class="col col-20 divimg">' +
              '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc01[i].docfile + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
              '</div>';
          angular.element(document.getElementById(dClass)).append($compile(html)($scope));
        }
      }
    }
    $scope.removeimg = function(id){
      $scope.user.filedoc01.splice(id,1);
      pushImg('img01');
    }
    /* end img */
  });
  function insertresult(latitude,longitude,callback){
    try {
      $scope.showLoadingComplete('กำลังบันทึกข้อมูล');
      var g = guid();
      var ins = MobileCRM.DynamicEntity.createNew("ivz_resultappoint");
          ins.properties.ivz_resultappointid = g;
          ins.properties.ivz_resultname = $scope.user.accountname;
          ins.properties.ivz_customer = new MobileCRM.Reference('account',$stateParams.accountid);
          ins.properties.ivz_visit = parseInt(1);
          ins.properties.ivz_visitactivities = parseInt(1);
          ins.properties.ivz_activitiestext = $scope.user.activitieslist;
          ins.properties.ivz_latitude = latitude;
          ins.properties.ivz_longtitude = longitude;
          ins.properties.ivz_shedulestart = new Date();
          ins.properties.ivz_sheduleend = new Date();
          ins.properties.ivz_resultstatus = parseInt(1);
          ins.properties.ivz_resultremark = $scope.user.txtcomment;
          ins.properties.ivz_addressdistrict = new MobileCRM.Reference('ivz_addressdistrict',$scope.user.distid);
          ins.properties.ivz_addressprovince = new MobileCRM.Reference('ivz_addressprovince',$scope.user.province);
          ins.properties.ivz_territory = new MobileCRM.Reference('territory',Data.termas);
          ins.properties.ivz_empid = $cookies.get('ivz_empid');
          ins.properties.ivz_statuscomplete = parseInt(1);
          ins.save(function(er){
            if(er){
              alert(er);
            }else{
              setTimeout(function(){
                callback(g);
              },3000);
            }
          });
    } catch (e) {
      alert('error 1967 '+e);
    }
  }
  var instAnnote = function(id){
    var x = 0;
    var loopArray = function(arr){
      insAn(x,function(){
        x++;
        if(x < arr.length){
          loopArray(arr);
        }else{
          $scope.sendmailtosup(Data.termas, 'ไม่ทำกิจกรรมทางการตลาด', 'ร้าน'+$scope.user.accountname, function(){
            $ionicLoading.hide();
            $scope.reback();
          })
        }
      });
    }
    loopArray($scope.user.filedoc01);
    function insAn(i,callback){
      $scope.showLoading('กำลังบันทึกข้อมูลเอกสารไฟล์ '+$scope.user.filedoc01[i].title);
      $scope.InAnnoteAttract('ivz_resultappoint',id,$scope.user.filedoc01[i].docfile,$scope.user.filedoc01[i].title,3,function(){
        setTimeout(function(){
          callback();
        },100);
      });
    }
  }

  $scope.cConfirm = function(txtcomment){
    if(txtcomment){
      if($scope.user.filedoc01.length > 0){
        //alert('$scope.user.activitieslist :'+$scope.user.activitieslist);
        $scope.showLoading('กำลังโหลดข้อมูล GPS ');
          GetGPSLocation(function(res){
            var setv = setInterval(function(){
              if(res){
                insertresult(res.latitude,res.longitude,instAnnote);
                clearInterval(setv);
              }
            },100);
            if($scope.$phase){$scope.$apply();}
          });
      }else{
        alert('กรุณาแนบรูปภาพด้วย');
      }
    }else{
      alert('กรุณาระบบุเหตุผลที่ไม่ทำกิจกรรมด้วย');
    }
  }
})
.controller('ListActivitiesDetailCtrl', function ($scope, $compile ,$state, Dtest,$stateParams, $cookies, Data, rego, $ionicHistory, $ionicLoading,$ionicModal) {
  $state.reload();
  $scope.user = {
    accountname:$stateParams.accountname,
    province:$stateParams.province,
    distid:$stateParams.distid,
    accountid:$stateParams.accountid,
    txtname:$cookies.get('ivz_empname'),
    txtterritory:$cookies.get('name'),
    activitieslist:$stateParams.activitieslist.toString(),
    txtcomment:'',
    filedoc01:[],
    filedoc02:[],
    filematch:[]
  }
  function insertresult(callback){
    try {
      $scope.showLoadingComplete('กำลังบันทึกข้อมูล');
      var g = guid();
      var ins = MobileCRM.DynamicEntity.createNew("ivz_resultappoint");
          ins.properties.ivz_resultappointid = g;
          ins.properties.ivz_resultname = $scope.user.txtname;
          ins.properties.ivz_customer = new MobileCRM.Reference('account',$stateParams.accountid);
          ins.properties.ivz_visit = parseInt(1);
          ins.properties.ivz_visitactivities = parseInt(1);
          ins.properties.ivz_activitiestext = $scope.user.activitiestitle;
          ins.properties.ivz_latitude = $scope.user.latitude;
          ins.properties.ivz_longtitude = $scope.user.longitude;
          ins.properties.ivz_territory = new MobileCRM.Reference('territory',$scope.user.terrid);
          ins.properties.ivz_empid = $cookies.get('ivz_empid');
          ins.properties.ivz_statuscomplete = parseInt(1);
          ins.save(function(er){
            if(er){
              alert(er);
            }else{
              callback(g);
            }
          });
    } catch (e) {
      alert('error 1967 '+e);
    }
  }
  var insannote = function(id){
    $scope.InAnnoteAttract('table',id,base64String,title,3,null);
  }


  $scope.callfile = function(elid){
    $('#'+elid).trigger('click');
  }
  $scope.$on('$ionicView.enter',function(){
    /* img 01 */
    $('#txtfile01').change(function(){
      GetAtt('#txtfile01', '', 'canvas01', function (data) {
        console.log(data.length);
          $scope.user.filedoc01.push({docfile:data,title:'รูปก่อนทำกิจกรรม '});
          pushImg('img01');
      });
    });
    function pushImg(dClass){
      $('.divimg').remove();
      if($scope.user.filedoc01){
        for(var i in $scope.user.filedoc01){
          var html = '<div class="col col-20 divimg">' +
              '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc01[i].docfile + '" width="100" height="100" ng-click="removeimg(' + i + ')"/>' +
              '</div>';
          angular.element(document.getElementById(dClass)).append($compile(html)($scope));
        }
      }
    }
    $scope.removeimg = function(id){
      $scope.user.filedoc01.splice(id,1);
      pushImg('img01');
    }
    /* end img */
    /* img 02 */
    $('#txtfile02').change(function(){
      GetAtt('#txtfile02', '', 'canvas02', function (data) {
        console.log(data.length);
          $scope.user.filedoc02.push({docfile:data,title:'รูปหลังทำกิจกรรม '});
          pushImg2('img02');
      });
    });
    function pushImg2(dClass){
      $('.divimg2').remove();
      if($scope.user.filedoc02){
        for(var i in $scope.user.filedoc02){
          var html = '<div class="col col-20 divimg2">' +
              '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc02[i].docfile + '" width="100" height="100" ng-click="removeimg2(' + i + ')"/>' +
              '</div>';
          angular.element(document.getElementById(dClass)).append($compile(html)($scope));
        }
      }
    }
    $scope.removeimg2 = function(id){
      $scope.user.filedoc02.splice(id,1);
      pushImg2('img02');
    }
    /* end img */
  });
  /*------------------ begin img --------------------*/
  function insertresult(latitude,longitude,callback){
    try {
      $scope.showLoadingComplete('กำลังบันทึกข้อมูล');
      var g = guid();
      var ins = MobileCRM.DynamicEntity.createNew("ivz_resultappoint");
          ins.properties.ivz_resultappointid = g;
          ins.properties.ivz_resultname = $scope.user.accountname;
          ins.properties.ivz_customer = new MobileCRM.Reference('account',$stateParams.accountid);
          ins.properties.ivz_visit = parseInt(1);
          ins.properties.ivz_visitactivities = parseInt(1);
          ins.properties.ivz_activitiestext = $scope.user.activitieslist;
          ins.properties.ivz_latitude = latitude;
          ins.properties.ivz_longtitude = longitude;
          ins.properties.ivz_shedulestart = new Date();
          ins.properties.ivz_sheduleend = new Date();
          ins.properties.ivz_resultstatus = parseInt(1);
          ins.properties.ivz_resultremark = $scope.user.txtcomment;
          ins.properties.ivz_addressdistrict = new MobileCRM.Reference('ivz_addressdistrict',$scope.user.distid);
          ins.properties.ivz_addressprovince = new MobileCRM.Reference('ivz_addressprovince',$scope.user.province);
          ins.properties.ivz_territory = new MobileCRM.Reference('territory',Data.termas);
          ins.properties.ivz_empid = $cookies.get('ivz_empid');
          ins.properties.ivz_statuscomplete = parseInt(2);
          ins.save(function(er){
            if(er){
              alert(er);
            }else{
              setTimeout(function(){
                callback(g);
              },3000);
            }
          });
    } catch (e) {
      alert('error 1967 '+e);
    }
  }
  var instAnnote = function(id){
    var x = 0;
    var loopArray = function(arr){
      insAn(x,function(){
        x++;
        if(x < arr.length){
          loopArray(arr);
        }else{
          $ionicLoading.hide();
          $scope.reback();
        }
      });
    }
    loopArray($scope.user.filematch);
    function insAn(i,callback){
      $scope.showLoading('กำลังบันทึกข้อมูลเอกสารไฟล์ '+$scope.user.filematch[i].title);
      $scope.InAnnoteAttract('ivz_resultappoint',id,$scope.user.filematch[i].docfile,$scope.user.filematch[i].title,3,function(){
        setTimeout(function(){
          callback();
        },100);
      });
    }
  }
  var stins = function(){
    $scope.showLoading('กำลังโหลดข้อมูล GPS ');
      GetGPSLocation(function(res){
        var setv = setInterval(function(){
          if(res){
            insertresult(res.latitude,res.longitude,instAnnote);
            clearInterval(setv);
          }
        },100);
        if($scope.$phase){$scope.$apply();}
      });
  }

  $scope.cConfirm = function(){
    //filematch
    if($scope.user.filedoc01.length > 0 && $scope.user.filedoc02.length > 0){
        //alert('$scope.user.activitieslist :'+$scope.user.activitieslist);
        $scope.showLoading('กำลังตรวจสอบข้อมูล');
        var x = 0,y = 0;
        var loopB = function(arr){
          getPushA(y,$scope.user.filedoc02,function(){
            y++;
            if(y < arr.length){
              loopB(arr);
            }else{
              stins();
            }
          });
        }
        var loopA = function(arr){
          getPushA(x,arr,function(){
            x++;
            if(x < arr.length){
              loopA(arr);
            }else{
              loopB($scope.user.filedoc02);
            }
          });
        }
        loopA($scope.user.filedoc01);
        function getPushA(i,data,callback){
          $scope.user.filematch.push({
            docfile:data[i].docfile,
            title:data[i].title
          });
          callback();
        }
    }else{
      alert('กรุณาแนบรูปภาพก่อนและหลังทำกิจกรรมด้วย');
    }
  }
})
/*-------------------- end --------------------*/
.controller('EmpidProfileCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder) {
        $state.reload();
        $scope.Data = Data;
        $scope.user = {
            id: '',
            masterterid: $stateParams.masterterid,
            txtname:  $stateParams.txtname,
            tername: $cookies.get('name'),
            txtempid:$cookies.get('ivz_empid'),
            txtusername:$cookies.get('name'),
            txtpasswd:'123456',
            txttel:'(000) 000-0000',
            txtusername:'D09',
            txtemail:$stateParams.txtemail,
            filetername: '',
            remarkname: '',
            avator:'',
            class:'',
            divname:true
        };
        $scope.insertaccount = function(){
          $scope.showLoading('กำลังบันทึกข้อมูล');
          try {
            var ins = new MobileCRM.DynamicEntity('territory',$scope.user.masterterid);
                ins.properties.ivz_empname = $scope.user.txtname;
                ins.properties.ivz_empid = $scope.user.txtempid;
                ins.properties.ivz_emailcontact = $scope.user.txtemail;
                ins.save(function(er){
                  if(er){
                    alert('error update profile 9529 '+er);
                  }else{
                    $ionicLoading.hide();
                    $scope.reback();
                  }
                });
          } catch (er) {
            alert('error update profile 9536 '+er);
          }
        }
    })
.controller('ListMarketCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder) {
  $state.reload();
  $scope.Data = Data;
  $scope.ListMarket = [];
  $scope.listmont = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  $scope.user = {
    accountid:$stateParams.accountid,
    mastertype:$stateParams.mastertype,
    terid:$stateParams.terid,
    accountname:$stateParams.accountname,
    province:$stateParams.province,
    distid:$stateParams.distid
  };

  var chdouble = function(id){
    return false;
  }
  $scope.loaddata = function(){
    //alert($scope.user.accountid);
    getSituation($cookies.get('territoryid'),function(data){
      for(var i in data){
        $scope.ListMarket.push({
            id:data[i].ivz_market_situationid,
            name:data[i].ivz_name,
            customer:data[i].ivz_customernumber,
            weekly:parseInt(data[i].ivz_weekly) + 1,
            month:$scope.listmont[parseInt(data[i].ivz_month)],
            remarktext:data[i].ivz_remarkcomment,
            annotetype:data[i].docannote,
            docimg:'img/ionic.png'
          });
      }
      if($scope.$phase){
        $scope.$apply();
      }
    });
  }
  $scope.$on('$ionicView.enter',function(){
    $scope.loaddata();
  });
  $scope.removeitem = function(index){
    $scope.ListMarket.splice(index,1);
  }
  $scope.openform = function(){
    $state.go('app.addformmarket',{
      accountid:$stateParams.accountid,
      mastertype:$stateParams.mastertype,
      terid:$stateParams.terid,
      accountname:$stateParams.accountname,
      province:$stateParams.province,
      distid:$stateParams.distid
    },{reload:true});
  }

})
.controller('MarketFormCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder,$compile) {
  $state.reload();
  $scope.Data = Data;
  $scope.user = {
    optionweekly:weeksinWeekly(),
    optionmonth:weeksinMonth(),
    filedoc01:[],
    remarktxt:'',
    accountid:$stateParams.accountid,
    mastertype:$stateParams.mastertype,
    terid:$stateParams.terid,
    accountname:$stateParams.accountname,
    province:$stateParams.province,
    distid:$stateParams.distid
  }
  $scope.listmont = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
  $scope.optionsmonth = [];
  $scope.optionsweekly = [];
  for(var i = 0;i <= 11;i++){
    $scope.optionsmonth.push({
      id:i,name:$scope.listmont[i]
    });
  }
  for(var i = 0;i <= 3;i++){
    $scope.optionsweekly.push({
      id:i,name:(i+1)
    });
  }
  $scope.callfile = function(){
    $('#infiles').trigger('click');
  }
  $scope.$on('$ionicView.enter',function(){
    $('#infiles').change(function(){
      GetAtt('#infiles', '', 'canvas01', function (data) {
          console.log(data.length);
          $scope.user.filedoc01.push({docfile:data,title:'เอกสารแนบบันทึกสภาพการตลาด '});
          pushImg('img01');
      });
    });
    function pushImg(dClass){
      $('.divimg').remove();
      if($scope.user.filedoc01){
        for(var i in $scope.user.filedoc01){
          var html = '<div class="col divimg">' +
              '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc01[i].docfile + '" width="250" height="250" ng-click="removeimg(' + i + ')"/>' +
              '</div>';
          angular.element(document.getElementById(dClass)).append($compile(html)($scope));
        }
      }
    }
    $scope.removeimg = function(id){
      $scope.user.filedoc01.splice(id,1);
      pushImg('img01');
    }
  });
  $scope.cCancel = function(){
    //clear data
    $scope.reback();
  }
  function weeksinWeekly(){
     var gd =  new Date();
     var d = new Date(gd.getFullYear(), gd.getMonth(), gd.getDate());
     console.log(Math.floor((d.getDate()- 1)/7)+ 1);
     return (Math.floor((d.getDate()- 1)/7)+ 1)-1;
    }
  function weeksinMonth(){
       var gd =  new Date();
       return gd.getMonth();
      }
  function insdata(id,callback){
      //alert('insert db '+id);
      try {
        var ins = new MobileCRM.DynamicEntity.createNew('ivz_market_situation');
            ins.properties.ivz_market_situationid = id;
            ins.properties.ivz_name = $scope.user.accountname;
            ins.properties.ivz_customernumber = new MobileCRM.Reference('account',$scope.user.accountid);
            ins.properties.ivz_territoryid = new MobileCRM.Reference('territory',$scope.user.terid);
            ins.properties.ivz_empid = $cookies.get('ivz_empid');
            ins.properties.ivz_weekly = parseInt($scope.user.optionweekly);
            ins.properties.ivz_month = parseInt($scope.user.optionmonth);
            ins.properties.ivz_remarkcomment = $scope.user.remarktxt;
            ins.properties.ivz_docannote = parseInt(1);
            ins.properties.ivz_transdate = new Date();
            ins.save(function(er){
              if(er){
                alert('error 11032 '+er);
              }else{
                callback(id);
              }
            });
      } catch (err) {
        alert('error 11036 '+err);
      }
  }
  var innotemartket = function(id){
    //alert($scope.user.filedoc01.length);
    var i = 0;
    while ($scope.user.filedoc01[i]) {
      if((i + 1) >= $scope.user.filedoc01.length){
        try {
            var note = MobileCRM.DynamicEntity.createNew("annotation");
            note.properties.objectid = new MobileCRM.Reference('ivz_market_situation', id);
            note.properties.notetext = 1;
            note.properties.subject = $scope.user.filedoc01[i].title;
            note.properties.documentbody =  $scope.user.filedoc01[i].docfile;
            note.properties.mimetype = fileType;
            note.properties.isdocument = true;
            note.properties.filesize = parseInt(sizeKB);
            note.properties.filename = fileName;
            note.save(
                function (er) {
                    if (er) {
                        alert('error 11058 ' + er);
                    }else{
                      //alert('goback');
                      $scope.reback();
                    }
                });
        } catch (er) {
            alert('error 11065 ' + er);
        }
        break;
      }else{
        //alert($scope.user.filedoc01[i].title+'::'+$scope.user.filedoc01[i].docfile.length);
        try {
            var note = MobileCRM.DynamicEntity.createNew("annotation");
            note.properties.objectid = new MobileCRM.Reference('ivz_market_situation', id);
            note.properties.notetext = 1;
            note.properties.subject = $scope.user.filedoc01[i].title;
            note.properties.documentbody =  $scope.user.filedoc01[i].docfile;
            note.properties.mimetype = fileType;
            note.properties.isdocument = true;
            note.properties.filesize = parseInt(sizeKB);
            note.properties.filename = fileName;
            note.save(
                function (er) {
                    if (er) {
                        alert('error 11062 ' + er);
                    }
                });
        } catch (er) {
            alert('error 11066 ' + er);
        }
      }
      i++;
    }
  }
  $scope.cAdjustment = function(weekly,month,comment){
    if(!(comment)){
      alert('กรุณาระบุข้อมูลให้ครบด้วย');
    }else if($scope.user.filedoc01.length < 1){
      alert('กรุณาแนบรูปภาพประกอบด้วย');
    }else if($scope.user.filedoc01.length > 0 && comment){
      insdata(guid(),innotemartket);
    }
  }
})
.controller('ComputitorCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder) {
  $state.reload();
  $scope.Data = Data;
  Data.showcart = false;
  $scope.listoptioncomputitor = [
    {id:0,name:'รายงานสินค้า',link:'app.optioncomputitorproduct',type:0,accountid:$stateParams.accountid,accountiname:$stateParams.accountiname},
    {id:1,name:'Shelf Share',link:'app.optioncomputitorshelfshare',type:3,accountid:$stateParams.accountid,accountiname:$stateParams.accountiname},
    {id:2,name:'รายงานโปรโมชั่นของคู่แข่ง',link:'app.optioncomputitorpromotion',type:1,accountid:$stateParams.accountid,accountiname:$stateParams.accountiname},
    {id:3,name:'รายงานสินค้าปลอม',link:'app.optioncomputitorproductscream',type:2,accountid:$stateParams.accountid,accountiname:$stateParams.accountiname}
  ]
  $scope.tosref = function(id,type){
    console.log(id,type);
    try {
      $state.go(id,{
        retype:type,
        accountid:$stateParams.accountid,
        accountiname:$stateParams.accountiname
      },{reload:true});
    } catch (err) {
      console.log(err);
    }
  }
})
.controller('ComputitorProductCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder , $compile) {
  $state.reload();
  $scope.Data = Data;
  Data.showcart = false;
  $scope.user = {
    fHide:true,
    bHide:true,
    tHide:true,
    cHide:true,
    optionslist:[],
    retype:$stateParams.retype,
    accountid:$stateParams.accountid,
    txtcustomer:$stateParams.accountiname,
    bannerid:'',
    banner:'',
    bannertypeid:'',
    bannertype:'',
    caimpiageid:'',
    caimpiage:'',
    priceperunit:0,
    priceperunittot:0,
    pricepermonth:0,
    txtother:'',
    filedoc:[]
  }
  $scope.fixhide = function(id,txt){
    switch (id) {
      case 0:
              if(txt){
                if(txt.length >= 1){
                  $scope.user.fHide = false;
                }
              }else{
                $scope.user.fHide = true;
              }
        break;
        case 1:
                if(txt){
                  $scope.user.bHide = false;
                }else{
                  $scope.user.bHide = true;
                }
          break;
          case 2:
                  if(txt){
                    $scope.user.tHide = false;
                  }else{
                    $scope.user.tHide = true;
                  }
            break;
            case 3:
                    if(txt){
                      $scope.user.cHide = false;
                    }else{
                      $scope.user.cHide = true;
                    }
              break;
      default:

    }
  }
  $scope.setparamater = function(type,id,txt){
    switch (type) {
      case 0:
              $scope.user.fHide = !$scope.user.fHide;
              $scope.user.accountid = id;
              $scope.user.txtcustomer = txt;
              break;
      case 1:
              $scope.user.bHide = !$scope.user.bHide;
              $scope.user.bannerid = id;
              $scope.user.banner = txt;
              break;
      case 2:
              $scope.user.tHide = !$scope.user.tHide;
              $scope.user.bannertypeid = id;
              $scope.user.bannertype = txt;
              break;
      case 3:
              $scope.user.cHide = !$scope.user.cHide;
              $scope.user.caimpiageid = id;
              $scope.user.caimpiage = txt;
              break;
    }
  }
  $scope.callfile = function(){
    $('#infiles').trigger('click');
  }
  $scope.loadcustomer = function(){
    $scope.listaccount = '';
    GetAccount(Data.termas,Data.mastertype,1,function(data){
      $scope.listaccount = data;
      $scope.loadtypeproduct();
      if($scope.$phase){
        $scope.$apply();
      }
    });
  }
  $scope.loadtypeproduct = function(){
    $scope.listtypeproduct = '';
    gettypeproduct(function(data){
      $scope.listtypeproduct = data;
      $scope.loadproductname();
    });
    if($scope.$phase){
      $scope.$apply();
    }
  }
  $scope.loadproductname = function(){
    $scope.listproductname = '';
    getproductname(function(data){
      $scope.listproductname = data;
      $scope.loadcampaign();
    });
    if($scope.$phase){
      $scope.$apply();
    }
  }
  $scope.loadcampaign = function(){
    $scope.listcampaign = '';
    getcampiagn(function(data){
      $scope.listcampaign = data;
    });
    if($scope.$phase){
      $scope.$apply();
    }
  }
  $scope.$on('$ionicView.enter',function(){
    $scope.loadcustomer();
    $('#infiles').change(function(){
      GetAtt('#infiles', '', 'canvas01', function (data) {
          console.log(data.length);
          $scope.user.filedoc.push({docfile:data,title:'รูปภาพประกอบบันทึกรายงานคู่แข่ง'});
          pushImg('img01');
      });
    });
    function pushImg(dClass){
      $('.divimg').remove();
      if($scope.user.filedoc){
        for(var i in $scope.user.filedoc){
          var html = '<div class="col divimg">' +
              '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc[i].docfile + '" width="250" height="250" ng-click="removeimg(' + i + ')"/>' +
              '</div>';
          angular.element(document.getElementById(dClass)).append($compile(html)($scope));
        }
      }
    }
    $scope.removeimg = function(id){
      $scope.user.filedoc.splice(id,1);
      pushImg('img01');
    }
  });
  function insdetail(id,callback){
    try {
      //body...
      // alert('id:'+id+'\n'+
      //       '$scope.user.accountid:'+$scope.user.accountid+'\n'+
      //       'Data.termas:'+Data.termas);
      var ins = new MobileCRM.DynamicEntity.createNew('competitor');
          ins.properties.competitorid = id;
          ins.properties.name = $scope.user.txtcustomer;
          ins.properties.ivz_typereport = parseInt($scope.user.retype);
          ins.properties.ivz_customer = new MobileCRM.Reference('account',$scope.user.accountid);
          ins.properties.ivz_territory = new MobileCRM.Reference('territory',Data.termas);
          ins.properties.ivz_bannerproduct = $scope.user.banner;
          ins.properties.ivz_bannerproducttype = $scope.user.bannertype;
          ins.properties.ivz_pricewhole = parseInt($scope.user.priceperunit);
          ins.properties.ivz_priceretail = parseInt($scope.user.priceperunittot);
          ins.properties.ivz_campaign = parseInt($scope.user.caimpiage);
          ins.properties.ivz_tatolpermonth = parseInt($scope.user.pricepermonth);
          ins.properties.ivz_remarkcomment = $scope.user.txtother;
          ins.save(function(er){
            if(er){
              alert('error 11283 '+er);
            }else{
              setTimeout(function(){
                callback(id);
              },2000);
            }
          });
    } catch (err) {
      alert('error 10048 '+err);
    }
  }
  var insannote = function(id){
    var x = 0;
    var loopA = function(arr){
      getIns(x,function(){
        x++;
        if(x < arr.length){
          loopA(arr);
        }else{
          $ionicLoading.hide();
          $scope.reback();
        }
      });
    }
    loopA($scope.user.filedoc);
    function getIns(i,callback){
      try {
         $scope.InAnnoteAttract('competitor',id,$scope.user.filedoc[i].docfile,$scope.user.filedoc[i].title,3,function(){
           setTimeout(function(){
             callback();
           },1000);
         });
      } catch (err) {
        alert('error 10070 '+err);
      }
    }
  }
  $scope.cInsert = function(){
    if($scope.user.accountid.length <= 0 ||
      $scope.user.banner.length <= 0 ||
      $scope.user.bannertype.length <= 0 ||
      $scope.user.caimpiage.length <= 0 ||
      $scope.user.filedoc.length <= 0){
        alert('กรุณากรอกข้อมูลให้ครบด้วย');
      }else{
        $scope.showLoading('กำลังบันทึกข้อมูล');
        insdetail(guid(),insannote);
      }
  }
})
.controller('ComputitorProductPromotionCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder , $compile) {
  $state.reload();
  $scope.Data = Data;
  Data.showcart = false;
  $scope.user = {
    bannerid:'',
    producttype:'',
    productcaimplign:'',
    perpricenormal:0,
    priceperpromotion:0,
    priceperunit:0,
    promotiontime:'',
    pricepermonth:0,
    txtother:'',
    filedoc:[]
  }
  $scope.loadtypeproduct = function(){
    $scope.listtypeproduct = '';
    gettypeproduct(function(data){
      $scope.listtypeproduct = data;
      $scope.loadproductname();
    });
    if($scope.$phase){
      $scope.$apply();
    }
  }
  $scope.loadproductname = function(){
    $scope.listproductname = '';
    getproductname(function(data){
      $scope.listproductname = data;
      $scope.loadcampaign();
    });
    if($scope.$phase){
      $scope.$apply();
    }
  }
  $scope.loadcampaign = function(){
    $scope.listcampaign = '';
    getcampiagn(function(data){
      $scope.listcampaign = data;
    });
    if($scope.$phase){
      $scope.$apply();
    }
  }
  $scope.callfile = function(){
    $('#infiles').trigger('click');
  }
  function pushImg(dClass){
    $('.divimg').remove();
    if($scope.user.filedoc){
      for(var i in $scope.user.filedoc){
        var html =  '<div class="col divimg">' +
                    '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc[i].docfile + '" width="150" height="150" ng-click="removeimg(' + i + ')"/>' +
                    '</div>';
        angular.element(document.getElementById(dClass)).append($compile(html)($scope));
      }
    }
  }
  $scope.removeimg = function(id){
    $scope.user.filedoc.splice(id,1);
    pushImg('img01');
  }
  $scope.$on('$ionicView.enter',function(){
    $scope.loadtypeproduct();
    $('#infiles').change(function(){
      GetAtt('#infiles', '', 'canvas01', function (data) {
          console.log(data.length);
          $scope.user.filedoc.push({docfile:data,title:'shelf share '});
          pushImg('img01');
      });
    });
  });
  function inserthead(id,callback){
    try {
      //body...
      var ins = new MobileCRM.DynamicEntity.createNew('competitor');
          ins.properties.competitorid = id;
          ins.properties.name = $stateParams.accountiname;
          ins.properties.ivz_typereport = parseInt(1);
          ins.properties.ivz_customer = new MobileCRM.Reference('account',$stateParams.accountid);
          ins.properties.ivz_territory = new MobileCRM.Reference('territory',Data.termas);
          ins.properties.ivz_bannerproduct = $scope.user.banner;
          ins.properties.ivz_bannerproducttype = $scope.user.bannertype;
          ins.properties.ivz_pricewhole = parseInt($scope.user.priceperunit);
          ins.properties.ivz_priceretail = parseInt($scope.user.perpricenormal);
          ins.properties.ivz_perafterpromotion = parseInt($scope.user.priceperpromotion);
          ins.properties.ivz_campaign = new MobileCRM.Reference('ivz_campaign',$scope.user.productcaimplign);
          ins.properties.ivz_typeproduct = new MobileCRM.Reference('ivz_typeproduct',$scope.user.producttype);
          ins.properties.ivz_productbanner = new MobileCRM.Reference('ivz_productbanner',$scope.user.bannerid);
          ins.properties.ivz_tatolpermonth = parseInt($scope.user.pricepermonth);
          ins.properties.ivz_remarkcomment = $scope.user.txtother;
          ins.save(function(er){
            if(er){
              alert('error 12043 '+er);
            }else{
              alert('insert complete:'+id);
              setTimeout(function(){
                callback(id);
              },2000);
            }
          });
    } catch (err) {
      alert('error 12051 '+err);
    }
  }
  var insannote = function(id){
    var x = 0;
    function loopA(arr){
      $scope.InAnnoteAttract('competitor',id,arr[x].docfile,arr[x].title,3,function(){
        x++;
        if(x < arr.length){
          loopA(arr);
        }else{
          $ionicLoading.hide();
          $scope.reback();
        }
        if($scope.$phase){
          $scope.$apply();
        }
      });
    }
    loopA($scope.user.filedoc);
  }
  $scope.cInsert = function(){
    alert($scope.user.filedoc.length);
    if($scope.user.filedoc.length > 0){
      inserthead(guid(),insannote);
    }else{
      inserthead(guid(),function(){
        $ionicLoading.hide();
        $scope.reback();
      });
    }
  }
})
.controller('ComputitorProductShelfShareCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder , $compile) {
  $state.reload();
  $scope.Data = Data;
  Data.showcart = false;
  $scope.user = {
    optionslist:[],
    banner:'',
    bannertype:'',
    priceperunit:0,
    priceperunittot:0,
    caimpiage:'',
    pricepermonth:0,
    txtother:'',
    filedoc:[],
    producttype:'',
    productband:'',
    percenter:0,
    useritem:true,
    usertypeproduct:true,
    userband:true,
    txtcustomer:'',
    customerid:'',
    selfshrelist:[],
    listoption:[],
    doccomputiter:[]
  }
  $scope.loadcustomer = function(){
    $scope.listaccount = '';
    GetAccount(Data.termas,Data.mastertype,1,function(data){
      $scope.listaccount = data;
      $scope.loadtypeproduct();
      if($scope.$phase){
        $scope.$apply();
      }
    });
  }
  $scope.loadtypeproduct = function(){
    $scope.listtypeproduct = '';
    gettypeproduct(function(data){
      $scope.listtypeproduct = data;
      $scope.loadproductname();
    });
    if($scope.$phase){
      $scope.$apply();
    }
  }
  $scope.loadproductname = function(){
    $scope.listproductname = '';
    getproductname(function(data){
      $scope.listproductname = data;
      $scope.loadcampaign();
    });
    if($scope.$phase){
      $scope.$apply();
    }
  }
  $scope.loadcampaign = function(){
    $scope.listcampaign = '';
    getcampiagn(function(data){
      $scope.listcampaign = data;
    });
    if($scope.$phase){
      $scope.$apply();
    }
  }
  $scope.callfile = function(){
    $('#infiles').trigger('click');
  }
  function pushImg(dClass){
    $('.divimg').remove();
    if($scope.user.filedoc){
      for(var i in $scope.user.filedoc){
        var html =  '<div class="col divimg">' +
                    '<img class="thumbnail" src="data:image/jpeg;base64,' + $scope.user.filedoc[i].docfile + '" width="150" height="150" ng-click="removeimg(' + i + ')"/>' +
                    '</div>';
        angular.element(document.getElementById(dClass)).append($compile(html)($scope));
      }
    }
  }
  $scope.removeimg = function(id){
    $scope.user.filedoc.splice(id,1);
    pushImg('img01');
  }
  $scope.$on('$ionicView.enter',function(){
    $scope.loadcustomer();
    $('#infiles').change(function(){
      GetAtt('#infiles', '', 'canvas01', function (data) {
          console.log(data.length);
          $scope.user.filedoc.push({docfile:data,title:'shelf share '});
          pushImg('img01');
      });
    });
  });
  $scope.settrue = function(id,txt,type){
    switch (id) {
      case 1:
              if(txt){
                switch (type) {
                  case true:
                          $scope.user.useritem = false;
                    break;
                  default:
                }
              }
        break;
      case 2:
        switch (type) {
          case true:
                  $scope.user.usertypeproduct = false;
            break;
          default:
        }
        break;
      case 3:
        switch (type) {
          case true:
                  $scope.user.userband = false;
            break;
          default:
        }
        break;
    }
  }
  $scope.setfalse = function(id,acid,txtname,type){
    switch (id) {
      case 1:
        switch (type) {
          case false:
                  $scope.user.txtcustomer = txtname;
                  $scope.user.customerid = acid;
                  $scope.user.useritem = true;
            break;
        }
        break;
      case 2:
        switch (type) {
          case false:
                  $scope.user.producttype = txtname;
                  $scope.user.customerid = '';
                  $scope.user.usertypeproduct = true;
            break;
        }
        break;
      case 3:
        switch (type) {
          case false:
                  $scope.user.productband = txtname;
                  $scope.user.customerid = '';
                  $scope.user.userband = true;
            break;
        }
        break;
    }
  }
  $scope.deleteitem = function(index){
    $scope.user.listoption.splice(index,1);
  }
  $scope.cAddCustomer = function(){
    console.log('add item'+$scope.user.filedoc.length);
    var uid = guid();
    if($scope.user.customerid.length < 1 &&
       $scope.user.producttype.length < 1 &&
       $scope.user.productband.length < 1){
          alert('กรุณากรอกข้อมูลให้ครบด้วย');
       }else if($scope.user.filedoc.length <= 0){
         alert('กรุณาแนบเอกสารด้วย');
       }else{
         if(Data.selfshare.length > 0){
           if($scope.matchmarket() > 100){
             alert('ส่วนแบ่งการตลาดเกิน 100 %');
           }else{
             Data.selfshare.push({
               uid:uid,
               accountname:$scope.user.txtcustomer,
               accountid:$scope.user.customerid,
               bannerproduct:$scope.user.productband,
               bannerproducttype:$scope.user.producttype,
               marketshare:$scope.user.percenter
             });
           }
         }else{
           Data.selfshare.push({
             uid:uid,
             accountname:$scope.user.txtcustomer,
             accountid:$scope.user.customerid,
             bannerproduct:$scope.user.productband,
             bannerproducttype:$scope.user.producttype,
             marketshare:$scope.user.percenter
           });
         }
         for(var i in $scope.user.filedoc){
           Data.doccomputiter.push({
             docid:uid,
             docfile:$scope.user.filedoc[i].docfile,
             title:$scope.user.filedoc[i].title
           });
         }
         if($scope.matchmarket() > 100){
              alert('ส่วนแบ่งการตลาดเกิน 100 %');
            }else{
                $('.divimg').remove();
                $scope.user.optionslist.length = 0;
                $scope.user.banner = '';
                $scope.user.bannertype = '';
                $scope.user.priceperunit = 0;
                $scope.user.priceperunittot = 0;
                $scope.user.caimpiage = '';
                $scope.user.pricepermonth = 0;
                $scope.user.txtother = '';
                $scope.user.filedoc.length = 0;
                $scope.user.producttype = '';
                $scope.user.productband = '';
                $scope.user.percenter = 0;
                $scope.user.useritem = true;
                $scope.user.usertypeproduct = true;
                $scope.user.userband = true;
                $scope.user.txtcustomer = '';
                $scope.user.customerid = '';
                $scope.user.selfshrelist.length = 0;
                $scope.user.listoption.length = 0;
                $scope.user.doccomputiter.length = 0;
              $state.go('app.addformselfshare',{accountid:$stateParams.accountid,accountiname:$stateParams.accountiname},{reload:true});
              //inscomputitor(guid(),insannote);
            }
       }
  }
  $scope.matchmarket = function(){
    if(Data.selfshare.length > 0){
      var x = 0;
      for(var i in Data.selfshare){
        console.log(i+'$scope.user.listoption[i].marketshare:'+Data.selfshare[i].marketshare);
        x += parseInt(Data.selfshare[i].marketshare) + parseInt($scope.user.percenter);
      }
      return x;
    }else{
      return 0;
    }
  }
  $scope.$watch('Data.selfshare',function(){
    $scope.matchmarket();
  });
  $scope.cInsert = function(){
    $('.divimg').remove();
    $scope.user.optionslist.length = 0;
    $scope.user.banner = '';
    $scope.user.bannertype = '';
    $scope.user.priceperunit = 0;
    $scope.user.priceperunittot = 0;
    $scope.user.caimpiage = '';
    $scope.user.pricepermonth = 0;
    $scope.user.txtother = '';
    $scope.user.filedoc.length = 0;
    $scope.user.producttype = '';
    $scope.user.productband = '';
    $scope.user.percenter = 0;
    $scope.user.useritem = true;
    $scope.user.usertypeproduct = true;
    $scope.user.userband = true;
    $scope.user.txtcustomer = '';
    $scope.user.customerid = '';
    $scope.user.selfshrelist.length = 0;
    $scope.user.listoption.length = 0;
    $scope.user.doccomputiter.length = 0;
    $state.go('app.addformselfshare',{accountid:$stateParams.accountid,accountiname:$stateParams.accountiname},{reload:true});
  }
  $scope.$on('$ionicView.enter',function(){
    $('.divimg').remove();
    $scope.user.optionslist.length = 0;
    $scope.user.banner = '';
    $scope.user.bannertype = '';
    $scope.user.priceperunit = 0;
    $scope.user.priceperunittot = 0;
    $scope.user.caimpiage = '';
    $scope.user.pricepermonth = 0;
    $scope.user.txtother = '';
    $scope.user.filedoc.length = 0;
    $scope.user.producttype = '';
    $scope.user.productband = '';
    $scope.user.percenter = 0;
    $scope.user.useritem = true;
    $scope.user.usertypeproduct = true;
    $scope.user.userband = true;
    $scope.user.txtcustomer = '';
    $scope.user.customerid = '';
    $scope.user.selfshrelist.length = 0;
    $scope.user.listoption.length = 0;
    $scope.user.doccomputiter.length = 0;
  });
})
.controller('FormShelfShareCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder , $compile) {
  $state.reload();
  $scope.Data = Data;
  Data.showcart = false;
  $scope.matchmarkettatol = function(){
    //alert('Data.selfshare.length:'+Data.selfshare.length);
    if(Data.selfshare.length > 0){
      var x = 0;
      for(var i in Data.selfshare){
        x += parseInt(x) + parseInt(Data.selfshare[i].marketshare);
      }
      return x;
    }else{
      return 0;
    }
  }
  // $scope.$watch('Data.selfshare',function(){
  //   $scope.matchmarket();
  // });
  function inscomputitor(id,callback){
    try {
      var data = Data.selfshare;
      var x = 0;
      var loopArray = function(arr){
        inspush(x,function(y){
          x++;
          if(x < arr.length){
            loopArray(arr);
          }else{
            $ionicLoading.hide();
            callback(y);
          }
        });
      }
      loopArray(data);
      function inspush(i,callback){
        // var y = '$scope.user.accountid:'+$stateParams.accountid+'\n'+
        //         'Data.termas:'+$cookies.get('territoryid');
        // alert(y);
        $scope.showLoading('กำลังบันทึกข้อมูล '+data[i].accountname);
        var ins = new MobileCRM.DynamicEntity.createNew('competitor');
            ins.properties.competitorid = data[i].uid;
            ins.properties.name = data[i].accountname;
            ins.properties.ivz_typereport = parseInt(3);
            ins.properties.ivz_customer = new MobileCRM.Reference('account',$stateParams.accountid);
            ins.properties.ivz_territory = new MobileCRM.Reference('territory',$cookies.get('territoryid'));
            ins.properties.ivz_bannerproduct = data[i].bannerproduct;
            ins.properties.ivz_bannerproducttype = data[i].bannerproducttype;
            ins.properties.ivz_marketshare = parseFloat(data[i].marketshare);
            ins.save(function(er){
              if(er){
                alert('error 11841 '+er);
              }else{
                setTimeout(function(){
                  callback(id);
                },2000);
              }
            });
      }
    } catch (err) {
      alert('error 10048 '+err);
    }
  }
  var insannote = function(id){
    alert(Data.doccomputiter.length+'\n'+id);
    var x = 0;
    var loopArray = function(arr){
      inan(x,function(){
        x++;
        if(x < arr.length){
          loopArray(arr);
        }else{
          Data.selfshare.length = 0;
          Data.doccomputiter.length = 0;
          $ionicLoading.hide();
          $scope.reback();
        }
      });
    }
    loopArray(Data.doccomputiter);
    function inan(i,callback){
      try {
         $scope.InAnnoteAttract('competitor',Data.doccomputiter[i].docid,Data.doccomputiter[i].docfile,Data.doccomputiter[i].title,3,function(){
           setTimeout(function(){
             callback();
           },1000);
         });
      } catch (err) {
        alert('error 11856 '+err);
      }
    }
  }
  $scope.cInsert = function(){
    console.log('Insert DB Self Share');
    inscomputitor(guid(),insannote);
  }
})
.controller('CompromotionCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder ,$compile) {

})
.controller('ExamplCtrl', function ($scope, $stateParams, $cookies, Data, $state, $ionicLoading, $ionicHistory, $ionicModal, DataOrder ,$compile) {
  $scope.Data = Data;
  Data.showcart = false;
  $scope.user = {
    bannerid:'',
    producttype:'',
    productcaimplign:'',
    perpricenormal:'',
    priceperpromotion:'',
    priceperunit:'',
    promotiontime:'',
    pricepermonth:'',
    txtother:'',
    filedoc:[]
  }

})

    //////////////////////// End ////////////////////
;
