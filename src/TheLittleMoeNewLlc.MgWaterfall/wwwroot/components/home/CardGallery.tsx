import * as React from "react";
import Masonry from "react-masonry-component";
import { ICard } from "../models/Card";

export interface ICardGallery {
    elements: ICard[];
}

export class CardGallery extends React.Component<ICardGallery, undefined> {
    render() {
        var masonryOptions = {
            transitionDuration: '0.4s',
            stagger: 30,
            isFitWidth: true
        };

        var childElements = this.props.elements.map(function (element) {
            return (
                <div className="card" key={element.pageId}>
                    <img height={element.height} className="card-cover" src={element.thumbnail} />
                    <h1 className="card-title">{element.title}</h1>
                </div>
            );
        });

        return (
            <Masonry
                className={'articles-gallery'}
                elementType={'div'}
                options={masonryOptions}
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
            >
                {childElements}
            </Masonry>
        );
    }
}