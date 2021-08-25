import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import FeatureView from '../../component/feature/FeatureView';

export default class Features extends PureComponent {
    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
    };

    render() {
        const {
            match: { params },
            history,
        } = this.props;
        return (
            <FeatureView
                featureToggleName={params.name}
                activeTab={params.activeTab}
                history={history}
            />
        );
    }
}
