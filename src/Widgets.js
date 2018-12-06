import React from 'react'
import { Query, Mutation, withApollo } from 'react-apollo';
import gql from 'graphql-tag';

const variables = { someVar: 'abc123' };

const ALL_WIDGETS = gql`
  query allWidgets($someVar: String!) {
    widgets(someVar: $someVar) {
      id
      name
    }
  }
`;

const REMOVE_WIDGET = gql`
  mutation removeWidget {
    removeWidget {
      id
    }
  }
`;

const Widgets = ({ client }) => (
  <div className="widgets">
    <Query query={ALL_WIDGETS} variables={{ someVar: 'abc123' }}>
      {({ loading, error, data}) => {
        if (loading) return <p>Loading ...</p>;
        if (error) return <p>Oh no! ${error.message}</p>;
        if (data.widgets.length === 0) return <p>No more widgets!</p>;

        let content = data.widgets.map(({ id, name }) => (
          <p key={id}>
            <strong>ID:</strong> {id},
            {' '}
            <strong>Name:</strong> {name}
          </p>
        ));

        content.push(
          <Mutation
            key="mut"
            mutation={REMOVE_WIDGET}
            update={(proxy, { data }) => {
              const allWidgets = proxy.readQuery({
                query: ALL_WIDGETS,
                variables,
              });
              allWidgets.widgets.pop();
              proxy.writeQuery({
                query: ALL_WIDGETS,
                variables,
                data: allWidgets,
              });
            }}
          >
            {(removeWidget, { error }) => (
              <button onClick={() => {
                removeWidget();
                console.log(client.cache.data.data);
              }}>
                Remove a Widget
              </button>
            )}
          </Mutation>
        );

        return content;
      }}
    </Query>
  </div>
);

export default withApollo(Widgets);
