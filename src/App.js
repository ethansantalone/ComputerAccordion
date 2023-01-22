import React from 'react';
import './Accordion.css';
import './App.css';
import MIDISounds from 'midi-sounds-react';
import SelectSearch from 'react-select-search';
import './ReactSelect.css';
// import background_img from './green-leafed-plant-2560x1600.jpg';
import background_img from './Grayscale-tree.webp';


const keys = new Set([
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '0',
  '-',
  '=',
  'A',
  'W',
  'Z',
  'S',
  'E',
  'X',
  'D',
  'R',
  'C',
  'F',
  'T',
  'V',
  'G',
  'Y',
  'B',
  'H',
  'U',
  'N',
  'J',
  'I',
  'M',
  'K',
  'O',
  ',',
  'L',
  'P',
  '.',
  ';',
  '[',
  '/',
  '\'',
  ']',
  'SHIFT',
  'ENTER',
])

class App extends React.Component {

  constructor(props) {
    super(props)

    this.midiNotes = [];
    this.state = {
      octave: 2,
      pitchMappingVar: this.createKeyboardVariable(2),
      selectedInstrument: 8,
      status: '?',
      keysPressed: new Set(),
      productRetrieved: false,
      size: 's'
    };
  }

  componentDidMount() {
    this.envelopes = [];
    this.startListening();
    document.addEventListener('keydown', this.addKeysPressed, false);
    document.addEventListener('keyup', this.removeKeysPressed, false);
  }

  onSelectInstrument(e) {
    this.setState({
      selectedInstrument: e
    });
    this.midiSounds.cacheInstrument(e);
  }

