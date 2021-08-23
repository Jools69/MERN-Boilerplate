import Layout from './core/Layout';

const App = (props) => {
  return (
    <Layout location={props.location}>
      <h1>Hey there React</h1>
    </Layout>
  );
};

export default App;
