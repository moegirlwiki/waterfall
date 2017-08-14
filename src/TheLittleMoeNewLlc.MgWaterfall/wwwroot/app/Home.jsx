var Masonry = require('react-masonry-component');

var masonryOptions = {
    transitionDuration: 0
};

var Gallery = React.createClass({
    render: function () {
        var childElements = this.props.elements.map(function (element) {
            return (
                <div className="card" key={element.key}>
                    <img className="card-cover" src={element.src} />
                    <h1 className="card-title">{element.title}</h1>
                </div>
            );
        });

        return (
            <Masonry
                className={'articles-gallery'} // default ''
                elementType={'div'} // default 'div'
                options={masonryOptions} // default {}
                disableImagesLoaded={false} // default false
                updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
            >
                {childElements}
            </Masonry>
        );
    }
});

var cards = [
    {
        key: '1edf2ada-dd06-4d83-afa7-b4f01bdacfc5',
        title: 'Forza Horizon 3',
        src: 'https://commons.moegirl.org/thumb.php?f=Forza_Horizon_3_Cover.jpg&width=250'
    },
    {
        key: '3accdb6a-f4b6-4dca-a0d6-3e13fc345acf',
        title: 'Gear Of Wars 4',
        src: 'https://img.moegirl.org/common/thumb/2/22/Gears_Of_War_4_Store_Preliminary_Background.jpg/250px-Gears_Of_War_4_Store_Preliminary_Background.jpg'
    },
    {
        key: '0cf48b0a-2faa-4ecd-a0e6-a931f91d5fd0',
        title: 'Forza Motorsport 7',
        src: 'https://commons.moegirl.org/thumb.php?f=Forza_Motorsport_7_Cover.jpg&width=250'
    },
    {
        key: '46c49ab6-06a8-435d-bf4a-2022738980de',
        title: 'Halo 4',
        src: 'https://img.moegirl.org/common/thumb/4/46/Halo_4_Cover.jpg/250px-Halo_4_Cover.jpg'
    },
    {
        key: 'f1244d54-d148-48f0-887f-2d5dd311e26f',
        title: 'Halo Wars 2',
        src: 'https://img.moegirl.org/common/thumb/9/9e/Halo_Wars_2_Cover.png/250px-Halo_Wars_2_Cover.png'
    },
    {
        key: '7aceeb53-71c7-4a76-b038-0fe641e08168',
        title: 'Halo The Master Chief Collection',
        src: 'https://commons.moegirl.org/thumb.php?f=Halo_The_Master_Chief_Collection_Cover.png&width=250'
    }
];

ReactDOM.render(
    <Gallery elements={cards} />,
    document.getElementById('card-container')
);