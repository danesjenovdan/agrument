import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import { fetchPublishedPosts } from '../../../store/slices/posts.js';
import { toSloDateString } from '../../../utils/date.js';
import Button from '../../FormControl/Button.jsx';
import TriangleHeading from '../../Card/TriangleHeading.jsx';
import RenderSpinner from '../../RenderSpinner.jsx';
import Spinner from '../../Spinner.jsx';

const PER_PAGE = 20;

export default function List() {
  const dispatch = useDispatch();

  const published = useSelector((state) => state.posts.published);

  const [
    {
      searchQuery,
      debouncedSearchQuery,
      firstDateForOffset,
      currentPageOffset,
    },
    setState,
  ] = useState({
    searchQuery: '',
    debouncedSearchQuery: '',
    firstDateForOffset: null,
    currentPageOffset: 0,
  });

  useEffect(() => {
    dispatch(fetchPublishedPosts({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchPublishedPosts({
        q: debouncedSearchQuery,
        date: firstDateForOffset,
        offset: currentPageOffset,
      })
    );
  }, [dispatch, debouncedSearchQuery, firstDateForOffset, currentPageOffset]);

  useDebounce(
    () => {
      setState((state) => ({
        ...state,
        debouncedSearchQuery: searchQuery,
        firstDateForOffset: null,
        currentPageOffset: 0,
      }));
    },
    500,
    [searchQuery]
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const isOlderDisabled =
    published.loading || !published.data || published.data.length <= PER_PAGE;

  const isNewerDisabled =
    published.loading ||
    !published.data ||
    !firstDateForOffset ||
    currentPageOffset === 0;

  const onOlderClick = () => {
    if (published.loading) {
      return;
    }
    if (published.data && published.data.length > PER_PAGE) {
      setState((state) => {
        const offsetDate = state.firstDateForOffset || published.data[0].date;
        const newOffset = state.currentPageOffset + PER_PAGE;
        return {
          ...state,
          firstDateForOffset: offsetDate,
          currentPageOffset: newOffset,
        };
      });
      window.scrollTo(0, 0);
    }
  };

  const onNewerClick = () => {
    if (published.loading) {
      return;
    }
    if (published.data && currentPageOffset > 0) {
      setState((state) => {
        const offsetDate = state.firstDateForOffset || published.data[0].date;
        const newOffset = Math.max(0, state.currentPageOffset - PER_PAGE);
        return {
          ...state,
          firstDateForOffset: offsetDate,
          currentPageOffset: newOffset,
        };
      });
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <TriangleHeading title="Agrumenti, ki so že objavljeni" />
        <div className="card__content clearfix">
          <div className="form-group">
            <div className="input-group">
              <div className="input-group-addon input-group-spinner">
                {published.loading && <Spinner />}
              </div>
              <input
                name="searchQuery"
                className="form-control"
                placeholder="Iskanje po naslovu in vsebini..."
                value={searchQuery}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <RenderSpinner isLoading={published.loading} data={published.data}>
            {(data) => (
              <>
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
                    {(published.ignorePagination
                      ? data
                      : data.slice(0, PER_PAGE)
                    ).map((e) => (
                      <tr key={e.id}>
                        <td>{e.id}</td>
                        <td>{toSloDateString(e.date)}</td>
                        <td>{e.author_name}</td>
                        <td>{e.title}</td>
                        <td>
                          <Link
                            to={`/dash/edit/${toSloDateString(e.date)}`}
                            className="btn btn-primary btn-xs"
                          >
                            <i className="glyphicon glyphicon-edit" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {published.ignorePagination ? (
                  `Rezultatov: ${published.data.length}`
                ) : (
                  <div className="text-center">
                    <Button
                      value="Novejši"
                      disabled={isNewerDisabled}
                      onClick={onNewerClick}
                    />{' '}
                    <Button
                      value="Starejši"
                      disabled={isOlderDisabled}
                      onClick={onOlderClick}
                    />
                  </div>
                )}
              </>
            )}
          </RenderSpinner>
        </div>
      </div>
    </div>
  );
}
