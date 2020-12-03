import React from 'react';
import ReactDOM from 'react-dom';
import { nanoid } from 'nanoid';
import './index.css';
import { scryRenderedComponentsWithType } from 'react-dom/test-utils';

class MCVocabularyQuestion {
    constructor(phrase, answerOptions, correctAnswer) {
        this.phrase = phrase;
        this.answerOptions = answerOptions;
        this.correctAnswer = correctAnswer;
        
        this.optionIDsMap = new Map(answerOptions.map(option => [option, `option${nanoid()}`]));
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <MCVocabularyQuestionDisplay
                vocabularyPhrase={this.phrase}
                answerOptions={this.answerOptions}
                optionIDsMap={this.optionIDsMap}
                correctAnswer={this.correctAnswer}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class MCSentenceQuestion {
    constructor(sentence, answerOptions, correctAnswer) {
        this.sentence = sentence;
        this.answerOptions = answerOptions;
        this.correctAnswer = correctAnswer;
        
        this.optionIDsMap = new Map(answerOptions.map(option => [option, `option${nanoid()}`]));
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <MCSentenceQuestionDisplay
                sentence={this.sentence}
                answerOptions={this.answerOptions}
                optionIDsMap={this.optionIDsMap}
                correctAnswer={this.correctAnswer}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class AssemblingTranslationQuestion {
    constructor(sentence, wordOptions, translation) {
        this.sentence = sentence;
        this.wordOptions = wordOptions;
        this.translation = translation;

        this.optionIDsMap = new Map(wordOptions.map(option => [option, `option${nanoid()}`]));
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <AssemblingTranslationQuestionDisplay
                sentence={this.sentence}
                wordOptions={this.wordOptions}
                optionIDsMap={this.optionIDsMap}
                translation={this.translation}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class WritingTranslationQuestion {
    constructor(sentence, translation) {
        this.sentence = sentence;
        this.translation = translation;
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <WritingTranslationQuestionDisplay
                sentence={this.sentence}
                answer={this.translation}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class PairsQuestion {
    constructor(firstLanguageWords, targetLanguageWords, matches) {
        this.firstLanguageWords = firstLanguageWords;
        this.targetLanguageWords = targetLanguageWords;
        this.matches = matches;

        this.optionIDsMap = new Map((firstLanguageWords.concat(targetLanguageWords)).map(option => [option, `option${nanoid()}`]));
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <PairsQuestionDisplay
                firstLanguageWords={this.firstLanguageWords}
                targetLanguageWords={this.targetLanguageWords}
                matches={this.matches}
                optionIDsMap={this.optionIDsMap}
                handleNextQuestion={handleNextQuestionMethod} />
        );
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

class AnswerFeedback extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.handleNextQuestion();
    }

    render() {
        const userAnswer = this.props.userAnswer;
        const correctAnswer = this.props.correctAnswer;
        const answerWasSubmitted = this.props.answerWasSubmitted;

        let feedbackArea;
        if (!answerWasSubmitted) {
            feedbackArea =
                <div> <input type="submit" value="Submit Answer" /> </div>;
        } else {
            feedbackArea = (
                <div>
                    <div> {(userAnswer === correctAnswer) ? 'Correct' : 'Incorrect'} </div>
                    <div> <button onClick={this.handleClick}>Continue</button> </div>
                </div>
            );
        }

        return (
            <section>{feedbackArea}</section>
        );
    }
}

class MCQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(event) {
        this.props.handleInputChange(parseInt(event.target.value, 10));
    }

    handleSubmit(event) {
        this.props.handleSubmit();
        event.preventDefault();
    }

    handleNextQuestion() {
        this.props.handleNextQuestion();
    }

    render() {
        const options = this.props.answerOptions;
        const optionIDsMap = this.props.optionIDsMap;
        const correctAnswer = this.props.correctAnswer;
        const selection = this.props.answerSelection;
        const answerWasSubmitted = this.props.answerWasSubmitted;
        const instructions = this.props.instructions;
        const optionItems = options.map((optionText, number) =>
            <li key={optionIDsMap.get(optionText)}>
                <label>
                    {optionText}
                    <input
                        type="radio"
                        name="answerOption"
                        value={(number + 1)}
                        checked={((number + 1) === selection)}
                        onChange={this.handleInputChange} />
                </label>
            </li>
        );

        return (
            <form onSubmit={this.handleSubmit}>
                <section>
                    {instructions}
                    <fieldset>
                        <legend>Select</legend>
                        <ul>
                            {optionItems}
                        </ul>
                    </fieldset>
                </section>
                <AnswerFeedback
                    userAnswer={selection}
                    answerWasSubmitted={answerWasSubmitted}
                    correctAnswer={correctAnswer}
                    handleNextQuestion={this.handleNextQuestion} />
            </form>
        );
    }
}

class MCVocabularyQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {answerSelection: 0, answerWasSubmitted: false};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(selection) {
        this.setState({answerSelection: selection});
    }

    handleSubmit() {
        this.setState({answerWasSubmitted: true});
    }

    handleNextQuestion() {
        this.setState({answerSelection: 0, answerWasSubmitted: false});
        this.props.handleNextQuestion();
    }

    render() {
        const vocabularyPhrase = this.props.vocabularyPhrase;
        const options = this.props.answerOptions;
        const optionIDsMap = this.props.optionIDsMap;
        const correctAnswer = this.props.correctAnswer;
        const selection = this.state.answerSelection;
        const answerWasSubmitted = this.state.answerWasSubmitted;
        const instructions = <p>{`Which of these means "${vocabularyPhrase}"?`}</p>;

        return (
            <MCQuestionDisplay
                answerOptions={options}
                optionIDsMap={optionIDsMap}
                correctAnswer={correctAnswer}
                answerSelection={selection}
                answerWasSubmitted={answerWasSubmitted}
                instructions={instructions}
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                handleNextQuestion={this.handleNextQuestion} />
        );
    }
}

class MCSentenceQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {answerSelection: 0, answerWasSubmitted: false};

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(selection) {
        this.setState({answerSelection: selection});
    }

    handleSubmit() {
        this.setState({answerWasSubmitted: true});
    }

    handleNextQuestion() {
        this.props.handleNextQuestion();
    }

    render() {
        const sentence = this.props.sentence;
        const options = this.props.answerOptions;
        const optionIDsMap = this.props.optionIDsMap;
        const correctAnswer = this.props.correctAnswer;
        const selection = this.state.answerSelection;
        const answerWasSubmitted = this.state.answerWasSubmitted;
        const instructions = <div><h1>Select the correct translation</h1><p>{sentence}</p></div>;

        return (
            <MCQuestionDisplay
                answerOptions={options}
                optionIDsMap={optionIDsMap}
                correctAnswer={correctAnswer}
                answerSelection={selection}
                answerWasSubmitted={answerWasSubmitted}
                instructions={instructions}
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                handleNextQuestion={this.handleNextQuestion} />
        );
    }
}

class AssemblingTranslationQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userAnswer: [], answerWasSubmitted: false};

        this.handleAddWord = this.handleAddWord.bind(this);
        this.handleRemoveWord = this.handleRemoveWord.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleNextQuestion() {
        this.setState({userAnswer: '', answerWasSubmitted: false});
        this.props.handleNextQuestion();
    }

    handleAddWord(event) {
        const updatedAnswer = this.state.userAnswer.concat(event.target.value);
        this.setState({userAnswer: updatedAnswer});
    }

    handleRemoveWord(event) {
        const updatedAnswer = this.state.userAnswer.filter((word) => word !== event.target.value);
        this.setState({userAnswer: updatedAnswer});
    }

    handleSubmit(event) {
        this.setState({answerWasSubmitted: true});
        event.preventDefault();
    }

    render() {
        const sentence = this.props.sentence;
        const translation = this.props.translation;
        const wordOptions = this.props.wordOptions;
        const optionIDsMap = this.props.optionIDsMap;
        
        const userAnswer = this.state.userAnswer;
        const userAnswerSentence = `${userAnswer.join(' ')}.`;
        const userAnswerWordButtons = userAnswer.map((word) =>
            <button
                onClick={this.handleRemoveWord}
                key={`user${optionIDsMap.get(word)}`}
                value={word}>
                {word}
            </button>
        );
        const wordOptionButtons = wordOptions.map((word) =>
            <button
                onClick={this.handleAddWord}
                key={optionIDsMap.get(word)}
                value={word}
                disabled={userAnswer.includes(word)}>
                {word}
            </button>
        );
        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Translate this sentence</h1>
                <p>{sentence}</p>
                <div>
                    {userAnswerWordButtons}
                </div>
                <div>
                    {wordOptionButtons}
                </div>
                <AnswerFeedback
                    userAnswer={userAnswerSentence}
                    answerWasSubmitted={this.state.answerWasSubmitted}
                    correctAnswer={translation}
                    handleNextQuestion={this.handleNextQuestion} />
            </form>
        );
    }
}

class WritingTranslationQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userAnswer: '', answerWasSubmitted: false};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleNextQuestion() {
        this.setState({userAnswer: '', answerWasSubmitted: false});
        this.props.handleNextQuestion();
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
                    userAnswer={this.state.userAnswer}
                    answerWasSubmitted={this.state.answerWasSubmitted}
                    correctAnswer={answer}
                    handleNextQuestion={this.handleNextQuestion} />
            </form>
        );
    }
}

