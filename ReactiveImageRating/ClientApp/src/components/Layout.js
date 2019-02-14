import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
    displayName = Layout.name

    render() {
        return (
            <Grid fluid>
                <Row>
                    <NavMenu />
                    <Col sm={12}>
                        {this.props.children}
                    </Col>
                </Row>
            </Grid>
        );
    }
}
