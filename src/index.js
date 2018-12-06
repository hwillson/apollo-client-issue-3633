import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, Observable } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';

import Widgets from './Widgets';

const cache = new InMemoryCache();

const widgets = [...Array(3).keys()].map((count) => {
  const id = count + 1;
  return {
    id,
    name: `Widget ${id}`,
    __typename: 'Widget',
  };
});

const link = new ApolloLink(({ operationName }) => {
  if (operationName === 'allWidgets') {
    return Observable.of({
      data: {
        widgets,
      },
    });
  } else if (operationName === 'removeWidget') {
    if (widgets.length === 0) {
      throw new Error('No more widgets!');
    }
    const removedWidget = widgets.pop();
    return Observable.of({
      data: {
        removeWidget: {
          id: removedWidget.id,
          __typename: 'Widget',
        }
      },
    });
  }
});

const client = new ApolloClient({
  cache,
  link,
});

const App = () => (
  <ApolloProvider client={client}>
    <Widgets />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
