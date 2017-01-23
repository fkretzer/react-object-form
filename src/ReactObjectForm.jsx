import React from 'react';
import Select from 'react-select';


//Workaround. See -> https://phabricator.babeljs.io/T6777
typeof undefined;
let console = console ? console : {}
console.log = console.log ? console.log : () => {};

//TODO: Make all components configurable by checking for component override via config


//Base shape for property config
const PropertyConfig =
{
  //Property key in Object
  name: React.PropTypes.string.isRequired,
  //If property is a child-object configs for its properties can be supplied
  config: React.PropTypes.arrayOf(React.PropTypes.shape(PropertyConfig)),
  //Possible values for this property
  options: React.PropTypes.array,
  //true if property can contain values which are not listed in "options"
  allowCustomValues: React.PropTypes.bool,
  //true if form field should be read-only
  disabled: React.PropTypes.bool,
  placeholder: React.PropTypes.string,
  label: React.PropTypes.string,
  //TODO: concept / implement
  validator: React.PropTypes.func,
  caption: React.PropTypes.string,
  changeHandler: React.PropTypes.func,
  hide: React.PropTypes.bool
};

const InternalObjectValuePropType = React.PropTypes.oneOfType([
  React.PropTypes.object,
  React.PropTypes.bool,
  React.PropTypes.number,
  React.PropTypes.string,
  React.PropTypes.arrayOf([
    React.PropTypes.bool,
    React.PropTypes.number,
    React.PropTypes.string])]).isRequired;

class ReactObjectForm extends React.Component {
  
  static propTypes = {
    object: React.PropTypes.object.isRequired,
    config: React.PropTypes.arrayOf(React.PropTypes.shape(PropertyConfig)),
    changeHandler: React.PropTypes.func,
    id: React.PropTypes.string
  };
  
  render(){
    let {object, config, id, ...rest } = this.props;
    let configtmp = {};
    configtmp.config = config;
    //obey PropTypes
    configtmp.name = id ? id : "react-object";
    configtmp = Object.assign({},config, configtmp);
    return(
      <form className={`${configtmp.name}-form`}>
  <BaseFormRenderer {...rest} {...configtmp} id={configtmp.name} object={object} />
      </form>
  )
  }
}
export const GenericValueInput = ({value,id, name, placeholder, changeHandler,disabled, ...rest}) => {
  let internalChangeHandler = (event) => changeHandler(event.target.value);
  return(
    <input
  id={id+"-input"}
  className={`${disabled ? "disabled": ""} form-control generic-value-input`}
  type="text"
  value={value}
  onChange={internalChangeHandler}
  placeholder={placeholder}
  disabled={disabled ? "disabled": null}
    />
)
};
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

export const BooleanValueInput = ({value, id, name, placeholder, changeHandler,disabled, ...rest}) => {
  let internalChangeHandler = (event) => changeHandler(event.target.checked);
  return(
    <input {...rest}
  id={id+"-input"}
  className={`${disabled ? "disabled": ""} form-control boolean-value-input`}
  type="checkbox"
  checked={value ? "checked" : null}
  value={name}
  name={name}
  onChange={internalChangeHandler}
  disabled={disabled ? "disabled": null}/>);
};
BooleanValueInput.propTypes = {
  ...PropertyConfig,
  value: React.PropTypes.bool,
  config: React.PropTypes.shape(PropertyConfig)
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
    } else if (value === ""){
      this.setState({value: Number.NaN})
      this.props.changeHandler(Number.NaN);
    }
  }
  
  
  render(){
    const { value, ...rest } = this.props;
    return(<GenericValueInput {...rest}
                              value={Number.isNaN(value) ? "" : this.state.value}
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
    labelString = firstLetter.toLocaleUpperCase()+rest.join("");
  }
  
  return(
    <div className="form-group">
    <label>{labelString}</label>
    <div>
    <BaseFormRenderer {...rest} id={id} name={name}  object={object}  />
    <span>{caption}</span>
    </div>
    </div>
)
};
FieldRenderer.propTypes = {
  config: React.PropTypes.arrayOf(React.PropTypes.shape(PropertyConfig)),
  object: InternalObjectValuePropType,
  name: React.PropTypes.string.isRequired
};

