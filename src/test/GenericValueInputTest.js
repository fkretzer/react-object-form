import React          from 'react';
import ReactObjectForm  from '../ReactObjectForm';
import chai from 'chai'
import { render, mount } from 'enzyme'
import chaiString from 'chai-string'
const expect = chai.use(chaiString).expect;


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
  
  it("Change handler should return 0 when entered.",() => {
    let changedValueTest;
    const changeHandler = changedValue => {changedValueTest = changedValue};
    const form = mount(<ReactObjectForm object={{someString: "foo"}} changeHandler={changeHandler} id="null-form"/>);
    form.find("input").simulate('change', {target: {value: ""}});
    expect(changedValueTest.someString).to.be.null;
    
  });
});
    
    
    