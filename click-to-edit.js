(function() {
    'use strict';

angular
.module('clickToEdit', [])
.directive('editInput', editInput)
.directive('clickToEdit', clickToEdit);


/*
    Used in Conjunction with clickToEdit

    This attribute directive decorates an input
    element so that it's model is available in
    the clickToEdit Controller.

    REQUIRED for clickToEdit to work
*/
editInput.$inject = ['$parse'];
function editInput($parse) {
    return {
        require: ['^clickToEdit', 'ngModel'],
        restrict: 'A',
        priority: 1001,
        link: function($scope, element, attrs, ctrls){

            // Manage Controllers
            var clickToEditCtrl = ctrls[0];
            var ngModelCtrl = ctrls[1];

            // set the input model
            clickToEditCtrl.setNgModel(ngModelCtrl);

            // To update the model value on cancel/save
            var modelGetter = $parse(attrs['ngModel']);
            var modelSetter = modelGetter.assign;
            clickToEditCtrl.modelSetter(function(value){
                modelSetter($scope, value);
            });

            // What kind of input are we dealing with
            var input = element[0];
            var inputTypes = {
                'text': handleText,
                'radio': handleChange,
                'checkbox': handleChange,
                'number': handleChange,
                'select-one': handleChange,
                'tel': handleText,
                'email': handleText,
                'textarea': handleTextArea
            };

            // Assign event bindings based on type
            if (inputTypes[input.type]) {
                inputTypes[input.type]();
            // Default to change event if unrecognized type
            } else {
                handleChange();
            }

            // event listeners for a text input
            function handleText() {
                element.bind('focus', clickToEditCtrl.enableEditor);
                element.bind('blur', clickToEditCtrl.disableEditor);
                element.bind('keypress', function(event) {
                    if (event.which == 13) {
                        clickToEditCtrl.save(event);
                    }
                });
            }

            function handleTextArea() {
                element.bind('focus', clickToEditCtrl.enableEditor);
                element.bind('blur', clickToEditCtrl.disableEditor);
            }

            // handle input change event
            function handleChange() {
                element.bind('change', clickToEditCtrl.save);
            }
        }
    };
}

/*
    Click to Edit Inputs

    Purpose: standardized click to edit functionality
    with save on enter and save/cancel buttons that show
    on focus of an input field.

    Usage:

    <click-to-edit onSave="mySaveFn(initialValue, currentValue)">
        <input edit-input type="checkbox"
        ng-model="myModel"
        ng-true-value="Yes"
        ng-required>
    </click-to-edit>

    Requirements: editInput (to decorate the input element)
*/
clickToEdit.$inject = ['$q', '$timeout'];
function clickToEdit($q, $timeout) {
    return {
        transclude: true,
        restrict: 'E',
        scope: {
            onSave: '&'
        },
        templateUrl: 'shared/templates/click-to-edit.tpl.html',
        controller: ['$scope', function($scope){
            var modelCtrl;
            var initialValue;
            var updateValue;

            this.setNgModel = function(ngModel){
                modelCtrl = ngModel;
                $timeout(function() {
                    initialValue = modelCtrl.$modelValue;
                });
            };

            this.enableEditor = function(){
                $scope.$apply(function() {
                    $scope.editor.enabled = true;
                });
            };

            this.disableEditor = function(){
                $scope.editor.enabled = false;
                updateValue(initialValue);
            };

            this.modelSetter = function(setterFunction){
                updateValue = setterFunction;
            };

            // Scope variables
            $scope.disabled = false;
            $scope.editor = {
                enabled: false
            };

            // Revert to intial value & pristine
            $scope.cancel = function cancel($event){
                if ($event) {
                    $event.preventDefault();
                    $event.target.parentNode.parentNode.children[0].children[0].blur();
                }
                updateValue(initialValue);
                $scope.editor.enabled = false;
            };

            // Execute the parent save function
            // Update the intialValue on success
            this.save = $scope.save = function save($event){
                if ($event) {
                    $event.preventDefault();
                }
                $scope.disabled = true;
                var currentValue = modelCtrl.$modelValue;
                var params = {
                    currentValue: currentValue,
                    initialValue: initialValue
                };
                var result = $scope.onSave(params);
                if (result && result.$promise) {
                    result = result.$promise;
                }
                $q.when(result).then(function(res) {
                    if (res) {
                        $scope.disabled = false;
                        initialValue = currentValue;
                        $scope.cancel($event);
                    }
                });
            };
            return this;
        }]
    };
}

})();