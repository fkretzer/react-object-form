"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _ReactObjectForm = require("../ReactObjectForm");

var _ReactObjectForm2 = _interopRequireDefault(_ReactObjectForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("ReactObjectForm", function () {
  var _this = this;

  this.header("## ReactObjectForm compoent. Form from JSON."); // Markdown.
  var data = {
    "name": "Vern Schuster Dr.",
    "username": "Delores.Kerluke62",
    "email": "Burnice_Kiehn87@yahoo.com",
    "male": true,
    "address": {
      "street": "Eddy Blvd.",
      "suite": "Suite 381",
      "city": "Raynor land",
      "zipcode": "61031",
      "geo": {
        "lat": "-45.3177",
        "lng": "177.4623"
      }
    },
    "phone": "1-" + "544-246-0502",
    "website": "lorena.name",
    "company": {
      "name": "Murray, Hirthe and Parisian",
      "catchPhrase": "Decentralized systemic productivity",
      "bs": "plug-and-play utilize experiences"
    },
    "id": 10
  };

  var config = [];

  before(function () {
    // Runs when the Suite loads.
    // Use this to load your component-under-test.
    _this.component(_react2.default.createElement(_ReactObjectForm2.default, { object: data,
      config: config,
      id: "object-form-1" }));
  });

  it("reload", function () {
    _this.component(_react2.default.createElement(_ReactObjectForm2.default, {
      object: data,
      config: config,
      id: "object-form-1" }));
  });

  section("Config", function () {
    it("Hide name property", function () {
      _this.props({ config: [{
          name: "name",
          hide: true }] });
    });
    it("Change name label to NAME", function () {
      _this.props({ config: [{ name: "name", label: "NAME" }] });
    });
    it("Select from different streets", function () {
      var props = _this.props;
      _this.props({
        config: [{ name: "address", config: [{
            name: "street",
            options: [{ value: "street-1", label: "Street One" }, { value: "street-2", label: "Two Street" }],
            changeHandler: function changeHandler(value) {
              data.address.street = value;
              props({ data: data });
            } }] }]
      });
    });
    it("Set global change handler", () => {
      _this.props({changeHandler: (object) => {alert(object)}})
    });
  });
});