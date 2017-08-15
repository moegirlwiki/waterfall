/// <reference path="../typings/react-visibility-sensor.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import VisibilitySensor from "react-visibility-sensor";

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
        var xhr = new XMLHttpRequest();
        var endpoint = '/NewPageQuery';

        if (this.state.continuationToken) {
            endpoint = '/NewPageQuery?id=' + encodeURIComponent(this.state.continuationToken);
        }

        xhr.open('get', endpoint, true);
        xhr.onload = function () {
            var rel = JSON.parse(xhr.responseText);
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
        }.bind(this);

        xhr.send();
    }

    onVisibilityChange(isVisible: boolean) {
        // Load more if loaded before
        if (isVisible && this.state.continuationToken) {
            console.info("Load more data starting from " + this.state.continuationToken);
            this.loadData();
        }
    }

    render() {
        // <VisibilitySensor onChange={this.onVisibilityChange} />
        return (
            <div>
                <CardGallery elements={this.state.pages} />
            </div>
        );
    }
}