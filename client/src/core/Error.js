import React from 'react';
import { connect } from 'react-redux';
import { clearError } from '../redux/actions';

const Error = (props) => {

    const { error, showClose = false} = props;

    return (
        <div>
            {error.message && <div>
                <div className="alert alert-danger alert-dismissible fade show my-3" role="alert">
                    {error.message}
                    {showClose && <button type="button" 
                                          className="btn-close" 
                                          data-bs-dismiss="alert" 
                                          aria-label="Close"
                                          onClick={props.clearError}></button>}
                </div>
            </div>}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        error: state.feedback.error
    };
}

export default connect(mapStateToProps,  { clearError })(Error);