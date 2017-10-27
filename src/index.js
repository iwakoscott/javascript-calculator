import React, { Component } from 'react';
import ReactDOM from 'react-dom';

function Button(props) {
  return (
    <button className="button" onClick={props.onClick}>{props.value}</button>
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
        <div className="calc-row">
          {this.renderButton('CLEAR')}
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
      staged: 0,
    };
  }

  render() {
    return (
      <div className="calculator">
        <div className="calc-window">
          <h1>
            {this.state.valueOnScreen}
          </h1>
        </div>
        <div className="calc-body">
          <Buttons onClick={(type) => this.handleClick(type)}/>
        </div>
      </div>
    );
  }

  handleClick(type) {

    const valueOnScreen = this.state.valueOnScreen;
    const staged = this.state.staged;
    const cache = this.state.cache;
    const currentOperation = this.state.currentOperation;

    switch(type) {
      case 'ON':
        this.setState({
          isOn: !this.state.isOn,
          valueOnScreen: !this.state.isOn ? '0' : '',
          currentOperation: null,
          staged: null,
        });
        break;
      default:
        break;
    }

    if (this.state.isOn) {
      switch (type) {
      case 'ON':
        this.setState({
          isOn: !this.state.isOn,
          valueOnScreen: !this.state.isOn ? '0' : '',
          currentOperation: null,
        });
        break;
      case 'CLEAR':
        this.setState({
          valueOnScreen: '0',
          currentOperation: null,
          staged: null,
        });
        break;
      case '+/-':
        this.setState({
          valueOnScreen: String(parseFloat(this.state.valueOnScreen)*-1),
        });
        break;
      case '%':
        this.setState({
          valueOnScreen: String(parseFloat(this.state.valueOnScreen)/100),
        });
        break;
      case '/':
        if (staged === null) {
          this.setState({
            staged: cache,
            currentOperation: type,
            valueOnScreen: cache,
          });
        } else {
          const calculation = cache / valueOnScreen;
          this.setState({
            staged: calculation,
            currentOperation: null,
            valueOnScreen: calculation,
          });
        }
        break;
      case '*':
        this.setState({
          currentOperation: type,
        });
        break;
      case '-':
        this.setState({
          currentOperation: type,
        });
        break;
      case '+':
        this.setState({
          currentOperation: type,
        });
        break;
      case '.':
        if (this.state.valueOnScreen.split('').indexOf('.') < 0){
          const valueOnScreen = this.state.valueOnScreen + '.';
          this.setState({
            valueOnScreen: valueOnScreen,
            cache: valueOnScreen,
          });
        }
        break;
      case '=':
        break;
      default:
        var value;
        if((!(/0\.[0-9]*/g).test(valueOnScreen) && !parseInt(valueOnScreen)) || currentOperation) {
          value = type;
          this.setState({
            cache: value,
            valueOnScreen: value,
          });
        } else {
          value = this.state.valueOnScreen + type;
          this.setState({
            cache: value,
            valueOnScreen: value,
          });
        }
        break;
      }
    }
  }
}


ReactDOM.render(
  <Calculator />,
  document.getElementById('root')
);
