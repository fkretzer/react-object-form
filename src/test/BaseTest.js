import React          from 'react';
import ReactObjectForm  from '../ReactObjectForm';
import { expect } from 'chai'
import { mount, render } from 'enzyme'

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
    expect(form.find("#objEd-name-body input").attr("value")).to.be.equal("Nike Floder");
    expect(form.find("#objEd-username-body input").attr("value")).to.be.equal("Katrin_Bussmann");
    expect(form.find("#objEd-email-body input").attr("value")).to.be.equal("Emilian20@yahoo.com");
    expect(form.find("#objEd-address-street-body input").attr("value")).to.be.equal("Krodinger Islands");
    expect(form.find("#objEd-address-suite-body input").attr("value")).to.be.equal("Suite 232");
    expect(form.find("#objEd-address-city-body input").attr("value")).to.be.equal("Dittmer land");
    expect(form.find("#objEd-address-zipcode-body input").attr("value")).to.be.equal("28357");
    expect(form.find("#objEd-address-geo-lat-body input").attr("value")).to.be.equal("79.8318");
    expect(form.find("#objEd-address-geo-lng-body input").attr("value")).to.be.equal("160.5794");
  });
});
