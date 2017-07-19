import React from 'react';
import Select from 'react-select';
import GenericValueInput from './GenericValueInput';
import PropTypes from 'prop-types';

//Workaround. See -> https://phabricator.babeljs.io/T6777
typeof undefined;
let console = console ? console : {};
console.log = console.log ? console.log : () => {};

//TODO: Make all components configurable by checking for component override via config

const InternalObjectValuePropType = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string,
    PropTypes.arrayOf([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.string])]);

//Base shape for property config
const PropertyConfig =
{
    //Property key in Object
    name: PropTypes.string.isRequired,
    //If property is a child-object configs for its properties can be supplied
    config: PropTypes.arrayOf(PropTypes.shape(PropertyConfig)),
    //Possible values for this property
    options: PropTypes.array,
    //true if property can contain values which are not listed in "options"
    allowCustomValues: PropTypes.bool,
    //true if form field should be read-only
    disabled: PropTypes.bool,
    clearable: PropTypes.bool,
    resetValue: PropTypes.shape({label: PropTypes.string,  option: InternalObjectValuePropType}),
    placeholder: PropTypes.string,
    label: PropTypes.string,
    //TODO: concept / implement
    validator: PropTypes.func,
    caption: PropTypes.string,
    changeHandler: PropTypes.func,
    hide: PropTypes.bool,
    trim: PropTypes.bool
};

class ReactObjectForm extends React.Component {
  
  static propTypes = {
      object: PropTypes.object.isRequired,
      config: PropTypes.arrayOf(PropTypes.shape(PropertyConfig)),
      changeHandler: PropTypes.func,
      id: PropTypes.string
  };
  
  render(){
      let {object, config, id, ...rest } = this.props;
      let configtmp = {};
      configtmp.config = config;
      //obey PropTypes
      configtmp.name = id ? id : 'react-object';
      configtmp = Object.assign({},config, configtmp);
      return(
          <form className={`${configtmp.name}-form`}>
              <BaseFormRenderer {...rest} {...configtmp} id={configtmp.name} object={object} />
          </form>
      );
  }
}

export const BooleanValueInput = ({value, id, name, placeholder, changeHandler,disabled, ...rest}) => {
    let internalChangeHandler = (event) => changeHandler(event.target.checked);
    return(
        <input {...rest}
            id={id+'-input'}
            className={`${disabled ? 'disabled': ''} form-control boolean-value-input`}
            type="checkbox"
            checked={value ? 'checked' : null}
            value={name}
            name={name}
            onChange={internalChangeHandler}
            disabled={disabled ? 'disabled': null}/>);
};
BooleanValueInput.propTypes = {
    ...PropertyConfig,
    value: PropTypes.bool,
    config: PropTypes.shape(PropertyConfig)
};


export class NumberValueInput extends React.Component {
    constructor(props){
        super(props);
        this.state = {value: props.value};
        this.numberParsingChangeHandler = this.numberParsingChangeHandler.bind(this);
    }
  
    componentWillReceiveProps(next){
        if (next.value != this.state.value){
            this.setState({value: next.value});
        }
    }
  
    numberParsingChangeHandler(value){
        this.setState({value: value});
        const parsed = Number.parseFloat(value);
        if (Number.isFinite(parsed)){
            this.props.changeHandler(parsed);
        } else if (value === ''){
            this.setState({value: Number.NaN});
            this.props.changeHandler(Number.NaN);
        }
    }
  
  
    render(){
        const { value, ...rest } = this.props;
        return(<GenericValueInput {...rest}
            value={Number.isNaN(value) ? '' : this.state.value}
            changeHandler={this.numberParsingChangeHandler}/>);
    }
}




export const FieldRenderer = ({name,id, object, caption, label, ...rest}) => {
    //Use capitalized field name as label if not set
    let labelString;
    if (label){
        labelString = label;
    } else {
        const [firstLetter, ...rest] = name;
        labelString = firstLetter.toLocaleUpperCase()+rest.join('');
    }
  
    return(
        <div className="form-group">
            <label>{labelString}</label>
            <div>
                <BaseFormRenderer {...rest} id={id} name={name}  object={object}  />
                <span>{caption}</span>
            </div>
        </div>
    );
};
FieldRenderer.propTypes = {
    config: PropTypes.arrayOf(PropTypes.shape(PropertyConfig)),
    object: InternalObjectValuePropType,
    name: PropTypes.string.isRequired
};

