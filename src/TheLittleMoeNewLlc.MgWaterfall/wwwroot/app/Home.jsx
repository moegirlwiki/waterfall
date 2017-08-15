var Masonry = require('react-masonry-component');
var VisibilitySensor = require('react-visibility-sensor');

var masonryOptions = {
    transitionDuration: '0.4s',
    stagger: 30
};

var CardGallery = React.createClass({
    render: function () {
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
});

var RecentNewPagesHost = React.createClass({
    getInitialState: function () {
        return {
            pages: [],
            continuationToken: null,
            isLoading: false
        };
    },
    componentWillMount: function () {
        // Redirect
        this.loadData();
    },
    loadData: function () {
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
    },
    onVisibilityChange: function (isVisible) {
        // Load more if loaded before
        if (isVisible && this.state.continuationToken) {
            console.info("Load more data starting from " + this.state.continuationToken);
            this.loadData();
        }
    },
    render: function () {
        return (
            <div>
                <CardGallery elements={this.state.pages} />
                <VisibilitySensor onChange={this.onVisibilityChange} />
            </div>
        );
    }
});

ReactDOM.render(
    <RecentNewPagesHost />,
    document.getElementById('card-container')
);