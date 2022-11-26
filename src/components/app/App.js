import './App.css';
import Historic from "../historic/historic";
import "../historic/historic.css";
import Keyboard from '../number-keyboard/number-keyboard';
import '../number-keyboard/number-keyboard.css';
import SideMenu from '../operation-buttons/side-menu';
import '../operation-buttons/side-menu.css';
import '../class-styles/buttons.css';
import Screen from "../screen/screen";
import "../screen/screen.css";
import '../class-styles/sections.css';

function App() {
  return (
    <div className="App">
      <div id='main-content'>
        <div id='historic'>
          <Historic />
        </div>
        <div id='calculator-container'>
          <div className="calculator">
            <Screen initial="0" />
            <div id='calculator-menu'>
              <Keyboard min={0} max={9} />
              <SideMenu operations="C,DEL,+,-,x,/,=" />
            </div>
          </div>
        </div>
      </div>
    </div>    
  );
}

export default App;
