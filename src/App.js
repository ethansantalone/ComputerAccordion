import React from 'react';
import './Accordion.css';
import './App.css';
import MIDISounds from 'midi-sounds-react';

let octave = 2;
const initialPitchMapping = {
  'F2': 7 + 12 * octave,
  'F3': 10 + 12 * octave,
  'F4': 1 + 12 * (octave + 1),
  'F5': 4 + 12 * (octave + 1),
  'F6': 7 + 12 * (octave + 1),
  'F7': 10 + 12 * (octave + 1),
  'F8': 1 + 12 * (octave + 2),
  'F9': 4 + 12 * (octave + 2),
  'F10': 7 + 12 * (octave + 2),
  'F11': 10 + 12 * (octave + 2),
  'F12': 1 + 12 * (octave + 3),

  '3': 9 + 12 * octave,
  '4': 0 + 12 * (octave + 1),
  '5': 3 + 12 * (octave + 1),
  '6': 6 + 12 * (octave + 1),
  '7': 9 + 12 * (octave + 1),
  '8': 0 + 12 * (octave + 2),
  '9': 3 + 12 * (octave + 2),
  '0': 6 + 12 * (octave + 2),
  '-': 9 + 12 * (octave + 2),
  '=': 0 + 12 * (octave + 3),

  'A': 7 + 12 * octave,
  'W': 8 + 12 * octave,
  'Z': 9 + 12 * octave,
  'S': 10 + 12 * octave,
  'E': 11 + 12 * octave,
  'X': 0 + 12 * (octave + 1),
  'D': 1 + 12 * (octave + 1),
  'R': 2 + 12 * (octave + 1),
  'C': 3 + 12 * (octave + 1),
  'F': 4 + 12 * (octave + 1),
  'T': 5 + 12 * (octave + 1),
  'V': 6 + 12 * (octave + 1),
  'G': 7 + 12 * (octave + 1),
  'Y': 8 + 12 * (octave + 1),
  'B': 9 + 12 * (octave + 1),
  'H': 10 + 12 * (octave + 1),
  'U': 11 + 12 * (octave + 1),
  'N': 0 + 12 * (octave + 2),
  'J': 1 + 12 * (octave + 2),
  'I': 2 + 12 * (octave + 2),
  'M': 3 + 12 * (octave + 2),
  'K': 4 + 12 * (octave + 2),
  'O': 5 + 12 * (octave + 2),
  ',': 6 + 12 * (octave + 2),
  'L': 7 + 12 * (octave + 2),
  'P': 8 + 12 * (octave + 2),
  '.': 9 + 12 * (octave + 2),
  ';': 10 + 12 * (octave + 2),
  '[': 11 + 12 * (octave + 2),
  '/': 0 + 12 * (octave + 3),
  '\'': 1 + 12 * (octave + 3),
  ']': 2 + 12 * (octave + 3),
  'SHIFT': 3 + 12 * (octave + 3),
  'ENTER': 4 + 12 * (octave + 3),
}

class App extends React.Component {

  constructor(props) {
    super(props)

    this.midiNotes = [];
    this.state = {
      octave: 2,
      pitchMappingVar: initialPitchMapping,
      selectedInstrument: 8,
      status: '?',
      keysPressed: new Set(),
      productRetrieved: false,
    };
  }

  componentDidMount() {
    this.envelopes = [];
    this.startListening();
    document.addEventListener('keydown', this.addKeysPressed, false);
    document.addEventListener('keyup', this.removeKeysPressed, false);
  }
  onSelectInstrument(e) {
    var list = e.target;
    let n = list.options[list.selectedIndex].getAttribute("value");
    this.setState({
      selectedInstrument: n
    });
    this.midiSounds.cacheInstrument(n);
  }

  createSelectItems() {
    if (this.midiSounds) {
      if (!(this.items)) {
        this.items = [];
        for (let i = 0; i < this.midiSounds.player.loader.instrumentKeys().length; i++) {
          this.items.push(<option key={i} value={i}>{'' + (i + 0) + '. ' + this.midiSounds.player.loader.instrumentInfo(i).title}</option>);
        }
      }
      return this.items;
    }
  }

