import React from 'react';
import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
import { autobind } from 'core-decorators';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import Spinner from '../components/Spinner';
import SubmissionEditor from '../components/Dashboard/SubmissionEditor';

import store from '../store';

class EditAgrument extends React.Component {
  componentDidMount() {
    this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    store.trigger('user:fetch', this.context.history);

    const stringDate = this.props.params.date;
    let d = new Date();
    d.setUTCDate(parseInt(stringDate.split('.')[0], 10));
    d.setUTCMonth(parseInt((stringDate.split('.')[1] - 1), 10));
    d.setUTCFullYear(parseInt(stringDate.split('.')[2], 10));
    d.setUTCHours(0);
    d.setUTCMinutes(0);
    d.setUTCSeconds(0);
    d.setUTCMilliseconds(0);

    store.trigger('editable:fetch', d);
  }

  @autobind
  routerWillLeave() {
    if (this.props.state.currentEditor || this.props.state.currentEditorRTE) {
      return 'Changes you made may not be saved. Are you sure you want to leave?';
    }
    return true;
  }

  render() {
    const { state } = this.props;
    if (state.user.isLoading) {
      return (
        <div>
          {/* <Helmet title="Dashboard" /> */}
          <SideMenu />
          <div className="container-fluid">
            <Header
              title="Agrument"
              subTitle="Dashboard"
              small
            />
            <div className="container dash__container">
              <Spinner />
            </div>
          </div>
        </div>
      );
    } else if (state.user.data) {
      return (
        <div>
          {/* <Helmet title="Dashboard" /> */}
          <SideMenu />
          <div className="container-fluid">
            <Header
              title="Agrument"
              subTitle="Dashboard"
              small
            />
            <SubmissionEditor entry={store.get().editable} />
          </div>
        </div>
      );
    } else {
      return (
        <div>
          {/* <Helmet title="Dashboard" /> */}
          <SideMenu />
          <div className="container-fluid">
            <Header
              title="Agrument"
              subTitle="Dashboard"
              small
            />
            {'napaka'}
          </div>
        </div>
      );
    }
  }
}

EditAgrument.propTypes = {
  state: PropTypes.shape(),
  router: PropTypes.shape().isRequired,
  route: PropTypes.shape().isRequired,
};

EditAgrument.defaultProps = {
  state: {},
};

export default EditAgrument;
