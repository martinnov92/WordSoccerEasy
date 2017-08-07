import React, { Component } from 'react';
import Sound from 'react-sound';
import './Game.css';
import './helpers.css';
import {select_sound} from './helpers.js';
import Timer from './Timer.js';

import sounds from './sounds.js';
import ball from './img/ball.png';
import Word from './Word.js';

const Words = require('./words.json');
var FontAwesome = require('react-fontawesome');

const SECONDS = 20;

class Game extends Component {
    constructor(props){
        super(props);


        this.state = {
            // is game on?
            playing: false,

            // time
            seconds: SECONDS,
            timerRun: true,

            // voices
            voices: true,

            // sounds
            sounds: true,
            soundStatus: 'stop',
            soundName: '',

            // display wordSoccer
            display: true,

            // words
            usedWords: [],
            Words: [],

            // score
            score: 0,
        };

        this.turnVoices = this.turnVoices.bind(this);
        this.turnSound = this.turnSound.bind(this);

        this.controlDisplay = this.controlDisplay.bind(this);

        this.setTime = this.setTime.bind(this);

        // handle time update from timer
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);

        // handle keys
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        // new game function
        this.newGame = this.newGame.bind(this);

        this.handleFinishedPlaying = this.handleFinishedPlaying.bind(this);
    }

    componentDidMount() {
        this.newGame();

        // add key listener
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    componentWillUnmount() {
        // remove key listener
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }

    // turn voices off/on
    turnVoices() {
        this.setState({
            voices: !this.state.voices
        }, () => !this.state.voices ? window.responsiveVoice.cancel() : window.responsiveVoice.speak(" ", "Czech Female"));

        this.buttonVoices.blur();
    }

    // turn sounds off/on
    turnSound() {
        this.setState({
            sounds: !this.state.sounds
        });       

        this.buttonSounds.blur();
    }

    // display controls - blind mode
    controlDisplay() {
        this.setState({
            display: !this.state.display
        });

        this.buttonDisplay.blur();
    }

    // timer update - to (in/de)crease actual time by specified time (seconds)
    setTime(currentTime, sec) {
        if (this.state.playing) {
            if ((currentTime + sec) > 60) {
                return 60;
            } else if ((currentTime - sec) < 0) {
                return 0;
            } else {
                return currentTime + sec;
            }
        } else {
            return 60;
        }
    }

    getWordIndex(words) {
        let word = Words.wordCs;
        for (let i = 0; i < word.length; i++) {
            if (word[i] === words) {
                return i;
            }
        }
    }

  // generate random word from array
    generateNewWord(Array) {
        let randomNumber = Math.floor(Math.random() * Array.length)+1;
        let generateWord = Array[randomNumber];
        return generateWord;
    }

    // change score when correct answer
    changeScore(num) {
        this.setState({
            score: this.state.score + num
        });
    }

    readWord () {
        const onEnd = () => {
            this.setState({
            });
        };
        if (!this.state.voices) return;
        window.responsiveVoice.speak(this.state.Words, "Czech Female",{onend:onEnd});
    }

    compareMyWords () {
        let { usedWords } = this.state;
        const copyArr = [...this.state.usedWords];
        const lastWord = usedWords[usedWords.length - 1];
        let newTime = 0;
        copyArr.pop();

        let comparing = true;

        const alreadyInArr = copyArr.indexOf(lastWord);

        if (usedWords.length > 1 && alreadyInArr >= 0) {
            const onEnd = () => {
                this.setState({
                    timerRun: true
                });
            };
            if (!this.state.voices) return;
            window.responsiveVoice.speak("Toto slovo jste už použili, zvolte si prosím jiné", "Czech Female", {onend: onEnd});
            document.getElementById("badWord").style.display = "flex";
            this.changeScore(-15);
            newTime = this.setTime(this.state.seconds, -7);
            this.handleTimeUpdate(newTime);
            this.setState({
                soundStatus: 'play',
                soundName: 'failure',
                timerRun: false
            });
            comparing = false;
        } else {
            document.getElementById("badWord").style.display = "none";
            comparing = true;
        }
        return comparing;
    }

    // compare last char array and first char array
    compareWord() {
        let myWords = this.state.usedWords;
        let activeWords = this.state.Words;
        let myStr = myWords[myWords.length - 1].toString();
        let activeStr = activeWords.toString();

        let myFirst = myStr.charAt(0).toLowerCase();
        let activeStringLength = activeStr.length;
        let generateLast = activeStr.charAt(activeStringLength -1);
        switch (generateLast) {
            case 'á':
                generateLast = 'a';
                break;

            case 'é':
                generateLast = 'e';
                break;

            case 'ě':
                generateLast = 'e';
                break;

            case 'í':
                generateLast = 'i';
                break;

            case 'ó':
                generateLast = 'o';
                break;

            case 'ú':
                generateLast = 'u';
                break;

            case 'ů':
                generateLast = 'u';
                break;

            case 'ý':
                generateLast = 'y';
                break;

            case 'ť':
                generateLast = 't';
                break;

            case 'ď':
                generateLast = 'd';
                break;

            case 'ň':
                generateLast = 'n';
                break;
        }
        let result;

        let words = Words.wordCs;
        words = words.map(v => v.toLowerCase());

       if(generateLast === myFirst) {
            const correctWord = words.filter((word) => word.startsWith(myFirst));
            if (correctWord.indexOf(myWords[myWords.length - 1]) >= 0) {
                result = true;
            }
       } else {
           result = false;
       }
        return result;
    }

    // handle keyDown - move player by 'Arrow keys', 'Alt' to read possible directions
    handleKeyDown(e) {
        /*if (!this.state.playing || !this.state.timerRun) {
            if (e.keyCode === 16) {
                e.preventDefault(); // cancel focus event from turn voices button
                this.newGame();
            } else {
                return;
            }
        }*/

        switch (e.keyCode) {
           /* case 16:
            default:
                // refresh
                if(e.keyCode === 16) {
                    e.preventDefault(); // cancel focus event from turn voices button
                    return this.newGame();
                }
            break;*/

            case 18: // alt read word
                if (e.keyCode === 18) {
                    e.preventDefault();
                    const onEnd = () => {
                        this.setState({
                            timerRun: true
                        });
                    };
                    if (!this.state.voices) return;
                    window.responsiveVoice.speak(this.state.Words, "Czech Female", {onend: onEnd});
                }
            break;

            case 13: // confirmation entered word
            if (e.keyCode === 13) {
                let newTime = 0;
                e.preventDefault();
                this.getValueInput();

                let myWords = this.state.usedWords;
                let myStr = myWords.toString();
                let myStrLength = myStr.length;
                let myLast = myStr.charAt(myStrLength -1);

                // fix working function for IE
                if (!String.prototype.startsWith) {
                    String.prototype.startsWith = function(searchString, position){
                        position = position || 0;
                        return this.substr(position, searchString.length) === searchString;
                    };
                }
                const lastCharWord = Words.wordCs.filter((word) => word.startsWith(myLast));
                if(this.compareWord() === true) {
                    newTime = this.setTime(this.state.seconds, 5);
                    this.changeScore(10);
                    this.handleTimeUpdate(newTime);
                    let comparing = this.compareMyWords();

                    if(comparing === true) {
                        let newWord = this.generateNewWord(lastCharWord);

                        this.setState({
                            soundStatus: 'play',
                            soundName: 'success',
                            Words: newWord
                        });
                        this.readWord();
                    }

                } else {
                    newTime = this.setTime(this.state.seconds, -2);
                    this.changeScore(-5);
                    this.handleTimeUpdate(newTime);
                    this.setState({
                        soundStatus: 'play',
                        soundName: 'failure',
                    });
                }

            }
            break;
        }
    }

    // get value from text input and save to state
    getValueInput () {
     let enteredWord  = document.getElementById('myWord').value;
     let myUsedWord = this.state.usedWords;
     myUsedWord.push(enteredWord);
     document.getElementById('myWord').value= "";
     return enteredWord;
    }

    // stop rotate ball
    stopRotate () {
       document.getElementById("ball").classList.remove("rotate");
    }

    // handle keyUp
    handleKeyUp(e) {
        if (!this.state.playing) return;
    }

    // handle finish sound playing
    handleFinishedPlaying() {
        this.setState({
            soundStatus: 'stop'
        });
    }

    // init new game
    newGame() {
        document.getElementById('ball').className += ' rotate';
        document.getElementById("myWord").disabled = false;
        let newWord = this.generateNewWord(Words.wordCs);
        let comparing = this.compareMyWords();


        this.setState({
            playing: true,
            seconds: SECONDS,
            timerRun: true,
            score: 0,
            Words: newWord
        }, () => {

            this.buttonRefresh.blur();

            this.readWord();
        });
    }

    // handle time update
    handleTimeUpdate(seconds) {
        this.setState({
            seconds
        });

        if (seconds === 3) {
            this.setState({
                soundStatus: 'play',
                soundName: 'tick',
            });
        } else if (seconds === 0 || seconds < 0) {
            this.setState({
                playing: false,
                timerRun: false
            });
            window.responsiveVoice.speak("Konec hry " + this.state.score + " bodů", "Czech Female");
            this.stopRotate();
            document.getElementById("myWord").disabled = true;
        }
    }

    render() {
        const {
            playing,
            timerRun,
            seconds,
            display,
            sounds: stateSounds,
            voices
        } = this.state;

        let iconVoices = voices ? <FontAwesome name='toggle-on' size='2x' /> : <FontAwesome name='toggle-off' size='2x' />;
        let iconSounds = stateSounds ? <FontAwesome name='volume-up' size='2x' /> : <FontAwesome name='volume-off' size='2x' />;
        let iconDisplay = display ? <FontAwesome name='eye-slash' size='4x' /> : <FontAwesome name='eye' size='4x' />;

        return (
            <div className="Game">
                <header>
                    {/* <h1>ProjectName<span>Easy</span></h1> */}

                    <div className="options">
                        <button onClick={this.newGame} ref={(buttonRefresh) => { this.buttonRefresh = buttonRefresh; }}>
                            <FontAwesome name='refresh' size='2x' />
                        </button>

                        <button onClick={this.turnSound} ref={(buttonSounds) => { this.buttonSounds = buttonSounds; }}>
                            {iconSounds}
                        </button>

                        <button className="speech-btn" onClick={this.turnVoices} ref={(buttonVoices) => { this.buttonVoices = buttonVoices; }}>
                            {iconVoices}
                            <span>číst</span>
                        </button>
                    </div>
                </header>

                <div className={display ? 'Playground__area' : 'Playground__area blur'}>
                    {
                        !this.state.display
                            ? <div className="overlay"/>
                            : null
                    }
                    <div id="badWord">
                        Toto slovo jste už použili, zvolte si prosím jiné
                    </div>

                    <div id="ball">
                        <img src={ball} alt="ball" />

                        <Word
                            value={this.state.Words}
                        />

                    </div>
                </div>
                <div className="word__container">
                    <form>
                        <input id="myWord" type="text" autoFocus={this}/>
                    </form>
                </div>

                <div className="options options-display">
                    <button onClick={this.controlDisplay} ref={(buttonDisplay) => this.buttonDisplay = buttonDisplay}>
                        {iconDisplay}
                    </button>
                </div>

                {
                    playing && seconds > 0
                    ? <Timer status={timerRun} duration={seconds} timeCallback={this.handleTimeUpdate} />
                    : null
                }

                {
                    !this.state.sounds || this.state.soundStatus !== 'play'
                    ? null
                    : (
                        <Sound
                            url={select_sound(sounds, this.state.soundName).url}
                            playStatus={'PLAYING'}
                            volume={100}
                            onFinishedPlaying={this.handleFinishedPlaying}
                        />
                    )
                }

                <div className="score">
                    {this.state.score}
                    <span> points</span>
                </div>

                <footer>
                    {/* Powered by <a href="http://evalue.cz/">eValue.cz</a> */}
                </footer>
            </div>
        );
    }
}

export default Game;