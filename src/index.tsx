import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {observable, computed, action} from 'mobx';
import {observer} from 'mobx-react';

class AppState {
    @observable currentQuestion = 0;
    @observable questions = Array(2).fill(null).map((item, index) => {
        return {
            question: `Is this a question №${index+1}?`,
            reply1: `Good choice! №${index+1}`,
            reply2: `Damn! №${index+1}`
        };
    });

    constructor() {
        this.currentQuestion = 0;
    }

    @computed get getCurrent()
    {
        return this.isFinished ? {question: null, reply1: null, reply2: null} : this.questions[this.currentQuestion];
    }

    @computed get isFinished()
    {
        return this.currentQuestion >= this.questions.length;
    }

    @action nextQuestion()
    {
        this.currentQuestion = this.currentQuestion <= this.questions.length - 1 ? this.currentQuestion + 1 : this.questions.length - 1;
    }

    @action reset()
    {
        this.currentQuestion = 0;
    }

}

@observer
class App extends React.Component<{appState: AppState}, {}> {

    handleYes = () => {
        alert(this.props.appState.getCurrent.reply1);
        this.props.appState.nextQuestion();
    };

    handleNo = () => {
        alert(this.props.appState.getCurrent.reply2);
        this.props.appState.nextQuestion();
    };

    handleReset = () => {
        this.props.appState.reset();
    };

    render() {
        const { getCurrent, currentQuestion, isFinished } = this.props.appState;
        return (
            <div>
                {isFinished ? (
                    <div>
                        <p>No more question</p>
                        <button onClick={this.handleReset}>Reset</button>
                    </div>
                ) : (
                    <div>
                        <p>Current question: {currentQuestion+1}</p>
                        <p>Question: {getCurrent.question}</p>
                        <button onClick={this.handleYes}>Yes</button>
                        <button onClick={this.handleNo}>No</button>
                    </div>
                )}
            </div>
        );
     }
};

const appState = new AppState();
ReactDOM.render(<App appState={appState} />, document.getElementById('root'));
