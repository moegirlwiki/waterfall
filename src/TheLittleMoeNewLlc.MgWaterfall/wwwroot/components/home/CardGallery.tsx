import * as React from "react";
import Masonry from "react-masonry-component";
import { ICard } from "../models/Card";

export interface ICardGallery {
    elements: ICard[];
}

export class CardGallery extends React.Component<ICardGallery, undefined> {

    private m_avatarEndpoint: string = "https://commons.moegirl.org/extensions/Avatar/avatar.php?user=";
    private m_plainTextCardVariantClassNamePrefix: string = "card-variant";
    private m_plainTextCardVariants: number = 5;

    private getRandomIntInclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    render() {
        var masonryOptions = {
            transitionDuration: '0.4s',
            stagger: 30,
            isFitWidth: true
        };

        var _this = this;

        var childElements = this.props.elements.map(function (element) {

            var cardClassName = "card";
            if (!element.thumbnail) {
                cardClassName = "card card-variant card-variant" + _this.getRandomIntInclusive(1, _this.m_plainTextCardVariants);
            }

            return (
                <div className={cardClassName} key={element.pageId}>
                    {element.thumbnail &&
                        <img height={element.height} className="card-cover" src={element.thumbnail} />
                    }
                    <h1 className="card-title">{element.title}</h1>
                    <div className="author-info">
                        <img className="author-avatar" src={_this.m_avatarEndpoint + encodeURIComponent(element.author)} />
                        <span className="author-name">{element.author}</span>
                    </div>
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