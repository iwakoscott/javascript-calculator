import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function clearance(value){
  var valueAsArr = value.split('');

  if (valueAsArr.length > 14) {
    if (valueAsArr.indexOf('.') > 0) {
      return parseFloat(value).toFixed(2);
    }
    else {
      return valueAsArr.slice(0, 15).join('');
    }
  }

  else {
    return value;
  }
}

function calculate(x, y, operation) {
  var returnValue = 0;
  x = parseFloat(x);
  y = parseFloat(y);
  switch (operation) {

    case '+':
      returnValue = x + y;
      break;

    case '*':
      returnValue = x * y;
      break;

    case '-':
      returnValue = x - y;
      break;

    case '/':
      returnValue = y === 0 ? NaN : x / y;
      break;

    default:
      returnValue = null;
      break;
  }
  return String(returnValue);
}


function Button(props) {
  return (
    <button className="button btn-primary" onClick={props.onClick}>{props.value}</button>
  );
}

class Buttons
extends Component {

  renderButton(type) {
    return (
      <Button value={type} onClick={() => {this.props.onClick(type)}}/>
    );
  }

  render() {
    return (
      <div className="buttons">
        <div className="calc-row-main">
          {this.renderButton('AC')}
          {this.renderButton('+/-')}
          {this.renderButton('/')}
          {this.renderButton('ON')}
        </div>
        <div className="calc-row">
          {this.renderButton('7')}
          {this.renderButton('8')}
          {this.renderButton('9')}
          {this.renderButton('*')}
        </div>
        <div className="calc-row">
          {this.renderButton('4')}
          {this.renderButton('5')}
          {this.renderButton('6')}
          {this.renderButton('-')}
        </div>
        <div className="calc-row">
          {this.renderButton('1')}
          {this.renderButton('2')}
          {this.renderButton('3')}
          {this.renderButton('+')}
        </div>
        <div className="calc-row">
          {this.renderButton('0')}
          {this.renderButton('%')}
          {this.renderButton('.')}
          {this.renderButton('=')}
        </div>
      </div>
    );
  }
}

class Calculator
extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
      cache: null,
      valueOnScreen: '',
      currentOperation: null,
      staged: '',
      stagedOperation: '',
      startNewCalc: false,
    };

  }

  render() {
    return (
      <div className="calculator">
        <div className="calc-window">
          <h1 className="on-screen">
            {this.state.valueOnScreen}
          </h1>
        </div>
        <div className="calc-body">
          <Buttons onClick={(type) => this.handleClick(type)}/>
        </div>
      </div>
    );
  } // render

  handleClick(type) {

    const isOn = this.state.isOn;
    var valueOnScreen = this.state.valueOnScreen;
    var staged = this.state.staged;
    var stagedOperation = this.state.stagedOperation;
    var currentOperation = this.state.currentOperation;
    var startNewCalc = this.state.startNewCalc;

    valueOnScreen = clearance(valueOnScreen);

    if (!isOn && type !== 'ON'){
      return;
    }

    else {
      this.setState({
        isOn: true,
      });
    }

    switch(type) {

      case 'ON':
        valueOnScreen = isOn ? '' : '0';
        currentOperation = '';
        stagedOperation = '';
        this.setState({
          valueOnScreen: valueOnScreen,
          isOn: !isOn,
          currentOperation,
          stagedOperation,
        });
        break;

      case 'AC':
        valueOnScreen = '0';
        staged = '0';
        currentOperation = '';
        stagedOperation = '';
        this.setState({
          valueOnScreen,
          staged,
          currentOperation,
          stagedOperation,
        });
        break;

      case '+/-':
        valueOnScreen = clearance(String(-1 * parseFloat(valueOnScreen)));
        staged = valueOnScreen;
        this.setState({
          valueOnScreen,
          staged,
        });
        break;

      case '%':
        valueOnScreen = clearance(String(parseFloat(valueOnScreen)/100));
        //staged = valueOnScreen;
        this.setState({
          valueOnScreen,
          //staged,
        });
        break;

      case '.':
        if (currentOperation || startNewCalc) {
          startNewCalc = false;
          valueOnScreen = '0.';
          this.setState({
            stagedOperation: currentOperation,
            currentOperation: '',
            startNewCalc,
          });
        }

        else if ( !(/\./g).test(valueOnScreen) ) {
          valueOnScreen += '.';
        } // if valueOnScreen isnt already a decimal value

        this.setState({
          valueOnScreen,
        });
        break;

      case '+':
      case '-':
      case '/':
      case '*':

        if (stagedOperation) {
          staged = clearance(calculate(staged, valueOnScreen, stagedOperation));
          currentOperation = type;
          stagedOperation = '';
          this.setState({
            currentOperation,
            staged,
            stagedOperation,
          });
          break;
        }

        currentOperation = type;
        staged = valueOnScreen;
        this.setState({
          currentOperation,
          staged,
        });
        break;

      case '=':
        if (stagedOperation) {
          valueOnScreen = clearance(calculate(staged, valueOnScreen, stagedOperation));
          stagedOperation = '';
          staged = '';
          this.setState({
            valueOnScreen,
            staged,
            stagedOperation,
            startNewCalc: true,
          });
        } // if stagedOperation
        break;

      default:

        if (currentOperation || startNewCalc) {
          startNewCalc = false;
          stagedOperation = currentOperation;
          currentOperation = '';
          valueOnScreen = type;
          this.setState({
            stagedOperation,
            currentOperation,
            valueOnScreen,
            startNewCalc,
          });
          break;
        } // if we have selected an operation and then we click a number

        if (valueOnScreen == '0') {
          valueOnScreen = type;
        } // if value on screen is zero
        else {
          valueOnScreen += type;
        } // otherwise value on screen > 0

        this.setState({
          valueOnScreen,
        });

        break;
      } //switch
  } // handleClick
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
