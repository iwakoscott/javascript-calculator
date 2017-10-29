import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function clearance(value){
  if (value.split('').length > 18) {
    console.log(value);
    alert('Digit limit met...');
    return '0';
  } else {
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
          startNewCalc: false,
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
          startNewCalc: false,
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
          startNewCalc: true,
          //staged,
        });
        break;

      case '.':
        if (currentOperation || startNewCalc) {
          valueOnScreen = '0.';
          this.setState({
            stagedOperation: currentOperation,
            currentOperation: '',
            startNewCalc: false,
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
        break;

      case '-':
        break;

      case '*':
        break;

      case '/':
        break;

      case '=':
        break;

      default:
        break;
      } //switch
  } // handleClick
}

ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