export const ObjectFormRenderer = ({object, config, changeHandler,name,id, ...rest}) => {
  
    const childConfig = (name) => {
        return config ? config.find((currentConfig) => currentConfig.name === name) : null;
    };
  
    const createChildChangeHandler = (name) => (newObjectValue) => {
        if (childConfig(name) && childConfig(name).hasOwnProperty('changeHandler') && 'function' == typeof childConfig(name).changeHandler){
            childConfig(name).changeHandler(newObjectValue, changeHandler);
        } else {
            let changedObject = Object.assign({}, object);
            changedObject[name] = newObjectValue;
            changeHandler(changedObject);
        }
    };
    //add configured fields in configured order
    const objectFields = Object.keys(object);
    let fields = config ? config.map(c => c.name) : [];
    //add remaining fields without config
    objectFields.forEach(f => {
        if (!fields.includes(f)){
            fields.push(f);
        }
    });
  
    fields = fields.filter((name) => {
        let currchildConfig = childConfig(name);
        if(! currchildConfig){
            return true;
        }
        return !currchildConfig.hide;
    })
        .map((childPropertyName) => {
            const childPropertyConfig = childConfig(childPropertyName);
            const prefix = id && id != '' ? id+'-' : id;
            return(
                <FieldRenderer {...rest} {...childPropertyConfig}
                    key={childPropertyName}
                    id={prefix+childPropertyName}
                    name={childPropertyName}
                    object={object[childPropertyName]}
                    changeHandler={createChildChangeHandler(childPropertyName)}/>);
        });

    return(
        <fieldset id={id+'-fieldset'}>
            {fields}
        </fieldset>
    );
};
ObjectFormRenderer.propTypes = {
    object:PropTypes.object,
    config: PropTypes.arrayOf(PropTypes.shape(PropertyConfig))
};




export const SelectRenderer = ({value, options, id, changeHandler, allowCustomValues, multi, placeholder, resetValue, ...rest}) => {
    let internalChangeHandler = (values) => {
        if (values){
            if (Array.isArray(values)){
                changeHandler(values.map((value) => {return value.value ? value.value : null;} ));
            } else {
                changeHandler(values.value ? values.value : null);
            }
        }
    };
  
    //transform options if not in correct form
    const transformedOptions = options.map(option => typeof option === 'object' ? option : {label: option, value: option});
  
    //default behaviour of react-select is to use clearable = true, but to make this work a resetValue
    //in the correct format is needed
  
  
    return(
        <Select
            {...rest}
            options={transformedOptions}
            name={id+'-select'}
            value={value}
            onChange={internalChangeHandler}
            multi={multi}
            resetValue={resetValue ? resetValue : {label: '', value: null}}
            allowCreate={allowCustomValues}
            placeholder={placeholder ? placeholder : 'Select..'}
        />
    );
};

export const MultiSelectRenderer = ({value, ...rest}) => {
    return(<SelectRenderer {...rest}  value={value} multi={true}/>);
};


export const BaseFormRenderer = ({object,config, name, options, component: Component, ...rest}) => {
    //TODO: handle explicitly configured inputs
    if (Component){
        return(<Component {...rest} value={object} name={name} config={config} />);
    }
  
    //handle generic cases
    const valueType = typeof object;
  
    if (options && Array.isArray(options)){
        return(<SelectRenderer {...rest} {...config} value={object} name={name} options={options} />);
    }
  
    if (object === null && !options){
        return(<GenericValueInput trim {...rest} {...config} value={''} name={name}/>);
    }
    switch (valueType){
        case 'number':
            return(<NumberValueInput {...rest} {...config} value={object} name={name}/>);
        case 'object':
            if (Array.isArray(object)){
                return (<MultiSelectRenderer {...rest} {...config} value={object} name={name} options={options ? options : []} />);
            }
            return(<ObjectFormRenderer
                {...rest}
                config={config}
                object={object} name={name}  />);
        case 'boolean':
            return(<BooleanValueInput {...rest} {...config} value={object} name={name}/>);
    
        case 'string':
            //if there are options configured, use SelectRenderer
            if (options && Array.isArray(options)){
                return(<SelectRenderer {...rest} {...config} value={object} name={name} options={options} />);
            }
            break;
        default:
            return(<GenericValueInput trim {...rest} {...config} value={object} name={name}/>);
    
    }
};
BaseFormRenderer.propTypes = {
    object: InternalObjectValuePropType,
    config: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.shape(PropertyConfig)),
        PropTypes.shape(PropertyConfig)
    ])
};


export default ReactObjectForm;
export { PropertyConfig };