  keyDown(n, v) {
    this.keyUp(n);
    var volume = 1;
    if (v) {
      volume = v;
    }
    this.envelopes[n] = this.midiSounds.player.queueWaveTable(this.midiSounds.audioContext
      , this.midiSounds.equalizer.input
      , window[this.midiSounds.player.loader.instrumentInfo(this.state.selectedInstrument).variable]
      , 0, n, 9999, volume);
    this.setState(this.state);
  }
  keyUp(n) {
    if (this.envelopes) {
      if (this.envelopes[n]) {
        this.envelopes[n].cancel();
        this.envelopes[n] = null;
        this.setState(this.state);
      }
    }
  }

  pressed(n) {
    if (this.envelopes) {
      if (this.envelopes[n]) {
        return true;
      }
    }
    return false;
  }

  midiOnMIDImessage(event) {
    var data = event.data;
    var type = data[0] & 0xf0;
    var pitch = data[1];
    var velocity = data[2];
    switch (type) {
      case 144:
        this.keyDown(pitch, velocity / 127);
        break;
      case 128:
        this.keyUp(pitch);
        break;
      default:
        break;
    }
  }

  onMIDIOnStateChange(event) {
    this.setState({ status: event.port.manufacturer + ' ' + event.port.name + ' ' + event.port.state });
  }

