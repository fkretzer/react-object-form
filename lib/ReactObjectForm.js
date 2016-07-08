'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseFormRenderer = exports.MultiSelectRenderer = exports.SelectRenderer = exports.ObjectFormRenderer = exports.FieldRenderer = exports.BooleanValueInput = exports.GenericValueInput = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactSelect = require('react-select');

var _reactSelect2 = _interopRequireDefault(_reactSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Workaround. See -> https://phabricator.babeljs.io/T6777
typeof undefined === 'undefined' ? 'undefined' : _typeof(undefined);
var console = console ? console : {};
console.log = console.log ? console.log : function () {};

//TODO: Make all components configurable by checking for component override via config

//Base shape for property config
var PropertyConfig = {
  //Property key in Object
  name: _react2.default.PropTypes.string.isRequired,
  //If property is a child-object configs for its properties can be supplied
  config: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape(PropertyConfig)),
  //Possible values for this property
  options: _react2.default.PropTypes.array,
  //true if property can contain values which are not listed in "options"
  allowCustomValues: _react2.default.PropTypes.bool,
  //true if form field should be read-only
  disabled: _react2.default.PropTypes.bool,
  placeholder: _react2.default.PropTypes.string,
  label: _react2.default.PropTypes.string,
  //TODO: concept / implement
  validator: _react2.default.PropTypes.func,
  caption: _react2.default.PropTypes.string,
  changeHandler: _react2.default.PropTypes.func,
  hide: _react2.default.PropTypes.bool,
  style: _react2.default.PropTypes.object
};

var InternalObjectValuePropType = _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.object, _react2.default.PropTypes.bool, _react2.default.PropTypes.number, _react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf([_react2.default.PropTypes.bool, _react2.default.PropTypes.number, _react2.default.PropTypes.string])]).isRequired;

var ReactObjectForm = function (_React$Component) {
  _inherits(ReactObjectForm, _React$Component);

  function ReactObjectForm() {
    _classCallCheck(this, ReactObjectForm);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ReactObjectForm).apply(this, arguments));
  }

  _createClass(ReactObjectForm, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var object = _props.object;
      var config = _props.config;
      var id = _props.id;

      var rest = _objectWithoutProperties(_props, ['object', 'config', 'id']);

      var configtmp = {};
      configtmp.config = config;
      //obey PropTypes
      configtmp.name = id ? id : "objEd";
      configtmp = Object.assign({}, config, configtmp);
      return _react2.default.createElement(
        'form',
        { className: configtmp.name + '-form' },
        _react2.default.createElement(BaseFormRenderer, _extends({}, rest, configtmp, { id: configtmp.name, object: object }))
      );
    }
  }]);

  return ReactObjectForm;
}(_react2.default.Component);

ReactObjectForm.propTypes = {
  object: _react2.default.PropTypes.object.isRequired,
  config: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape(PropertyConfig)),
  changeHandler: _react2.default.PropTypes.func,
  id: _react2.default.PropTypes.string.isRequired
};
var GenericValueInput = exports.GenericValueInput = function GenericValueInput(_ref) {
  var value = _ref.value;
  var id = _ref.id;
  var name = _ref.name;
  var placeholder = _ref.placeholder;
  var changeHandler = _ref.changeHandler;
  var disabled = _ref.disabled;

  var rest = _objectWithoutProperties(_ref, ['value', 'id', 'name', 'placeholder', 'changeHandler', 'disabled']);

  var internalChangeHandler = function internalChangeHandler(event) {
    return changeHandler(event.target.value);
  };
  return _react2.default.createElement('input', {
    id: id + "-input",
    className: (disabled ? "disabled" : "") + ' form-control generic-value-input',
    type: 'text',
    value: value,
    onChange: internalChangeHandler,
    placeholder: placeholder,
    disabled: disabled ? "disabled" : null
  });
};
GenericValueInput.propTypes = _extends({}, PropertyConfig, {
  value: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf([_react2.default.PropTypes.number, _react2.default.PropTypes.string])]),
  config: _react2.default.PropTypes.shape(PropertyConfig) });

var BooleanValueInput = exports.BooleanValueInput = function BooleanValueInput(_ref2) {
  var value = _ref2.value;
  var id = _ref2.id;
  var name = _ref2.name;
  var placeholder = _ref2.placeholder;
  var changeHandler = _ref2.changeHandler;
  var disabled = _ref2.disabled;

  var rest = _objectWithoutProperties(_ref2, ['value', 'id', 'name', 'placeholder', 'changeHandler', 'disabled']);

  var internalChangeHandler = function internalChangeHandler(event) {
    return changeHandler(event.target.checked);
  };
  return _react2.default.createElement('input', _extends({}, rest, {
    id: id + "-input",
    className: (disabled ? "disabled" : "") + ' form-control boolean-value-input',
    type: 'checkbox',
    checked: value ? "checked" : null,
    value: name,
    name: name,
    onChange: internalChangeHandler,
    disabled: disabled ? "disabled" : null }));
};
BooleanValueInput.propTypes = _extends({}, PropertyConfig, {
  value: _react2.default.PropTypes.bool,
  config: _react2.default.PropTypes.shape(PropertyConfig)
});

