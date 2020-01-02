import React, { Component } from 'react'

class QuestionList extends Component {
    render() {
        return (
            <div>
                <table className="table">
                    <thead key="thead">
                        <tr>
                            <th>#</th>
                            <th>Question</th>
                            <th>Reference answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {this.state.questions.map(q =>
                            <tr key={q.pk}>
                                <td>{q.pk}</td>
                                <td>{q.question}</td>
                                <td>{q.refans}</td>
                            </tr>
                        )} */}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default QuestionList;