  requestMIDIAccessSuccess(midi) {
    console.log(midi);
    var inputs = midi.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      input.value.onmidimessage = this.midiOnMIDImessage.bind(this);
    }
    midi.onstatechange = this.onMIDIOnStateChange.bind(this);
  }

  requestMIDIAccessFailure(e) {
    console.log('requestMIDIAccessFailure', e);
    this.setState({ status: 'MIDI Access Failure' });
  }

  startListening() {
    this.setState({ status: 'waiting' });
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(this.requestMIDIAccessSuccess.bind(this), this.requestMIDIAccessFailure.bind(this));
    } else {
      this.setState({ status: 'navigator.requestMIDIAccess undefined' });
    }
  }

  removeKeysPressed = (event) => {
    if (event.key) {

      const pitchMappings = this.state.pitchMappingVar

      const { key } = event;
      if (this.state.keysPressed.delete(key.toUpperCase())) {
        this.setState({ keysPressed: new Set(this.state.keysPressed) })

        const upperCaseKey = key.toUpperCase()
        if (pitchMappings.hasOwnProperty(upperCaseKey)) {
          this.keyUp(pitchMappings[upperCaseKey])
        }
      }
    }
  }

  addKeysPressed = (event) => {
    if (event.key) {

      const pitchMappings = this.state.pitchMappingVar

      const { key } = event;
      if (event.repeat || key === "CapsLock" || key === "Tab" || key === " ") {
        return
      }

      const upperCaseKey = key.toUpperCase()
      if (pitchMappings.hasOwnProperty(upperCaseKey)) {
        this.keyDown(pitchMappings[upperCaseKey])
      }
      this.setState({ keysPressed: new Set(this.state.keysPressed.add(key.toUpperCase())) })

      if (key === "ArrowLeft") {
        if (this.state.octave === 0) {
          return
        }
        this.setState((prevState, props) => {
          return { octave: prevState.octave - 1 }
        }, this.setState({ pitchMappingVar: this.createKeyboardVariable(this.state.octave - 1) }))
      }
      else if (key === "ArrowRight") {
        if (this.state.octave === 6) {
          return
        }
        this.setState((prevState, props) => {
          return { octave: prevState.octave + 1 }
        }, this.setState({ pitchMappingVar: this.createKeyboardVariable(this.state.octave + 1) }))
      }

    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.addKeysPressed, false);
    document.removeEventListener('keyup', this.removeKeysPressed, false);
  }

  createKeyboardVariable = (octave) => {

    const pitchMappings = {
      'F2': 7 + 12 * octave,
      'F3': 10 + 12 * octave,
      'F4': 1 + 12 * (octave + 1),
      'F5': 4 + 12 * (octave + 1),
      'F6': 7 + 12 * (octave + 1),
      'F7': 10 + 12 * (octave + 1),
      'F8': 1 + 12 * (octave + 2),
      'F9': 4 + 12 * (octave + 2),
      'F10': 7 + 12 * (octave + 2),
      'F11': 10 + 12 * (octave + 2),
      'F12': 1 + 12 * (octave + 3),

      '3': 9 + 12 * octave,
      '4': 0 + 12 * (octave + 1),
      '5': 3 + 12 * (octave + 1),
      '6': 6 + 12 * (octave + 1),
      '7': 9 + 12 * (octave + 1),
      '8': 0 + 12 * (octave + 2),
      '9': 3 + 12 * (octave + 2),
      '0': 6 + 12 * (octave + 2),
      '-': 9 + 12 * (octave + 2),
      '=': 0 + 12 * (octave + 3),

      'A': 7 + 12 * octave,
      'W': 8 + 12 * octave,
      'Z': 9 + 12 * octave,
      'S': 10 + 12 * octave,
      'E': 11 + 12 * octave,
      'X': 0 + 12 * (octave + 1),
      'D': 1 + 12 * (octave + 1),
      'R': 2 + 12 * (octave + 1),
      'C': 3 + 12 * (octave + 1),
      'F': 4 + 12 * (octave + 1),
      'T': 5 + 12 * (octave + 1),
      'V': 6 + 12 * (octave + 1),
      'G': 7 + 12 * (octave + 1),
      'Y': 8 + 12 * (octave + 1),
      'B': 9 + 12 * (octave + 1),
      'H': 10 + 12 * (octave + 1),
      'U': 11 + 12 * (octave + 1),
      'N': 0 + 12 * (octave + 2),
      'J': 1 + 12 * (octave + 2),
      'I': 2 + 12 * (octave + 2),
      'M': 3 + 12 * (octave + 2),
      'K': 4 + 12 * (octave + 2),
      'O': 5 + 12 * (octave + 2),
      ',': 6 + 12 * (octave + 2),
      'L': 7 + 12 * (octave + 2),
      'P': 8 + 12 * (octave + 2),
      '.': 9 + 12 * (octave + 2),
      ';': 10 + 12 * (octave + 2),
      '[': 11 + 12 * (octave + 2),
      '/': 0 + 12 * (octave + 3),
      '\'': 1 + 12 * (octave + 3),
      ']': 2 + 12 * (octave + 3),
      'SHIFT': 3 + 12 * (octave + 3),
      'ENTER': 4 + 12 * (octave + 3),
    };

    return pitchMappings;

  }

  render() {

    console.log(this.state.octave)

    const accordion_buttons = [
      [['g0', 'F2'], ['a#0', 'F3'], ['c#1', 'F4'], ['e1', 'F5'], ['g1', 'F6'], ['a#1', 'F7'], ['c#2', 'F8'], ['e2', 'F9'], ['g2', 'F10'], ['a#2', 'F11'], ['c#3', 'F12']],
      [['a0', '3'], ['c1', '4'], ['d#1', '5'], ['f#1', '6'], ['a1', '7'], ['c2', '8'], ['d#2', '9'], ['f#2', '0'], ['a2', '-'], ['c3', '=']],
      [['g#0', 'W'], ['b0', 'E'], ['d1', 'R'], ['f1', 'T'], ['g#1', 'Y'], ['b1', 'U'], ['d2', 'I'], ['f2', 'O'], ['g#2', 'P'], ['b2', '['], ['d3', ']']],
      [['g0', 'A'], ['a#0', 'S'], ['c#1', 'D'], ['e1', 'F'], ['g1', 'G'], ['a#1', 'H'], ['c#2', 'J'], ['e2', 'K'], ['g2', 'L'], ['a#2', ';'], ['c#3', '\''], ['e3', 'ENTER']],
      [['a0', 'Z'], ['c1', 'X'], ['d#1', 'C'], ['f#1', 'V'], ['a1', 'B'], ['c2', 'N'], ['d#2', 'M'], ['f#2', ','], ['a2', '.'], ['c3', '/'], ['d#3', 'SHIFT']]
    ]

    return (
      <div className="App">
        <header className="App-header">
          <div className="Magnify">
            <div>
              <select id="brow" value={this.state.selectedInstrument} onChange={this.onSelectInstrument.bind(this)}>{this.createSelectItems()}</select>
              <br />
              Use Left and Right Arrow Keys to change octave number: {this.state.octave}
            </div>
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
            <div className="Midi">
              <MIDISounds
                ref={(ref) => (this.midiSounds = ref)}
                appElementName="root"
                instruments={[this.state.selectedInstrument]}
              />
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;