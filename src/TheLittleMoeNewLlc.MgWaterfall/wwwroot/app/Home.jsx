var Masonry = require('react-masonry-component');

var masonryOptions = {
    transitionDuration: '0.4s',
    stagger: 30
};

var CardGallery = React.createClass({
    render: function () {
        var childElements = this.props.elements.map(function (element) {
            return (
                <div className="card" key={element.pageId}>
                    <img className="card-cover" src={element.thumbnail} />
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
});

var RecentNewPagesHost = React.createClass({
    getInitialState: function () {
        return {
            pages: [],
            continuationToken: null
        };
    },
    componentWillMount: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', '/NewPageQuery', true);
        xhr.onload = function () {
            var rel = JSON.parse(xhr.responseText);
            this.setState({
                pages: rel.pages,
                continuationToken: rel.continuationToken
            });
        }.bind(this);
        xhr.send();
    },
    render: function () {
        return (
            <CardGallery elements={this.state.pages} />
        );
    }
});

ReactDOM.render(
    <RecentNewPagesHost />,
    document.getElementById('card-container')
);