class PairsWordCell extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, language) {
        this.props.onClick(event.target.value, language);
    }

    render() {
        const word = this.props.word;
        const selected = this.props.selected;
        const alreadyMatched = this.props.alreadyMatched;
        const matchCorrect = this.props.matchCorrect;
        const matchIncorrect = this.props.matchIncorrect;
        const language = this.props.language;
        let classesArray = [];
        const possibleClasses = ['pairWordSelected', 'pairAlreadyMatched', 'pairMatchCorrect', 'pairMatchIncorrect'];
        [(selected && !(matchCorrect || matchIncorrect)), alreadyMatched, (selected && matchCorrect && !alreadyMatched), (selected && matchIncorrect && !alreadyMatched)].forEach((property, propertyIndex) =>
            {if (property)
                {classesArray.push(possibleClasses[propertyIndex])}
            }
        );
        const buttonClassNames = classesArray.join(' ');

        return (
            <th>
                <button
                    onClick={(event) => this.handleClick(event, language)}
                    value={word}
                    disabled={alreadyMatched || matchCorrect || matchIncorrect}
                    className={buttonClassNames}>
                    {word}
                </button>
            </th>
        )
    }
}

class PairsQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {firstLanguageWordsMatched: [], firstLanguageSelection: '', targetLanguageSelection: ''};

        this.handleNextQuestion = this.handleNextQuestion.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleWordSelection = this.handleWordSelection.bind(this);
    }

    handleNextQuestion() {
        this.setState({firstLanguageWordsMatched: [], firstLanguageSelection: '', targetLanguageSelection: ''});
        this.props.handleNextQuestion();
    }

    handleContinue(event) {
        if (event.target.name === 'correctContinue') {
            let firstLWMArray = this.state.firstLanguageWordsMatched;
            firstLWMArray.push(this.state.firstLanguageSelection);
            this.setState({firstLanguageWordsMatched: firstLWMArray, firstLanguageSelection: '', targetLanguageSelection: ''});
        } else {
            this.setState({firstLanguageSelection: '', targetLanguageSelection: ''});
        }
    }

    handleWordSelection(word, language) {
        const selectionInFirstLanguage = (language === 'firstLanguage');
        const languageKey = (selectionInFirstLanguage ? 'firstLanguageSelection' : 'targetLanguageSelection');
        const otherLanguageWord = (selectionInFirstLanguage ? this.state.targetLanguageSelection : this.state.firstLanguageSelection);
        if (otherLanguageWord === '') {
            if (word === this.state[languageKey]) {
                this.setState({[languageKey]: ''});
            } else {
                this.setState({[languageKey]: word});
            }
        } else {
            this.setState({[languageKey]: word});
        }
    }

    render() {
        const firstLanguageWords = this.props.firstLanguageWords;
        const targetLanguageWords = this.props.targetLanguageWords;
        const matches = this.props.matches;
        const optionIDsMap = this.props.optionIDsMap;
        const firstLWordsMatched = this.state.firstLanguageWordsMatched;
        const firstLanguageSelection = this.state.firstLanguageSelection;
        const targetLanguageSelection = this.state.targetLanguageSelection;
        const targetLWordsMatched = firstLWordsMatched.map(firstLWord => matches.get(firstLWord));
        const matchAttempted = !((firstLanguageSelection === '') || (targetLanguageSelection === ''));
        const matchCorrect = (matchAttempted && (targetLanguageSelection === this.props.matches.get(firstLanguageSelection)));
        const matchIncorrect = (matchAttempted && (targetLanguageSelection !== this.props.matches.get(firstLanguageSelection)));
        const allMatched = matchCorrect && (firstLWordsMatched.length >= (matches.size - 1));

        const wordButtonsTable = firstLanguageWords.map((firstLanguageWord, wordIndex) =>
            <tr key={optionIDsMap.get(firstLanguageWord)}>
                <PairsWordCell
                    word={firstLanguageWord}
                    selected={firstLanguageWord === firstLanguageSelection}
                    alreadyMatched={firstLWordsMatched.includes(firstLanguageWord)}
                    matchCorrect={matchCorrect}
                    matchIncorrect={matchIncorrect}
                    language='firstLanguage'
                    onClick={this.handleWordSelection} />
                <PairsWordCell
                    word={targetLanguageWords[wordIndex]}
                    selected={targetLanguageWords[wordIndex] === targetLanguageSelection}
                    alreadyMatched={targetLWordsMatched.includes(targetLanguageWords[wordIndex])}
                    matchCorrect={matchCorrect}
                    matchIncorrect={matchIncorrect}
                    language='targetLanguage'
                    onClick={this.handleWordSelection} />
            </tr>
        );

        let answerFeedbackArea = '';
        if (matchCorrect && !allMatched) {
            answerFeedbackArea = (<div>
                <p>Match correct!</p>
                <button name='correctContinue' onClick={this.handleContinue}>Click to continue</button>
            </div>);
        }
        if (matchIncorrect) {
            answerFeedbackArea = (<div>
                <p>Match incorrect</p>
                <button name='incorrectContinue' onClick={this.handleContinue}>Click to continue</button>
            </div>);
        }
        if (allMatched) {
            answerFeedbackArea = (<div>
                <p>Excellent!</p>
                <button onClick={this.handleNextQuestion}>Click to continue</button>
            </div>);
        }

        return (
            <div>
                <h1>Match the pairs</h1>
                <table>
                    <tbody>
                        {wordButtonsTable}
                    </tbody>
                </table>
                {answerFeedbackArea}
            </div>
        );
    }
}

class LessonDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {questionNumber: 1};

        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleNextQuestion() {
        this.setState({
            questionNumber: (this.state.questionNumber + 1)
        });
    }

    render() {
        const currentQuestion = LESSON_PEOPLE.questionsArray[(this.state.questionNumber - 1)];
        const currentQuestionDisplay = currentQuestion.displayQuestion(this.handleNextQuestion);

        return (
            <div>
                <div>
                    <LessonTopBar
                        questionNumber={this.state.questionNumber} />
                </div>
                <div>
                    {currentQuestionDisplay}
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
    constructor(props) {
        super(props);

        this.handleClickLesson = this.handleClickLesson.bind(this);
    }

    handleClickLesson(event) {
        this.props.onNavigationSelect('lesson', event.target.name);
    }

    render() {
        return (
            <div>
                <div>Select Lesson</div>
                <div><button onClick={this.handleClickLesson} name='lessonPeople'>People</button></div>
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
    constructor(props) {
        super(props);

        this.handleNavigationSelect = this.handleNavigationSelect.bind(this);
    }

    handleNavigationSelect(navigationCategory, navigationSelection) {
        this.props.onNavigationSelect(navigationCategory, navigationSelection);
    }

    render() {
        return (
            <div>
                <MenusTopBar />
                <LessonSelectionDisplay onNavigationSelect={this.handleNavigationSelect} />
                <MenusBottomBar />
            </div>
        );
    }
}

class AppDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentDisplay: 'lesson-select-menu', lessonID: 'menu'};

        this.handleNavigationSelect = this.handleNavigationSelect.bind(this);
    }

    handleNavigationSelect(navigationCategory, navigationSelection) {
        switch(navigationCategory) {
            case 'lesson':
                this.setState({
                    currentDisplay: 'lesson-display',
                    lessonID: navigationSelection
                });
                break;
            case 'menu':
                this.setState({
                    currentDisplay: navigationSelection,
                    lessonID: 'menu'
                });
                break;
            default:
                this.setState({
                    currentDisplay: 'lesson-select-menu',
                    lessonID: 'menu'
                });
        }
    }

    render() {
        const currentDisplay = this.state.currentDisplay;
        let display;
        switch (currentDisplay) {
            case 'lesson-select-menu':
                display = <MenuDisplay onNavigationSelect={this.handleNavigationSelect} />;
                break;
            case 'lesson-display':
                display = <LessonDisplay
                            lessonID={this.state.lessonID} />;
                break;
            default:
                display = <MenuDisplay onNavigationSelect={this.handleNavigationSelect} />;
        }
        return (
            <div>{display}</div>
        );
    }
}
const Q1 = new PairsQuestion(['tall (female)', 'short (female)', 'woman', 'girl', 'sister'], ['hermana', 'baja', 'alta', 'mujer', 'chica'],
    new Map([['tall (female)', 'alta'], ['short (female)', 'baja'], ['woman', 'mujer'], ['girl', 'chica'], ['sister', 'hermana']]));
const Q2 = new WritingTranslationQuestion('You are very tall.', 'Tu eres muy alto.');
const Q3 = new MCVocabularyQuestion('the girl', ['el niño', 'la mujer', 'el hombre', 'la niña'], 4);
const Q4 = new MCVocabularyQuestion('the woman', ['la niña', 'el hombre', 'la mujer', 'el niño'], 3);
const Q5 = new MCSentenceQuestion("I didn't answer him.", ['Yo no le canté.', 'No le respondí.', 'Le respondí.'], 2);
const Q6 = new AssemblingTranslationQuestion('I am a woman.', ['soy', 'una', 'la', 'yo', 'hombre', 'mujer', 'Yo'], 'Yo soy una mujer.');
const LESSON_PEOPLE = new LessonInformation('People', [Q1, Q2, Q3, Q4, Q5, Q6]);

ReactDOM.render(
    <AppDisplay />,
        document.getElementById('root')
);