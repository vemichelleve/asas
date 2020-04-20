import React from 'react';

export default class Paginator {
    createPaginator(self) {
        var result = [];
        var min = self.state.page - 5;
        var max = self.state.page + 5;
        var diff;
        if (self.state.total > 11) {
            if (min < 1) {
                diff = min
                min = min - diff + 1
                max = max - diff + 1
            }
            if (max > self.state.total) {
                diff = max - self.state.total
                min = min - diff + 1
                max = max - diff + 1
            }
        }
        else {
            min = 1
            max = self.state.total + 1
        }
        result.push(<li className={'page-item' + (self.state.page === 1 ? ' disabled' : '')} key='first'><div className='page-link' tabIndex='-1' onClick={() => self.goToPage(1)}>&laquo;</div></li>)
        result.push(<li className={'page-item' + (self.state.page === 1 ? ' disabled' : '')} key='prev'><div className='page-link' tabIndex='-1' onClick={self.previousPage}>Previous</div></li>)
        for (var x = min; x < max; x++) {
            if (x !== self.state.page)
                result.push(<li className='page-item' key={x}><div className='page-link' id={x} onClick={(e) => self.goToPage(e.target.id)}>{x}</div></li>)
            else
                result.push(<li className='page-item active' key={x}><div className='page-link'>{x} <span className='sr-only'>(current)</span></div></li>)
        }
        result.push(<li className={'page-item' + (self.state.page === self.state.total ? ' disabled' : '')} key='next'><div className='page-link' onClick={self.nextPage}>Next</div></li>)
        result.push(<li className={'page-item' + (self.state.page === self.state.total ? ' disabled' : '')} key='first'><div className='page-link' tabIndex='-1' onClick={() => self.goToPage(self.state.total)}>&raquo;</div></li>)
        return <div className='Paginator'>
            <nav>
                <ul className='pagination'>
                    {result}
                </ul>
            </nav>
        </div>;
    }
}