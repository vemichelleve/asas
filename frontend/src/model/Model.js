import React, { Component } from 'react'
import ModelService from './ModelService'

const modelService = new ModelService();

class Model extends Component {
    constructor(props) {
        super(props);
        this.state = {
            metrics: [],
        }
    }

    componentDidMount() {
        this.retrieveData();
    }

    retrieveData() {
        modelService.getMetrics().then((result) => {
            this.setState({ metrics: result.data })
        }).catch((result) => {
            alert(result);
        })
    }

    trainModel() {
        modelService.trainModel().then((result) => {
            alert(result.message)
        }).catch((result) => {
            alert(result.message)
        })
    }

    render() {
        return (
            <div className='Form-Container'>
                <div className='card Form-Card'>
                    <div className='card-body'>
                        <h5 className='card-title'>Model details</h5>
                        <table className='table'>
                            <thead key='thead'>
                                <tr>
                                    <th>Evaluation method</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.metrics.map(metric =>
                                    <tr key={metric.name}>
                                        <td>{metric.name}</td>
                                        <td>{metric.value.toFixed(4)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className='Center-Item'>
                            <button className='btn btn-primary' onClick={this.trainModel}>Train model</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Model;