export const ObjectFormRenderer = ({object, config, changeHandler,name,id, ...rest}) => {
  
  const childConfig = (name) => {
    return config ? config.find((currentConfig) => currentConfig.name === name) : null;
  };
  
  const createChildChangeHandler = (name) => (newObjectValue) => {
    if (childConfig(name) && childConfig(name).hasOwnProperty("changeHandler") && "function" == typeof childConfig(name).changeHandler){
      childConfig(name).changeHandler(newObjectValue, changeHandler);
    } else {
      let changedObject = Object.assign({}, object);
      changedObject[name] = newObjectValue;
      changeHandler(changedObject);
    }
  };
  let fields = [] ;
  if (object){
    fields = Object.keys(object)
      .filter((name) => {
        let currchildConfig = childConfig(name);
        if(! currchildConfig){
          return true;
        }
        return !currchildConfig.hide;
      })
      .map((childPropertyName) => {
        const childPropertyConfig = childConfig(childPropertyName);
        const prefix = id && id != "" ? id+"-" : id;
        return(
          <FieldRenderer {...rest} {...childPropertyConfig}
            key={childPropertyName}
            id={prefix+childPropertyName}
            name={childPropertyName}
            object={object[childPropertyName]}
            changeHandler={createChildChangeHandler(childPropertyName)}/>)
      });
  }

  return(
    <fieldset id={id+"-fieldset"}>
  {fields}
</fieldset>
)
};
ObjectFormRenderer.propTypes = {
  object:React.PropTypes.object,
  config: React.PropTypes.arrayOf(React.PropTypes.shape(PropertyConfig))
};




export const SelectRenderer = ({value, options, id, changeHandler, allowCustomValues, multi, placeholder,...rest}) => {
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
  const transformedOptions = options.map(option => typeof option === "object" ? option : {label: option, value: option});
  
  return(
    <Select
  options={transformedOptions}
  name={id+"-select"}
  value={value}
  onChange={internalChangeHandler}
  multi={multi}
  allowCreate={allowCustomValues}
  clearable={allowCustomValues}
  placeholder={placeholder ? placeholder : "Select.."}
  {...rest}/>
);
};

export const MultiSelectRenderer = ({value, ...rest}) => {
  return(<SelectRenderer {...rest}  value={value} multi={true}/>);
};


export const BaseFormRenderer = ({object,config, name, options, ...rest}) => {
  //handle explicitly configured inputs
  
  
  
  
  //handle generic cases
  const valueType = typeof object;
  if (object === null){
    return(<GenericValueInput {...rest} {...config} value={""} name={name}/>)
  }
  switch (valueType){
    case "number":
      return(<NumberValueInput {...rest} {...config} value={object} name={name}/>)
    case "object":
      if (Array.isArray(object)){
        return (<MultiSelectRenderer {...rest} {...config} value={object} name={name} options={options ? options : []} />);
      }
      return(<ObjectFormRenderer
    {...rest}
      config={config}
      object={object} name={name}  />);
    case "boolean":
      return(<BooleanValueInput {...rest} {...config} value={object} name={name}/>);
    
    case "string":
      //if there are options configured, use SelectRenderer
      if (options && Array.isArray(options)){
        return(<SelectRenderer {...rest} {...config} value={object} name={name} options={options} />)
      }
    default:
      return(<GenericValueInput {...rest} {...config} value={object} name={name}/>)
    
  }
};
BaseFormRenderer.propTypes = {
  object: InternalObjectValuePropType,
  config: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.shape(PropertyConfig)),
    React.PropTypes.shape(PropertyConfig)
  ])
};


export default ReactObjectForm;