  createSelectItems() {
    if (this.midiSounds) {
      if (!(this.items)) {
        this.items = [];
        for (let i = 0; i < this.midiSounds.player.loader.instrumentKeys().length; i++) {
          // this.items.push(<option key={i} value={i}>{'' + (i + 0) + '. ' + this.midiSounds.player.loader.instrumentInfo(i).title}</option>);
          this.items.push({ name: '' + (i + 0) + '. ' + this.midiSounds.player.loader.instrumentInfo(i).title, value: i });
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
        if (keys.has(upperCaseKey)) {

          let pitch

          pitchMappings.forEach((noteRowArrays) => {
            noteRowArrays.forEach((noteArrays) => {
              if (noteArrays[0] === upperCaseKey) {
                pitch = noteArrays[1]
              }
            })
          })

          this.keyUp(pitch)
          // this.keyUp(initialPitchMapping[upperCaseKey])
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
      if (keys.has(upperCaseKey)) {
        let pitch
        pitchMappings.forEach((noteRowArrays) => {
          noteRowArrays.forEach((noteArrays) => {
            if (noteArrays[0] === upperCaseKey) {
              pitch = noteArrays[1]
            }
          })
        })
        this.keyDown(pitch)
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
      else if (key === "ArrowUp") {
        if (this.state.octave === 6) {
          return
        }
        this.setState({ octave: 6 }, this.setState({ pitchMappingVar: this.createKeyboardVariable(6) }))
      } else if (key === "ArrowDown") {
        if (this.state.octave === 2) {
          return
        }
        this.setState({ octave: 2 }, this.setState({ pitchMappingVar: this.createKeyboardVariable(2) }))
      }

    }
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.addKeysPressed, false);
    document.removeEventListener('keyup', this.removeKeysPressed, false);
  }

  createKeyboardVariable = (octave) => {

    const pitchMappings = [
      [
        ['F2', 7 + 12 * octave, "g" + octave],
        ['F3', 10 + 12 * octave, "a#" + octave],
        ['F4', 1 + 12 * (octave + 1), "c#" + (octave + 1)],
        ['F5', 4 + 12 * (octave + 1), "e" + (octave + 1)],
        ['F6', 7 + 12 * (octave + 1), "g" + (octave + 1)],
        ['F7', 10 + 12 * (octave + 1), "a#" + (octave + 1)],
        ['F8', 1 + 12 * (octave + 2), "c#" + (octave + 2)],
        ['F9', 4 + 12 * (octave + 2), "e" + (octave + 2)],
        ['F10', 7 + 12 * (octave + 2), "g" + (octave + 2)],
        ['F11', 10 + 12 * (octave + 2), "a#" + (octave + 2)],
        ['F12', 1 + 12 * (octave + 3), "c#" + (octave + 3)],
      ],
      [
        ['3', 9 + 12 * octave, "a" + octave],
        ['4', 0 + 12 * (octave + 1), "c" + (octave + 1)],
        ['5', 3 + 12 * (octave + 1), "d#" + (octave + 1)],
        ['6', 6 + 12 * (octave + 1), "f#" + (octave + 1)],
        ['7', 9 + 12 * (octave + 1), "a" + (octave + 1)],
        ['8', 0 + 12 * (octave + 2), "c" + (octave + 2)],
        ['9', 3 + 12 * (octave + 2), "d#" + (octave + 2)],
        ['0', 6 + 12 * (octave + 2), "f#" + (octave + 2)],
        ['-', 9 + 12 * (octave + 2), "a" + (octave + 2)],
        ['=', 0 + 12 * (octave + 3), "c" + (octave + 3)],
      ],
      [
        ['W', 8 + 12 * octave, "g#" + octave],
        ['E', 11 + 12 * octave, "b" + octave],
        ['R', 2 + 12 * (octave + 1), "d" + (octave + 1)],
        ['T', 5 + 12 * (octave + 1), "f" + (octave + 1)],
        ['Y', 8 + 12 * (octave + 1), "g#" + (octave + 1)],
        ['U', 11 + 12 * (octave + 1), "b" + (octave + 1)],
        ['I', 2 + 12 * (octave + 2), "d" + (octave + 2)],
        ['O', 5 + 12 * (octave + 2), "f" + (octave + 2)],
        ['P', 8 + 12 * (octave + 2), "g#" + (octave + 2)],
        ['[', 11 + 12 * (octave + 2), "b" + (octave + 2)],
        [']', 2 + 12 * (octave + 3), "d" + (octave + 3)],
      ],
      [
        ['A', 7 + 12 * octave, "g" + octave],
        ['S', 10 + 12 * octave, "a#" + octave],
        ['D', 1 + 12 * (octave + 1), "c#" + (octave + 1)],
        ['F', 4 + 12 * (octave + 1), "e" + (octave + 1)],
        ['G', 7 + 12 * (octave + 1), "g" + (octave + 1)],
        ['H', 10 + 12 * (octave + 1), "a#" + (octave + 1)],
        ['J', 1 + 12 * (octave + 2), "c#" + (octave + 2)],
        ['K', 4 + 12 * (octave + 2), "e" + (octave + 2)],
        ['L', 7 + 12 * (octave + 2), "g" + (octave + 2)],
        [';', 10 + 12 * (octave + 2), "a#" + (octave + 2)],
        ['\'', 1 + 12 * (octave + 3), "c#" + (octave + 3)],
        ['ENTER', 4 + 12 * (octave + 3), "e" + (octave + 3)],
      ],
      [
        ['Z', 9 + 12 * octave, "a" + octave],
        ['X', 0 + 12 * (octave + 1), "c" + (octave + 1)],
        ['C', 3 + 12 * (octave + 1), "d#" + (octave + 1)],
        ['V', 6 + 12 * (octave + 1), "f#" + (octave + 1)],
        ['B', 9 + 12 * (octave + 1), "a" + (octave + 1)],
        ['N', 0 + 12 * (octave + 2), "c" + (octave + 2)],
        ['M', 3 + 12 * (octave + 2), "d#" + (octave + 2)],
        [',', 6 + 12 * (octave + 2), "f#" + (octave + 2)],
        ['.', 9 + 12 * (octave + 2), "a" + (octave + 2)],
        ['/', 0 + 12 * (octave + 3), "c" + (octave + 3)],
        ['SHIFT', 3 + 12 * (octave + 3), "d#" + (octave + 3)],
      ]

    ]

    return pitchMappings;

  }
  onSelectChanged(value) {
    this.setState({
      size: value
    });
  }

  render() {

    const renderedKeyMappings = this.state.pitchMappingVar;

    return (
      <div className="App">
        <header className="App-header">

          <div className="App-top">
            Keyboardion
            <div className="Signature" onClick={() => window.open("http://www.ethansantalone.com")}>
              By Ethan Santalone
            </div>
          </div>
          <div className='App-main'>
            <div className='App-left'>

                 <img src={background_img} className="App-header-img" alt="background_img" />

                <div className='Accordion-keyboard'>
                  {

                    renderedKeyMappings.map((value, index) => {

                      return <div className="Accordion-keyboard-rows">
                        <br />
                        {value.map((value, index) => {

                          const keyType = (value[2].includes('#') ? '-dark' : '')

                          return <div className={this.state.keysPressed.has(value[0]) ? 'Accordion-keyboard-keys-pressed' + keyType : 'Accordion-keyboard-keys' + keyType}>
                            <div className='note'>{value[2]}</div>
                            <div className='key'>{value[0]}</div>
                          </div>

                        })}
                      </div>
                    })
                  }
                </div>
            </div>
            <div className="App-right">
              <SelectSearch
                value={this.state.selectedInstrument}
                onChange={this.onSelectInstrument.bind(this)}
                options={this.createSelectItems()}
                search={true}
              />
              <br />
              Left Arrow Key: 
              <br />
              Decrement Octave  
              <br /><br />
              Up Arrow Key: 
              <br />
              6nd Octave
              <br /><br />
              Right Arrow Key: 
              <br />
              Increment Octave 
              <br /><br />
              Down Arrow Key: 
              <br />
              2nd Octave
              <br />
              <br />
              <div className="Midi">
                <MIDISounds
                  ref={(ref) => (this.midiSounds = ref)}
                  appElementName="root"
                  instruments={[this.state.selectedInstrument]}
                />
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;