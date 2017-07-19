import React from "react";
import PropertyConfig from './ReactObjectForm';

class GenericValueInput extends React.Component {
  constructor(props) {
    super(props);
    this.internalChangeHandler = this.internalChangeHandler.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }
  
  internalChangeHandler(event){
    let returnValue = event.target.value;
    if (returnValue === ""){
      returnValue = null;
    }
    this.props.changeHandler(returnValue)
  }
  
  onBlur(){
    if (this.props.trim) {
      const returnValue = this.props.value ? this.props.value.trim() : null;
      
      this.internalChangeHandler({target: {value: returnValue}});
    }
  }
  
  render(){
    const {value,id, name, placeholder, changeHandler,disabled, ...rest} = this.props;
    return (
      <input
        id={id+"-input"}
        className={`${disabled ? "disabled": ""} form-control generic-value-input`}
        type="text"
        value={value}
        onChange={this.internalChangeHandler}
        onBlur={this.onBlur}
        placeholder={placeholder}
        disabled={disabled ? "disabled": null}
      />
    );
  }
}

GenericValueInput.propTypes = {
  ...PropertyConfig,
  value: React.PropTypes.oneOfType([
    React.PropTypes.number,
    React.PropTypes.string,
    React.PropTypes.arrayOf([
      React.PropTypes.number,
      React.PropTypes.string])
  ]),
  config: React.PropTypes.shape(PropertyConfig)};

export default GenericValueInput;