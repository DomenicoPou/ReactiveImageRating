import React, { Component } from 'react';

/**
 * The core of how users vote on images
 * */
export class Home extends Component {
    displayName = Home.name


    /**
     * Grabs all the images that the user can vote on
     * */
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            loading: true,
            voting: false,
            selectedImage: 0
        };

        fetch('api/Image/GenerateImages' , {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session: sessionStorage.getItem('CustomerDataID') })
        }) .then(response => response.json())
            .then(data => {
                this.setState({ images: data, loading: false, selectedImage: data.length });
            });
    }


    /**
     * Handels the vote if the user likes the image
     * */
    handleVoteLike = () => {
        this.setState({ voting: true });
        fetch('api/Image/castVote', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session: sessionStorage.getItem('CustomerDataID'), url: this.state.images[this.state.selectedImage - 1].url, result: "1" })
        }) .then(response => response.json())
            .then(data => {
                this.setState({ selectedImage: this.state.selectedImage - 1, voting: false });
            });
    }


    /**
     * Handels the vote if the user dislikes the image
     * */
    handleVoteDislike = () => {
        this.setState({ voting: true });
        fetch('api/Image/castVote', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session: sessionStorage.getItem('CustomerDataID'), url: this.state.images[this.state.selectedImage - 1].url, result: "0" })
        }).then(response => response.json())
            .then(data => {
                this.setState({ selectedImage: this.state.selectedImage - 1, voting: false });
            });
    }


    renderImageCarousel() {
        if (this.state.selectedImage != 0) {
            var image = this.state.images[this.state.selectedImage - 1];
            return (
                <div class="rated-image-container">
                    <img class="rated-image" src={image.url} alt={image.name} />
                    <h2>{image.name}</h2>
                    <h4>{image.author}</h4>
                    <div class="button-container">
                        <button class="btn btn-no" onClick={this.handleVoteDislike} disabled={this.state.voting}>Dislike</button>
                        <button class="btn btn-yes" onClick={this.handleVoteLike} disabled={this.state.voting}>Like</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div>
                    <h1>You have voted for all images within our database!</h1>
                </div>
            );
        }
    }


    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderImageCarousel();

        return (
            <div>
                
                {contents}
            </div>
        );
    }
}
