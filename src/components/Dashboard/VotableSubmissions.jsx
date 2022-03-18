import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVotablePosts } from '../../store/slices/posts.js';
import RenderSpinner from '../RenderSpinner.jsx';
import TriangleHeading from '../Card/TriangleHeading.jsx';
import VotableEntry from './VotableEntry.jsx';

export default function VotableSubmissions() {
  const dispatch = useDispatch();

  const votable = useSelector((state) => state.posts.votable);

  useEffect(() => {
    dispatch(fetchVotablePosts());
  }, []);

  return (
    <RenderSpinner isLoading={votable.loading} data={votable.data}>
      {(data) => (
        <div>
          <TriangleHeading title="Agrumenti, za katere lahko glasuješ" />
          {data.map((entry) => (
            <VotableEntry key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </RenderSpinner>
  );
}
