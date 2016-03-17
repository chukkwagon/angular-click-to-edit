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
Only requirements are `ngModel` for the `<input>` and `onSave` for
the `click-to-edit` directive declaration.

The `onSave` function is quite flexible, provided it returns an instance
of a promise you can implement it to your liking in your controller.

The click-to-edit module exposes two `<span>` elements after each input that
can be individually styled to suit your needs. These elements have classes:
`cte-action`. The first `<span>` triggers the save protocol that calls the 
`onSave` function (unique class = `cte-action-save`), the second dismisses 
the input and resets the model to the last committed view value 
(unique class = `cte-action-cancel`).

### Advanced Notes:

Because the directive pair uses `ng-transclude` to jam the input into the
`click-to-edit` template, you can pass arbitrary attributes into the input
field and they will work on your scope as expected. This is particularly
useful for validation controls.

When you blur a input, the model is reset to the last committed view value
by default. To disable this behavior, pass in the optional parameter 
`allow-uncommitted="true"`, and the model will not reset unless explicitly 
committed (saved) or cancelled.

## Development

Install dependencies with `npm install`. Run the test suite with `gulp watch`
which watches the module and test file for changes, or `gulp test` for test
and exit.
