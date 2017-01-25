import React          from 'react';
import ReactObjectForm  from '../ReactObjectForm';
import chai from 'chai'
import { render, mount } from 'enzyme'
import chaiString from 'chai-string'
const expect = chai.use(chaiString).expect;

describe("ReactObjectForm", () =>{
  it("should use configured custom component to render value inputs.",() => {
    
    const config = [{name: "name", component: ({value}) => <span className="veryCustom">{value}</span>}];
    
    const form = render(<ReactObjectForm object={{name: "foo"}} config={config}/>);
    expect(form.find("span").attr("class")).to.be.equal("veryCustom");
    expect(form.find("span").text()).to.be.equal("foo");
  });
});


