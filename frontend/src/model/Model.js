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
        // this.retrieveData(); //TODO: uncomment if want to train model
    }

    retrieveData() {
        console.log('retrieving')
        modelService.getMetrics().then((result) => {
            console.log(result)
            this.setState({ metrics: result.metrics })
        }).catch(result => {
            alert(result);
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
                                    <tr key={metric.metric}>
                                        <td>{metric.metric}</td>
                                        <td>{metric.value}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Model;