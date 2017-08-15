declare module 'react-visibility-sensor' {

    import * as React from 'react';

    export interface VisibilitySensorPropTypes {
        onChange?: (isVisible: boolean) => any;
        active?: boolean;
        partialVisibility?: boolean;
        offset?: any;
        minTopValue?: number;
        intervalCheck?: boolean;
        intervalDelay?: number;
        scrollCheck?: boolean;
        scrollDelay?: number;
        scrollThrottle?: number;
        resizeCheck?: boolean;
        resizeDelay?: number;
        resizeThrottle?: number;
        containment?: HTMLElement;
        delayedCall?: boolean;
        children?: any;
    }

    export default class VisibilitySensor extends React.Component<VisibilitySensorPropTypes, any> {

    }
}