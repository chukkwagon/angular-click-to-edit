describe('Angular Click-to-edit directive: ', function(){
    var $scope;
    var $isolateScope;
    var $compile;
    var mocks;
    beforeEach(function(){
        module('clickToEditDirective');
        mocks = {};
        inject(function(_$compile_, $rootScope, _$timeout_){
            $compile = _$compile_;
            $timeout = _$timeout_;
            $scope = $rootScope.$new();
            $scope.model = "my initial value";
            $scope.onSave = jasmine.createSpy('onSave').and.returnValue(true);
            $scope.$digest();
        });
    });

    function createElement(inputFragment){
        var htmlString = '<click-to-edit on-save="onSave(currentValue, initialValue)">';
        htmlString += inputFragment;
        htmlString += '</click-to-edit>';
        var element = angular.element(htmlString);
        element = $compile(element)($scope);
        $scope.$digest();
        $isolateScope = element.isolateScope();
        return element;
    }
    describe('text input ', function(){
        var inputElem;
        beforeEach(function(){
            var element = createElement('<input edit-input type="text" ng-model="model">');
            inputElem = element.find('input');
            $timeout.flush();
        });
        it('should call save', function(){
            var currentValue;
            var initialValue = angular.copy($scope.model);
            $scope.model  = currentValue = "a totally different value";
            $scope.$digest();
            $isolateScope.save();
            expect($scope.onSave).toHaveBeenCalledWith(currentValue, initialValue);
        });
        it('should handle a promise returned by onSave', inject(function($q){
            var currentValue;
            var initialValue = angular.copy($scope.model);
            $scope.model = currentValue = "a totally different value";
            $scope.$digest();
            $scope.onSave = function(){
                mocks.saveDefer = $q.defer();
                return mocks.saveDefer.promise;
            };
            spyOn($scope, 'onSave').and.callThrough();
            $isolateScope.save();
            expect($isolateScope.disabled).toEqual(true);
            mocks.saveDefer.resolve(true); // successful save
            $scope.$digest();
            expect($isolateScope.disabled).toEqual(false);
            expect($scope.onSave).toHaveBeenCalledWith(currentValue, initialValue);
            $scope.onSave.calls.reset();
            $isolateScope.save();
            mocks.saveDefer.resolve(true);
            $scope.$digest();
            expect($scope.onSave).toHaveBeenCalledWith(currentValue, currentValue);
        }));
        it('should handle a resource.$promise returned by onSave', inject(function($q){
            var initialValue = angular.copy($scope.model);
            $scope.model = currentValue = "a totally different value";
            $scope.$digest();
            $scope.onSave = function(){
                mocks.saveDefer = $q.defer();
                return {
                    $promise: mocks.saveDefer.promise
                };
            };
            spyOn($scope, 'onSave').and.callThrough();
            $isolateScope.save();
            expect($isolateScope.disabled).toEqual(true);
            mocks.saveDefer.resolve(true); // successful save
            $scope.$digest();
            expect($isolateScope.disabled).toEqual(false);
            expect($scope.onSave).toHaveBeenCalledWith(currentValue, initialValue);
            $scope.onSave.calls.reset();
            $isolateScope.save();
            mocks.saveDefer.resolve(true);
            $scope.$digest();
            expect($scope.onSave).toHaveBeenCalledWith(currentValue, currentValue);
        }));
    });
    describe('radio input ', function() {
        var inputElem;
        beforeEach(function(){
            $scope.model = 'blue';
            var element = createElement('<input edit-input type="radio" ng-model="model" ng-value="\'red\'">');
            inputElem = element.find('input');
            $timeout.flush();
        });
        it('shoud call save when the radio is selected', inject(function($q) {
            var initialValue = angular.copy($scope.model);
            $scope.model = 'red';
            $scope.$digest();
            $scope.onSave = function(){
                mocks.saveDefer = $q.defer();
                return mocks.saveDefer.promise;
            };
            spyOn($scope, 'onSave').and.callThrough();
            $scope.$apply(function() {
                inputElem.change();
            });
            expect($isolateScope.disabled).toEqual(true);
            mocks.saveDefer.resolve(true); // successful save
            $scope.$digest();
            expect($isolateScope.disabled).toEqual(false);
            expect($scope.onSave).toHaveBeenCalledWith($scope.model, initialValue);
        }));
    });
    describe('checkbox input', function() {
        var inputElem;
        beforeEach(function(){
            $scope.model = false;
            var element = createElement('<input edit-input type="checkbox" ng-model="model" ng-checked="true">');
            inputElem = element.find('input');
            $timeout.flush();
        });
        it('shoud call save when the checkbox is selected', inject(function($q) {
            var initialValue = angular.copy($scope.model);
            $scope.model = true;
            $scope.$digest();
            $scope.onSave = function(){
                mocks.saveDefer = $q.defer();
                return mocks.saveDefer.promise;
            };
            spyOn($scope, 'onSave').and.callThrough();
            $scope.$apply(function() {
                inputElem.change();
            });
            expect($isolateScope.disabled).toEqual(true);
            mocks.saveDefer.resolve(true); // successful save
            $scope.$digest();
            expect($isolateScope.disabled).toEqual(false);
            expect($scope.onSave).toHaveBeenCalledWith($scope.model, initialValue);
        }));
    });
    describe('number input', function() {
        var inputElem;
        beforeEach(function(){
            $scope.model = 2;
            var element = createElement('<input edit-input type="number" ng-model="model">');
            inputElem = element.find('input');
            $timeout.flush();
        });
        it('should call save when the number is changed', inject(function($q) {
            var initialValue = angular.copy($scope.model);
            $scope.model ++;
            $scope.$digest();
            $scope.onSave = function(){
                mocks.saveDefer = $q.defer();
                return mocks.saveDefer.promise;
            };
            spyOn($scope, 'onSave').and.callThrough();
            $scope.$apply(function() {
                inputElem.change();
            });
            expect($isolateScope.disabled).toEqual(true);
            mocks.saveDefer.resolve(true); // successful save
            $scope.$digest();
            expect($isolateScope.disabled).toEqual(false);
            expect($scope.onSave).toHaveBeenCalledWith($scope.model, initialValue);
        }));
    });
});