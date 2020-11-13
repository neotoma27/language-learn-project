import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';

class MCVocabularyQuestion {
    constructor(phrase, answerOptions, correctOption) {
        this.phrase = phrase;
        this.answerOptions = answerOptions;
        this.correctOption = correctOption;
    }
}

class MCSentenceQuestion {
    constructor(sentence, answerOptions, correctOption) {
        this.sentence = sentence;
        this.answerOptions = answerOptions;
        this.correctOption = correctOption;
    }
}

class AssemblingTranslationQuestion {
    constructor(sentence, wordOptions, translation) {
        this.sentence = sentence;
        this.wordOptions = wordOptions;
        this.translation = translation;
    }
}

class WritingTranslationQuestion {
    constructor(sentence, translation) {
        this.sentence = sentence;
        this.translation = translation;
    }
}

class PairsQuestion {
    constructor(pairs) {
        this.pairs = pairs;
    }
}

class LessonInformation {
    constructor(lessonName, questionsArray) {
        this.lessonName = lessonName;
        this.questionsArray = questionsArray;
    }
}

class LessonTopBar extends React.Component {
    render() {
        const questionNumber = this.props.questionNumber;

        return (
            <div>
                <div>
                    Quit Lesson
                </div>
                <div>
                    Question {questionNumber}
                </div>
            </div>
        );
    }
}

class MCAnswerOptionRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange() {
        this.props.onInputChange(this.props.optionNumber);
    }

    render() {
        const optionText = this.props.optionText;
        const optionIDValue = `option${this.props.optionNumber}`;
        const optionIsSelected = this.props.optionIsSelected;

        return (
            <li>
                <label>
                    {optionText}
                    <input
                        type="radio"
                        id={optionIDValue}
                        name="answerOption"
                        value={optionIDValue}
                        checked={optionIsSelected}
                        onChange={this.handleInputChange} />
                </label>
            </li>
        );
    }
}

class MCAnswerArea extends React.Component {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(optionNumber) {
        this.props.onInputChange(optionNumber);
    }

    render() {
        const options = this.props.answerOptions;
        const optionRadios = [];
        const selection = this.props.answerSelection;

        options.forEach((option, number) => {
            optionRadios.push(
                <MCAnswerOptionRow
                    optionText={option}
                    optionNumber={number + 1}
                    optionIsSelected={((number + 1) === selection)}
                    onInputChange={this.handleInputChange}
                    key={option} />
            );
        });

        return (
            <fieldset>
                <legend>Select</legend>
                <ul>
                    {optionRadios}
                </ul>
            </fieldset>
        );
    }
}

class WritingTranslationQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userAnswer: '', answerWasSubmitted: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({userAnswer: event.target.value});
    }

    handleSubmit(event) {
        this.setState({answerWasSubmitted: true});
        event.preventDefault();
    }

    render() {
        const sentence = this.props.sentence;
        const answer = this.props.answer;
        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Translate this sentence</h1>
                <p>{sentence}</p>
                <div>
                    <label>
                        Write answer:
                        <textarea value={this.state.answerText} onChange={this.handleChange} rows="10" cols="50" />
                    </label>
                </div>
                <AnswerFeedback
                    answerSelection={this.state.userAnswer}
                    answerWasSubmitted={this.state.answerWasSubmitted}
                    correctAnswer={answer} />
            </form>
        );
    }
}

class AnswerFeedback extends React.Component {
    render() {
        const answerSelection = this.props.answerSelection;
        const correctAnswer = this.props.correctAnswer;
        const answerWasSubmitted = this.props.answerWasSubmitted;

        let feedbackArea;
        if (!answerWasSubmitted) {
            feedbackArea =
                <p> <input type="submit" value="Submit Answer" /> </p>;
        } else {
            feedbackArea = (
                <p>
                    <p> {(answerSelection === correctAnswer) ? 'Correct' : 'Incorrect'} </p>
                    <p> <button>Continue</button> </p>
                </p>
            );
        }

        return (
            <section>{feedbackArea}</section>
        );
    }
}

class MCQuestionArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {answerSelection: 0, answerWasSubmitted: false};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(optionNumber) {
        this.setState({answerSelection: optionNumber});
    }

    handleSubmit(event) {
        this.setState({answerWasSubmitted: true});
        event.preventDefault();
    }

    render() {
        const questionText = this.props.question;
        const options = this.props.answerOptions;
        const selection = this.state.answerSelection;
        const answerWasSubmitted = this.state.answerWasSubmitted;
        const correctAnswer = this.props.correctAnswer;

        return (
            <form onSubmit={this.handleSubmit}>
                <section>
                    <p>{questionText}</p>
                    <MCAnswerArea
                        answerOptions={options}
                        answerSelection={selection}
                        onInputChange={this.handleInputChange} />
                </section>
                <AnswerFeedback
                    answerSelection={selection}
                    answerWasSubmitted={answerWasSubmitted}
                    correctAnswer={correctAnswer} />
            </form>
        );
    }
}

class LessonDisplay extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <LessonTopBar
                        questionNumber={this.props.questionNumber} />
                </div>
                <div>
                    <WritingTranslationQuestionDisplay
                        sentence={Q2.sentence}
                        answer={Q2.translation} />
                </div>
            </div>
        );
    }
}

class MenusTopBar extends React.Component {
    render() {
        return (
            <div>
                <p>Spanish</p>
                <p>69 Day Streak wow</p>
            </div>
        );
    }
}

class LessonSelectionDisplay extends React.Component {
    render() {
        return (
            <div>
                <div>Select Lesson</div>
                <div><button>People</button></div>
                <div><button>Animals</button></div>
                <div><button>Swear Words</button></div>
            </div>
        );
    }
}

class MenusBottomBar extends React.Component {
    render() {
        return (
            <div>
                <p><button>Lessons</button></p>
                <p><button>Stories</button></p>
                <p><button>Profile</button></p>
                <p><button>Leaderboards</button></p>
                <p><button>Shop</button></p>
            </div>
        );
    }
}

class MenuDisplay extends React.Component {
    render() {
        return (
            <div>
                <MenusTopBar />
                <LessonSelectionDisplay />
                <MenusBottomBar />
            </div>
        );
    }
}

class AppDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentDisplay: 'lessonSelectMenu', lessonID: 'menu'};

    }

    render() {
        const currentDisplay = this.state.currentDisplay;
        let display;
        switch (currentDisplay) {
            case 'lessonSelectMenu':
                display = <MenuDisplay />;
                break;
            case 'lessonDisplay':
                display = <LessonDisplay
                            lessonID={this.state.lessonID} />;
                break;
            default:
                display = <MenuDisplay />;
        }
        return (
            <div>{display}</div>
        );
    }
}

const QUESTION = 'Which of these means "the woman"?';
const ANSWER_OPTIONS = ['la niña', 'el hombre', 'la mujer', 'el niño'];
const CORRECT_ANSWER = 3;
const QUESTION_NUMBER = 2;
const Q1 = new MCVocabularyQuestion('Which of these means "the woman"?', ['la niña', 'el hombre', 'la mujer', 'el niño'], 3);
const Q2 = new WritingTranslationQuestion('You are very tall.', 'Tu eres muy alto.');
const Q3 = new MCVocabularyQuestion('Which of these means "the girl"?', ['el niño', 'la mujer', 'el hombre', 'la niña'], 4);
const LESSON_PEOPLE = new LessonInformation('People', [Q1, Q2, Q3]);

ReactDOM.render(
    <MenuDisplay />,
        document.getElementById('root')
);