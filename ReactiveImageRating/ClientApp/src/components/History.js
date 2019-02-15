import React, { Component } from 'react';
import Loader from './Loader';

/**
 * This is used to show the users what images they have voted for.
 * */
export class History extends Component {
    displayName = History.name


    /**
    * Generates the statistics and initiates the page
    * */
    constructor(props) {
        super(props);
        this.state = { stats: [], loading: true, statLength: 0, checkStats: false, buttonText: "Next Fact" };

        fetch('api/Image/GetImageHistory', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session: sessionStorage.getItem('CustomerDataID') })
        }).then(response => response.json())
            .then(data => {
                this.setState({ stats: data, loading: false, statLength: data.length });
            });
    }


    /**
     * Grabs the next fact within the queue, resets the facts if the user has seen all of them
     * */
    handleNextFact = () => {
        this.setState({ checkStats: true });
        if (this.state.statLength == 1) {
            this.setState({ buttonText: "Reseting Facts" });
            fetch('api/Image/GetImageHistory', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session: sessionStorage.getItem('CustomerDataID') })
            }).then(response => response.json())
                .then(data => {
                    this.setState({ stats: data, statLength: data.length, checkStats: false, buttonText: "Next Fact" });
                });
        } else {
            this.setState({ statLength: this.state.statLength - 1, checkStats: false });
        }
    }


    renderStats() {
        if (this.state.statLength != 0) {
            var stat = this.state.stats[this.state.statLength - 1];
            return (
                <div class="rated-image-container">
                    <img class="rated-image" src={stat.url} />
                    <h2 class="fact-font">{stat.userStat}</h2>
                    <h2 class="fact-font">{stat.imgStat}</h2>
                    <div class="button-container">
                        <button class="btn btn-next" onClick={this.handleNextFact} disabled={this.state.checkStats}>{this.state.buttonText}</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div class="rated-image-container">
                    <h1>You haven't voted on our system yet.</h1>
                </div>
            );
        }
    }


    render() {
        let contents = this.state.loading
            ? <div class="loader"><Loader /></div>
            : this.renderStats();

        return (
            <div>
                {contents}
            </div>
        );
    }
}
