# angular-click-to-edit

**Directives to achieve click-to-edit functionality in Angular 1.3+**

## Usage
Click to edit relies on the ng-model of the input field to bind
and `onSave` function to the input. `onSave` is a function provided
in the directive declaration that returns a `promise`.

### Basic Usage:


    <click-to-edit on-save="mySaveFn(initialValue, currentValue)">
        <input edit-input type="checkbox"
        ng-model="myModel"
        ng-true-value="Yes"
        ng-required>
    </click-to-edit>


Simply decorate the input field with `edit-input` and then wrap it
with `click-to-edit` to get up and running. We use this two directive
syntax to allow the use of arbitrary attributes and additional elements.
All we require is an `ngModel` for the input element and `onSave` for
the `click-to-edit` element.

The `onSave` function is quite flexible, provided it returns an instance
of a promise you can implement it to your liking in your controller.

### Advanced Notes:

Because the directive pair uses `ng-transclude` to jam the input into the
`click-to-edit` template, you can pass arbitrary attributes into the input
field and they will work on your scope as expected. This is particularly
useful for validation controls.
