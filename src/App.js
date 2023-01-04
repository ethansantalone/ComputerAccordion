// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import MIDISounds from 'midi-sounds-react';
// import { useState, useEffect } from 'react';

// function App(props) {

//   const playTestInstrument = () => {
//     MIDISounds.playChordNow(3, [60], 2.5);
//   }
//   const [keysPressed, setKeysPressed] = useState(new Set());
//   const removeKeysPressed = (event) => {
//     const { key } = event;
//     if (keysPressed.delete(key.toUpperCase())) {
//       setKeysPressed(new Set(keysPressed))
//     }
//   }
//   const addKeysPressed = (event) => {
//     const { key } = event;
//     if (event.repeat || key === "CapsLock" || key === "Tab" || key === " ") {
//       return
//     }
//     setKeysPressed(new Set(keysPressed.add(key.toUpperCase())))
//   }
//   const accordion_buttons = [
//     [['g0', 'F2'], ['a#0', 'F3'], ['c#1', 'F4'], ['e1', 'F5'], ['g1', 'F6'], ['a#1', 'F7'], ['c#2', 'F8'], ['e2', 'F9'], ['g2', 'F10'], ['a#2', 'F11'], ['c#3', 'F12']],
//     [['a0', '3'], ['c1', '4'], ['d#1', '5'], ['f#1', '6'], ['a1', '7'], ['c2', '8'], ['d#2', '9'], ['f#2', '0'], ['a2', '-'], ['c3', '=']],
//     [['g#0', 'W'], ['b0', 'E'], ['d1', 'R'], ['f1', 'T'], ['g#1', 'Y'], ['b1', 'U'], ['d2', 'I'], ['f2', 'O'], ['g#2', 'P'], ['b2', '['], ['d3', ']']],
//     [['g0', 'A'], ['a#0', 'S'], ['c#1', 'D'], ['e1', 'F'], ['g1', 'G'], ['a#1', 'H'], ['c#2', 'J'], ['e2', 'K'], ['g2', 'L'], ['a#2', ';'], ['c#3', '\''], ['e3', 'ENTER']],
//     [['a0', 'Z'], ['c1', 'X'], ['d#1', 'C'], ['f#1', 'V'], ['a1', 'B'], ['c2', 'N'], ['d#2', 'M'], ['f#2', ','], ['a2', '.'], ['c3', '/'], ['d#3', 'SHIFT']]
//   ]

//   useEffect(() => {
//     window.addEventListener('keydown', addKeysPressed);
//     window.addEventListener('keyup', removeKeysPressed);
//     return () => {
//       window.removeEventListener('keydown', addKeysPressed);
//       window.removeEventListener('keyup', removeKeysPressed);
//     };
//   }, []);

//   console.log(keysPressed);

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h3>Mac Keyboard Accordion</h3>
//         {
//                 accordion_buttons.map((value, index) => {
//                     return <div className="Accordion-keyboard-rows">
//                         <br />
//                         {value.map((value, index) => {
//                             return <div className={keysPressed.has(value[1])?'Accordion-keyboard-keys-pressed':'Accordion-keyboard-keys'}>
//                                 <div className='note'>{value[0]}</div>
//                                 <div className='key'>{value[1]}</div>
//                             </div>
//                         })}
//                     </div>
//                 })
//             }
//       </header>
//       <p className="App-intro">Press Play to play instrument sound.</p>
//       <p><button onClick={playTestInstrument.bind(this)}>Play</button></p>
//       <MIDISounds ref={(ref) => (MIDISounds = ref)} appElementName="root" instruments={[3]} />
//     </div>
//   );
// }


// export default App;

import React from 'react';
import './Accordion.css';
import './App.css';
import MIDISounds from 'midi-sounds-react';

