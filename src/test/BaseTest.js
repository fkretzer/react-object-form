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

describe('ReactObjectForm', function(){
  it('should render correct amount of input elements for properties', function(){
    let form = render(
      <ReactObjectForm object={data} />
    );
    expect(form.find("input")).to.have.length(9);
  });
  
  it('should render inputs with correct value for every property', function(){
    let form = render(
      <ReactObjectForm object={data} />
    );
    expect(form.find("fieldset input").eq(0).attr("value")).to.be.equal("Nike Floder");
    expect(form.find("fieldset input").eq(1).attr("value")).to.be.equal("Katrin_Bussmann");
    expect(form.find("fieldset input").eq(2).attr("value")).to.be.equal("Emilian20@yahoo.com");
    expect(form.find("fieldset input").eq(3).attr("value")).to.be.equal("Krodinger Islands");
    expect(form.find("fieldset fieldset input").eq(1).attr("value")).to.be.equal("Suite 232");
    expect(form.find("fieldset fieldset input").eq(2).attr("value")).to.be.equal("Dittmer land");
    expect(form.find("fieldset fieldset input").eq(3).attr("value")).to.be.equal("28357");
    expect(form.find("fieldset fieldset fieldset input").eq(0).attr("value")).to.be.equal("79.8318");
    expect(form.find("fieldset fieldset fieldset input").eq(1).attr("value")).to.be.equal("160.5794");
  });
  
  it('should hide nested properties based on config.', function(){
    const config = [{name: "address", config:[{name: "geo", config:[{name: "lat", hide: true}]}]}];
    const form = render(<ReactObjectForm object={data} config={config}/>);
    expect(form.find("input")).to.have.length(8);
    
  });
  
  it('should hide address property based on config.', function(){
    const config = [{name: "address", hide: true}];
    const form = render(<ReactObjectForm object={data} config={config}/>);
    expect(form.find("input")).to.have.length(3);
  });
  
  it('should disable inputs based on config.', function () {
    const config = [{name: "email", disabled: true}];
    const form = render(<ReactObjectForm object={data} config={config}/>)
    
    expect(form.find("input")).to.have.length(9);
    expect(form.find("input").eq(0).attr("disabled")).to.exist;
  });
  
  it('should use select input if there are options configured.', function () {
    const data = {address: {street: "a-street"}};
    const config = [{name: "address", config:[{name: "street", options: [
      {label: "A Street", value: "a-street"},
      {label: "B Street", value: "b-street"}
    ]}]}];
    
    const form = mount(<ReactObjectForm object={data} config={config}/>);
    
    expect(form.find(".Select-value-label").text()).to.startWith("A Street");
    
    form.setProps({object: {address: {street: "b-street"}} });
      
    expect(form.find(".Select-value-label").text()).to.startWith("B Street");
  });
  
  it('should use select input if object is null and there are options configured.', function () {
    const data = {address: {street: null}};
    const config = [{name: "address", config:[{name: "street", options: [
      {label: "A Street", value: "a-street"},
      {label: "B Street", value: "b-street"}
    ]}]}];
    
    const form = mount(<ReactObjectForm object={data} config={config}/>);
    expect(form.find("Select").get(0)).not.to.be.undefined;
      
    form.setProps({object: {address: {street: "b-street"}} });
      
    expect(form.find(".Select-value-label").text()).to.startWith("B Street");
  });
  
  it('should use select input if there are options without labels configured.', function () {
    const data = {address: {street: "A Street"}};
    const config = [{name: "address", config:[{name: "street", options: [
      "A Street", "B Street"
    ]}]}];
    
    const form = mount(<ReactObjectForm object={data} config={config}/>);
    expect(form.find(".Select-value-label").text()).to.startWith("A Street");
    
    form.setProps({object: {address: {street: "B Street"}} });
    
    expect(form.find(".Select-value-label").text()).to.startWith("B Street");
  });
  
  it('should render fields in configured order', ()=>{
    const data = {foo: "b", bar: "a"};
    const config = [{name: "bar"},{name: "foo"}];
    const form = render(<ReactObjectForm object={data} config={config}/>);
    
    expect(form.find("fieldset input").eq(0).attr("value")).to.be.equal("a");
    expect(form.find("fieldset input").eq(1).attr("value")).to.be.equal("b");
  });
});
