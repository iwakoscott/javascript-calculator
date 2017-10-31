import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function clearance(value){
  // in: String
  // out: String
  var isNeg = parseFloat(value) < 0;
  var valueAsArr = value.split('');
  var decimalLoc = valueAsArr.indexOf('.');
  var hasDecimal =  decimalLoc > 0 ? true : false;
  var inputLength = hasDecimal ? valueAsArr.length - 1 : valueAsArr.length;

  if (!hasDecimal) {
    return value.slice(0, 16);
  } // value does not have decimal

  else {
    var front = value.slice(0, decimalLoc);

    if (front.length + 1 > 16) {
      alert('DIGIT LIMIT REACHED.');
      return '0';
    } // if the front is larger than the screen allowance then digit limit met.

    var trimmed = front;
    var back = value.slice(decimalLoc + 1, value.length);
    console.log("front = " + front);
    console.log("back = " + back);
    return trimmed + '.' + back.slice(0, 16 - (trimmed.length + 1));
  } // value does NOT have decimal
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

        if (valueOnScreen.length < 15) {
          if (valueOnScreen == '0') {
            valueOnScreen = type;
          } // if value on screen is zero
          else {
            valueOnScreen += type;
          } // otherwise value on screen > 0

          this.setState({
            valueOnScreen,
          });
        }

        break;
      } //switch
  } // handleClick
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
