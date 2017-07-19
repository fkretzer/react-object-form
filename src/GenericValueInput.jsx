import React from 'react';
import PropertyConfig from './ReactObjectForm';
import PropTypes from 'prop-types';

class GenericValueInput extends React.Component {
    constructor(props) {
        super(props);
        this.internalChangeHandler = this.internalChangeHandler.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }
  
    internalChangeHandler(event){
        let returnValue = event.target.value;
        if (returnValue === ''){
            returnValue = null;
        }
        this.props.changeHandler(returnValue);
    }
  
    onBlur(){
        if (this.props.trim) {
            const returnValue = this.props.value ? this.props.value.trim() : null;
      
            this.internalChangeHandler({target: {value: returnValue}});
        }
    }
  
    render(){
        const {value,id, placeholder, disabled} = this.props;
        return (
            <input
                id={id+'-input'}
                className={`${disabled ? 'disabled': ''} form-control generic-value-input`}
                type="text"
                value={value}
                onChange={this.internalChangeHandler}
                onBlur={this.onBlur}
                placeholder={placeholder}
                disabled={disabled ? 'disabled': null}
            />
        );
    }
}

GenericValueInput.propTypes = {
    ...PropertyConfig,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.arrayOf([
            PropTypes.number,
            PropTypes.string])
    ]),
    config: PropTypes.shape(PropertyConfig)};

export default GenericValueInput;