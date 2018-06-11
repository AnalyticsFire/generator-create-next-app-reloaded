import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Layout from '@root/components/layout';
import { func, bool, object } from 'prop-types';
import { withI18next } from '@root/lib/withI18next';

const rates = gql`
  {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

export const ApolloExample = ({ t, loading, error, data }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Layout title="asfasfa" className="apolloExample-page">
      <div className="container pt-4 pb-4">
        <h1 className="title text-center pb-3">{t('apolloExample:title')}</h1>
        {data.rates.map(({ currency, rate }) => (
          <div key={currency}>
            <p>{`${currency}: ${rate}`}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
};

ApolloExample.propTypes = {
  t: func,
  loading: bool,
  error: object,
  data: object,
};

export default compose(
  graphql(rates),
  withI18next(['common', 'apolloExample'])
)(ApolloExample);