const pitchMappings = {
  'F2': 7 + 12 * 2,
  'F3': 10 + 12 * 2,
  'F4': 1 + 12 * 3,
  'F5': 4 + 12 * 3,
  'F6': 7 + 12 * 3,
  'F7': 10 + 12 * 3,
  'F8': 1 + 12 * 4,
  'F9': 4 + 12 * 4,
  'F10': 7 + 12 * 4,
  'F11': 10 + 12 * 4,
  'F12': 1 + 12 * 5,

  '3': 9 + 12 * 2,
  '4': 0 + 12 * 3,
  '5': 3 + 12 * 3,
  '6': 6 + 12 * 3,
  '7': 9 + 12 * 3,
  '8': 0 + 12 * 4,
  '9': 3 + 12 * 4,
  '0': 6 + 12 * 4,
  '-': 9 + 12 * 4,
  '=': 0 + 12 * 5,

  'A': 7 + 12 * 2,
  'W': 8 + 12 * 2,
  'Z': 9 + 12 * 2,
  'S': 10 + 12 * 2,
  'E': 11 + 12 * 2,
  'X': 0 + 12 * 3,
  'D': 1 + 12 * 3,
  'R': 2 + 12 * 3,
  'C': 3 + 12 * 3,
  'F': 4 + 12 * 3,
  'T': 5 + 12 * 3,
  'V': 6 + 12 * 3,
  'G': 7 + 12 * 3,
  'Y': 8 + 12 * 3,
  'B': 9 + 12 * 3,
  'H': 10 + 12 * 3,
  'U': 11 + 12 * 3,
  'N': 0 + 12 * 4,
  'J': 1 + 12 * 4,
  'I': 2 + 12 * 4,
  'M': 3 + 12 * 4,
  'K': 4 + 12 * 4,
  'O': 5 + 12 * 4,
  ',': 6 + 12 * 4,
  'L': 7 + 12 * 4,
  'P': 8 + 12 * 4,
  '.': 9 + 12 * 4,
  ';': 10 + 12 * 4,
  '[': 11 + 12 * 4,
  '/': 0 + 12 * 5,
  '\'': 1 + 12 * 5,
  ']': 2 + 12 * 5,
  'SHIFT': 3 + 12 * 5,
  'ENTER': 4 + 12 * 5,

}

class App extends React.Component {

  constructor() {
    super()

    this.state = {
      keysPressed: new Set(),
      productRetrieved: false,
    }
  }

  removeKeysPressed = (event) => {
    const { key } = event;
    if (this.state.keysPressed.delete(key.toUpperCase())) {
      this.setState({ keysPressed: new Set(this.state.keysPressed) })
    }
  }

  addKeysPressed = (event) => {
    const { key } = event;
    if (event.repeat || key === "CapsLock" || key === "Tab" || key === " ") {
      return
    }
    this.playTestInstrument(key.toUpperCase())
    this.setState({ keysPressed: new Set(this.state.keysPressed.add(key.toUpperCase())) })
  }

  playTestInstrument = (pitch) => {
    if (pitchMappings.hasOwnProperty(pitch)) {
      console.log(pitchMappings[pitch])
      this.midiSounds.playChordNow(192, [pitchMappings[pitch]], .25);
    }
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.addKeysPressed, false);
    document.addEventListener('keyup', this.removeKeysPressed, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.addKeysPressed, false);
    document.removeEventListener('keyup', this.removeKeysPressed, false);
  }

  render() {

    const accordion_buttons = [
      [['g0', 'F2'], ['a#0', 'F3'], ['c#1', 'F4'], ['e1', 'F5'], ['g1', 'F6'], ['a#1', 'F7'], ['c#2', 'F8'], ['e2', 'F9'], ['g2', 'F10'], ['a#2', 'F11'], ['c#3', 'F12']],
      [['a0', '3'], ['c1', '4'], ['d#1', '5'], ['f#1', '6'], ['a1', '7'], ['c2', '8'], ['d#2', '9'], ['f#2', '0'], ['a2', '-'], ['c3', '=']],
      [['g#0', 'W'], ['b0', 'E'], ['d1', 'R'], ['f1', 'T'], ['g#1', 'Y'], ['b1', 'U'], ['d2', 'I'], ['f2', 'O'], ['g#2', 'P'], ['b2', '['], ['d3', ']']],
      [['g0', 'A'], ['a#0', 'S'], ['c#1', 'D'], ['e1', 'F'], ['g1', 'G'], ['a#1', 'H'], ['c#2', 'J'], ['e2', 'K'], ['g2', 'L'], ['a#2', ';'], ['c#3', '\''], ['e3', 'ENTER']],
      [['a0', 'Z'], ['c1', 'X'], ['d#1', 'C'], ['f#1', 'V'], ['a1', 'B'], ['c2', 'N'], ['d#2', 'M'], ['f#2', ','], ['a2', '.'], ['c3', '/'], ['d#3', 'SHIFT']]
    ]

    console.log(this.state.keysPressed);

    return (
      <div className="App">
        <header className="App-header">
          <h3>Mac Keyboard Accordion</h3>
          {
            accordion_buttons.map((value, index) => {

              return <div className="Accordion-keyboard-rows">
                <br />
                {value.map((value, index) => {

                  const keyType = (value[0].includes('#') ? '-dark' : '')

                  return <div className={this.state.keysPressed.has(value[1]) ? 'Accordion-keyboard-keys-pressed' + keyType : 'Accordion-keyboard-keys' + keyType}>
                    <div className='note'>{value[0]}</div>
                    <div className='key'>{value[1]}</div>
                  </div>
                })}
              </div>
            })
          }
        <div className="bottom"><MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="root" instruments={[192]} /></div>
        </header>
      </div>
    );
  }
}

export default App;