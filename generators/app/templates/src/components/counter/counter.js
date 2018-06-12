import React from 'react';
import { func, number } from 'prop-types';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withI18next } from '@root/lib/withI18next';

const getCounter = gql`
  query {
    counter @client {
      value
    }
  }
`;

const increaseCounter = gql`
  mutation increaseCounter($counter: int) {
    increaseCounter(counter: $counter) @client {
      counter
    }
  }
`;

const decreaseCounter = gql`
  mutation decreaseCounter($counter: int) {
    decreaseCounter(counter: $counter) @client {
      counter
    }
  }
`;

export const Counter = ({ t, value, updateCounter, subtractCounter }) => {
  return (
    <div className="counter">
      <h6>Counter State</h6>
      <div>
        <button
          onClick={() => subtractCounter({ variables: { counter: value } })}
        >
          Decrease
        </button>
        <div>{value}</div>
        <button
          onClick={() => updateCounter({ variables: { counter: value } })}
        >
          Increase
        </button>
      </div>
    </div>
  );
};

Counter.propTypes = {
  t: func,
  value: number,
  updateCounter: func,
  subtractCounter: func,
};

export default compose(
  graphql(decreaseCounter, { name: 'subtractCounter' }),
  graphql(increaseCounter, { name: 'updateCounter' }),
  graphql(getCounter, {
    props: ({
      data: {
        counter: { value },
      },
    }) => ({ value }),
  }),
  withI18next(['common', 'counter'])
)(Counter);