var FieldRenderer = exports.FieldRenderer = function FieldRenderer(_ref3) {
  var name = _ref3.name;
  var id = _ref3.id;
  var object = _ref3.object;
  var caption = _ref3.caption;
  var label = _ref3.label;

  var rest = _objectWithoutProperties(_ref3, ['name', 'id', 'object', 'caption', 'label']);

  return _react2.default.createElement(
    'div',
    { className: 'form-group' },
    _react2.default.createElement(
      'label',
      { id: id + "-label" },
      label ? label : name
    ),
    _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(BaseFormRenderer, _extends({}, rest, { id: id, name: name, object: object })),
      _react2.default.createElement(
        'span',
        { id: id + "-caption" },
        caption
      )
    )
  );
};
FieldRenderer.propTypes = {
  config: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape(PropertyConfig)),
  object: InternalObjectValuePropType,
  name: _react2.default.PropTypes.string.isRequired
};

var ObjectFormRenderer = exports.ObjectFormRenderer = function ObjectFormRenderer(_ref4) {
  var object = _ref4.object;
  var config = _ref4.config;
  var changeHandler = _ref4.changeHandler;
  var name = _ref4.name;
  var id = _ref4.id;

  var rest = _objectWithoutProperties(_ref4, ['object', 'config', 'changeHandler', 'name', 'id']);

  var childConfig = function childConfig(name) {
    return config ? config.find(function (currentConfig) {
      return currentConfig.name === name;
    }) : null;
  };

  var createChildChangeHandler = function createChildChangeHandler(name) {
    return function (newObjectValue) {
      if (childConfig(name) && childConfig(name).hasOwnProperty("changeHandler") && "function" == typeof childConfig(name).changeHandler) {
        childConfig(name).changeHandler(newObjectValue, changeHandler);
      } else {
        var changedObject = Object.assign({}, object);
        changedObject[name] = newObjectValue;
        changeHandler(changedObject);
      }
    };
  };

  var fields = Object.keys(object).filter(function (name) {
    var currchildConfig = childConfig(name);
    if (!currchildConfig) {
      return true;
    }
    return !currchildConfig.hide;
  }).map(function (childPropertyName) {
    var childPropertyConfig = childConfig(childPropertyName);
    var prefix = id && id != "" ? id + "-" : id;
    return _react2.default.createElement(FieldRenderer, _extends({}, rest, childPropertyConfig, {
      key: childPropertyName,
      id: prefix + childPropertyName,
      name: childPropertyName,
      object: object[childPropertyName],
      changeHandler: createChildChangeHandler(childPropertyName) }));
  });
  return _react2.default.createElement(
    'fieldset',
    { id: id + "-fieldset", style: { border: "1px solid grey", padding: "5px", borderRadius: "3px" } },
    fields
  );
};
ObjectFormRenderer.propTypes = {
  object: _react2.default.PropTypes.object,
  config: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape(PropertyConfig))
};

var SelectRenderer = exports.SelectRenderer = function SelectRenderer(_ref5) {
  var value = _ref5.value;
  var options = _ref5.options;
  var id = _ref5.id;
  var changeHandler = _ref5.changeHandler;
  var allowCustomValues = _ref5.allowCustomValues;
  var multi = _ref5.multi;

  var rest = _objectWithoutProperties(_ref5, ['value', 'options', 'id', 'changeHandler', 'allowCustomValues', 'multi']);

  var internalChangeHandler = function internalChangeHandler(values) {
    if (values) {
      if (Array.isArray(values)) {
        changeHandler(values.map(function (value) {
          return value.value ? value.value : null;
        }));
      } else {
        changeHandler(values.value ? values.value : null);
      }
    }
  };
  return _react2.default.createElement(_reactSelect2.default, {
    options: options,
    name: id + "-select",
    value: value,
    onChange: internalChangeHandler,
    multi: multi,
    allowCreate: allowCustomValues,
    clearable: allowCustomValues });
};

var MultiSelectRenderer = exports.MultiSelectRenderer = function MultiSelectRenderer(_ref6) {
  var value = _ref6.value;

  var rest = _objectWithoutProperties(_ref6, ['value']);

  return _react2.default.createElement(SelectRenderer, _extends({}, rest, { value: value, multi: Array.isArray(value) }));
};

var BaseFormRenderer = exports.BaseFormRenderer = function BaseFormRenderer(_ref7) {
  var object = _ref7.object;
  var config = _ref7.config;
  var name = _ref7.name;
  var options = _ref7.options;

  var rest = _objectWithoutProperties(_ref7, ['object', 'config', 'name', 'options']);

  //handle explicitly configured inputs

  if (options && Array.isArray(options)) {
    return _react2.default.createElement(MultiSelectRenderer, _extends({}, rest, config, { value: object, name: name, options: options }));
  }

  //handle generic cases
  var valueType = typeof object === 'undefined' ? 'undefined' : _typeof(object);

  switch (valueType) {
    case "object":
      return _react2.default.createElement(ObjectFormRenderer, _extends({}, rest, {
        config: config,
        object: object, name: name }));
    case "boolean":
      return _react2.default.createElement(BooleanValueInput, _extends({}, rest, config, { value: object, name: name }));
    default:
      return _react2.default.createElement(GenericValueInput, _extends({}, rest, config, { value: object, name: name }));

  }
};
BaseFormRenderer.propTypes = {
  object: InternalObjectValuePropType,
  config: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.arrayOf(_react2.default.PropTypes.shape(PropertyConfig)), _react2.default.PropTypes.shape(PropertyConfig)])
};

exports.default = ReactObjectForm;