/// <reference path="../typings/react-visibility-sensor.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as $ from "jquery";

const VisibilitySensor = require('react-visibility-sensor');

import { CardGallery } from "./CardGallery";
import { ICard } from "../models/Card";

export interface IRecentNewPagesHost { }

interface IRecentNewPagesHostState {
    pages: ICard[];
    continuationToken: string;
    isLoading: boolean;
}

export class RecentNewPagesHost extends React.Component<IRecentNewPagesHost, IRecentNewPagesHostState> {

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            pages: [],
            continuationToken: null,
            isLoading: false
        };
    }

    componentWillMount() {
        // Redirect
        this.loadData();
    }

    private loadData() {
        $.ajax({
            url: this.state.continuationToken ?
                `/NewPageQuery?id=${encodeURIComponent(this.state.continuationToken)}` :
                '/NewPageQuery',
            type: 'GET'
        }).then(rel => {
            if (this.state.continuationToken) {
                this.setState({
                    pages: this.state.pages.concat(rel.pages),
                    continuationToken: rel.continuationToken
                });
            } else {
                this.setState({
                    pages: rel.pages,
                    continuationToken: rel.continuationToken
                });
            }
        });
    }

    onVisibilityChange(isVisible: boolean) {
        // Load more if loaded before
        if (isVisible && this.state.continuationToken) {
            console.info("Load more data starting from " + this.state.continuationToken);
            this.loadData();
        }
    }

    render() {
        return (
            <div>
                <CardGallery elements={this.state.pages} />
                <VisibilitySensor onChange={ (isVisible: boolean) => this.onVisibilityChange(isVisible) } />
            </div>
        );
    }
}