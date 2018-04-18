import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '../../FormControl/Button';
import TriangleHeading from '../../Card/TriangleHeading';
import RenderSpinner from '../../../hoc/RenderSpinner';
import { toSloDateString } from '../../../utils/date';

import store from '../../../store';

const PER_PAGE = 20;

class List extends React.Component {
  state = {
    firstDateForOffset: null,
    currentPageOffset: 0,
  };

  componentDidMount() {
    store.emit('published:fetch');
  }

  onOlderClick = () => {
    const { state } = this.props;
    if (state.published.isLoading) {
      return;
    }
    if (state.published.data && state.published.data.length > PER_PAGE) {
      const offsetDate = this.state.firstDateForOffset || state.published.data[0].date;
      const newOffset = this.state.currentPageOffset + PER_PAGE;
      store.emit('published:fetch', offsetDate, newOffset);
      this.setState({
        firstDateForOffset: offsetDate,
        currentPageOffset: newOffset,
      });
      document.documentElement.scrollTop = 0;
    }
  }

  onNewerClick = () => {
    const { state } = this.props;
    if (state.published.isLoading) {
      return;
    }
    if (this.state.currentPageOffset > 0) {
      const offsetDate = this.state.firstDateForOffset || state.published.data[0].date;
      const newOffset = Math.max(0, this.state.currentPageOffset - PER_PAGE);
      store.emit('published:fetch', offsetDate, newOffset);
      this.setState({
        firstDateForOffset: offsetDate,
        currentPageOffset: newOffset,
      });
      document.documentElement.scrollTop = 0;
    }
  }

  onSearchQueryChange = (event) => {
    store.emit('published:updatesearchquery', event.target.value);
    this.setState({
      firstDateForOffset: null,
      currentPageOffset: 0,
    });
  }

  isOlderDisabled = () => {
    const { state } = this.props;
    if (state.published.isLoading) {
      return true;
    }
    if (state.published.data && state.published.data.length > PER_PAGE) {
      return false;
    }
    return true;
  }

  isNewerDisabled = () => {
    const { state } = this.props;
    if (state.published.isLoading || this.state.firstDateForOffset == null) {
      return true;
    }
    if (this.state.currentPageOffset > 0) {
      return false;
    }
    return true;
  }

  render() {
    const { state } = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
          <TriangleHeading title="Agrumenti, ki so že objavljeni" />
          <div className="card__content clearfix">
            <RenderSpinner isLoading={state.published.isLoading} data={state.published.data}>
              {data => (
                <Fragment>
                  <div className="form-group">
                    <input className="form-control" placeholder="Iskanje..." value={state.published.searchQuery} onChange={this.onSearchQueryChange} />
                  </div>
                  <table className="table table-hover table-agrument-list">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Datum</th>
                        <th>Avtor</th>
                        <th>Naslov</th>
                        <th>Uredi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, PER_PAGE).map(e => (
                        <tr key={e.id}>
                          <td>{e.id}</td>
                          <td>{toSloDateString(e.date)}</td>
                          <td>{e.author_name}</td>
                          <td>{e.title}</td>
                          <td>
                            <Link to={`/dash/edit/${toSloDateString(e.date)}`} className="btn btn-primary btn-xs">
                              <i className="glyphicon glyphicon-edit" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-center">
                    <Button value="Novejši" disabled={this.isNewerDisabled()} onClick={this.onNewerClick} />
                    {' '}
                    <Button value="Starejši" disabled={this.isOlderDisabled()} onClick={this.onOlderClick} />
                  </div>
                </Fragment>
              )}
            </RenderSpinner>
          </div>
        </div>
      </div>
    );
  }
}

List.propTypes = {
  state: PropTypes.shape().isRequired,
};

export default List;
