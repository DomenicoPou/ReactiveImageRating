import React, { Component } from 'react';

/**
 * This is just a fun loader that i wanted to implement
 * Which suprisingly fits the theme
 * */
class Loader extends Component {


    /**
    * Generates all the variables
    * */
    constructor(props) {
        super(props);
        this.state = {
            colorR: 0,
            colorB: 0,
            colorG: 0,
            colorString: "#000000",
            reverse: false
        }
    }

    /**
     * This is used to convert the rbg 0 - 255 values to 00 - FF Hex values 
     * @param {number} colorVal
     */
    rbgToHex(colorVal) {
        var hex = Number(colorVal).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    }

    /**
     * This is where all the colour incrementing and value changing happens
     */
    handleChangeColor = () => {
        /* Simply increment each value til they hit 255 then reverse */
        if (!this.state.reverse) {
            if (this.state.colorR != 255) {
                this.setState({ colorR: this.state.colorR + 1 });
            } else if (this.state.colorB != 255) {
                this.setState({ colorB: this.state.colorB + 1 });
            } else if (this.state.colorG != 255) {
                this.setState({ colorG: this.state.colorG + 1 });
            } else {
                this.setState({ reverse: true });
            }
        } else {
            if (this.state.colorR != 0) {
                this.setState({ colorR: this.state.colorR - 1 });
            } else if (this.state.colorB != 0) {
                this.setState({ colorB: this.state.colorB - 1 });
            } else if (this.state.colorG != 0) {
                this.setState({ colorG: this.state.colorG - 1 });
            } else {
                this.setState({ reverse: false });
            }
        }
        

        /* Individually get each colors hex value. Then set the hex string*/
        var hexR = this.rbgToHex(this.state.colorR);
        var hexB = this.rbgToHex(this.state.colorB);
        var hexG = this.rbgToHex(this.state.colorG);
        this.setState({ colorString: "#" + hexR + hexB + hexG });

        /* In the next milisecond do it all over again */
        this.timer = setTimeout(() => this.handleChangeColor(), 1);
    }

    /* When the component mounts start the color changing */
    componentDidMount() {
        this.handleChangeColor();
    }


    // Render the svg with the new colorString in fill
    render() {
        return (
            <div>
                <svg width="135" height="140" viewBox="0 0 135 140" xmlns="http://www.w3.org/2000/svg" fill={this.state.colorString}>
                    <rect y="10" width="15" height="120" rx="6">
                        <animate attributeName="height"
                            begin="0.5s" dur="1s"
                            values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="y"
                            begin="0.5s" dur="1s"
                            values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                            repeatCount="indefinite" />
                    </rect>
                    <rect x="30" y="10" width="15" height="120" rx="6">
                        <animate attributeName="height"
                            begin="0.25s" dur="1s"
                            values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="y"
                            begin="0.25s" dur="1s"
                            values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                            repeatCount="indefinite" />
                    </rect>
                    <rect x="60" width="15" height="140" rx="6">
                        <animate attributeName="height"
                            begin="0s" dur="1s"
                            values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="y"
                            begin="0s" dur="1s"
                            values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                            repeatCount="indefinite" />
                    </rect>
                    <rect x="90" y="10" width="15" height="120" rx="6">
                        <animate attributeName="height"
                            begin="0.25s" dur="1s"
                            values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="y"
                            begin="0.25s" dur="1s"
                            values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                            repeatCount="indefinite" />
                    </rect>
                    <rect x="120" y="10" width="15" height="120" rx="6">
                        <animate attributeName="height"
                            begin="0.5s" dur="1s"
                            values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear"
                            repeatCount="indefinite" />
                        <animate attributeName="y"
                            begin="0.5s" dur="1s"
                            values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear"
                            repeatCount="indefinite" />
                    </rect>
                </svg>
            </div>
        );
    }
}

export default Loader;
