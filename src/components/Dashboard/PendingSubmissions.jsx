import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingPosts } from '../../store/slices/posts.js';
import RenderSpinner from '../RenderSpinner.jsx';
import TriangleHeading from '../Card/TriangleHeading.jsx';
import PendingEntry from './PendingEntry.jsx';

export default function PendingSubmissions() {
  const dispatch = useDispatch();

  const pending = useSelector((state) => state.posts.pending);

  useEffect(() => {
    dispatch(fetchPendingPosts());
  }, []);

  return (
    <RenderSpinner isLoading={pending.loading} data={pending.data}>
      {(data) => (
        <div>
          <TriangleHeading title="Agrumenti, ki jih moraš oddati" />
          {data.map((entry) => (
            <PendingEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </RenderSpinner>
  );
}
