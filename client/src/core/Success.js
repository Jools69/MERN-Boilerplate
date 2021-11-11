import React from 'react';
import { connect } from 'react-redux';
import { clearSuccess } from '../redux/actions';

const Success = (props) => {

    const { success, showClose = false} = props;

    return (
        <div>
            {success.message && <div>
                <div className="alert alert-success alert-dismissible fade show my-3" role="alert">
                    {success.message}
                    {showClose && <button type="button" 
                                          className="btn-close" 
                                          data-bs-dismiss="alert" 
                                          aria-label="Close"
                                          onClick={props.clearSuccess}></button>}
                </div>
            </div>}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        success: state.feedback.success
    };
}

export default connect(mapStateToProps, { clearSuccess })(Success);