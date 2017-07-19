import React          from 'react';
import ReactObjectForm  from '../ReactObjectForm';
import chai from 'chai'
import { render, mount } from 'enzyme'
import chaiString from 'chai-string'
import GenericValueInput from '../GenericValueInput';
const expect = chai.use(chaiString).expect;

class TrimTestComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: this.props.value};
  }
  render(){
    return (
      <div>
        <GenericValueInput trim={this.props.trim} value={this.state.value} changeHandler={(newValue) => this.setState({value: newValue})} />
        <span id="output">{this.state.value}</span>
      </div>
    )
  }
}

class CompleteFormTrimTestComponent extends React.Component {
  constructor(props){
    super(props);
    this.state = {value: this.props.value};
  }
  
  render(){
    return (
      <div>
        <ReactObjectForm object={{value: this.state.value}} 
                         config={[{name: "value"}]} 
                         changeHandler={(newValue) => this.setState(newValue)} />
        <span id="output">{this.state.value}</span>
      </div>
    )
  }
}


let data = {
  "name": "Nike Floder",
  "username": "Katrin_Bussmann",
  "email": "Emilian20@yahoo.com",
  "address": {
    "street": "Krodinger Islands",
    "suite": "Suite 232",
    "city": "Dittmer land",
    "zipcode": "28357",
    "geo": {
      "lat": "79.8318",
      "lng": "160.5794"
    }}};
    

describe("GenericValueInput", () =>{
  it("Change handler should return null when an empty string is entered.",() => {
    let changedValueTest;
    const changeHandler = changedValue => {changedValueTest = changedValue};
    const form = mount(<ReactObjectForm object={{someString: "foo"}} changeHandler={changeHandler} id="null-form"/>);
    form.find("input").simulate('change', {target: {value: ""}});
    expect(changedValueTest.someString).to.be.null;
    
  });
  it("Input should return trimmed String.",() => {
    const TestComponent = mount(<TrimTestComponent trim value="FOO"/>);
    const input = TestComponent.find("input");
    const output = TestComponent.find("#output");
    input.simulate('change', {target: {value: "foo "}});
    expect(output.text()).to.equal("foo ");
    input.simulate('blur');
    expect(output.text()).to.equal("foo");
  });
  it("Input should not trim String",() => {
    const TestComponent = mount(<TrimTestComponent trim={false} value="FOO"/>);
    const input = TestComponent.find("input");
    const output = TestComponent.find("#output");
    input.simulate('change', {target: {value: "foo "}});
    expect(output.text()).to.equal("foo ");
    input.simulate('blur');
    expect(output.text()).to.equal("foo ");
  });
  it("Form should trim Strings by default.",() => {
    const TestComponent = mount(<CompleteFormTrimTestComponent value="FOO"/>);
    const input = TestComponent.find("input");
    const output = TestComponent.find("#output");
    input.simulate('change', {target: {value: "foo "}});
    expect(output.text()).to.equal("foo ");
    input.simulate('blur');
    expect(output.text()).to.equal("foo");
  });
});
    
    
    