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

                    </tbody>
                </table>
            </div>
        );
    }
}

export default QuestionList;