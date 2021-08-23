import React from 'react';
import Layout from './Layout';

const Busy = () => (
    <Layout>
        <div className="container text-center py-5">
            <h1>Please wait...</h1>
            <div class="spinner-grow text-center text-primary my-5" style={{width: "3rem", height: "3rem"}} role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </Layout>
)

export default Busy;