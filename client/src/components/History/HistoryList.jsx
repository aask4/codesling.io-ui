import React from 'react';

export const HistoryList = ({ history }) => {
  let outcome;
  return (
    <div>
      {history.map( (hist, i) => {
      outcome = hist.outcome === 0 ? 'Loss' : 'Win';
      return (
        <div className="outcomes" key={i}>
          <div>Outcome: {outcome}</div>
          <div>Opponent: {hist.receiver.username}</div>
          <div>Clout Earned: {hist.outcome === 0 ? 0 : hist.clout}</div>
        </div>
      )})}
    </div>
  )
};
