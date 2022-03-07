import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getCookie } from '../auth/helpers';
import { clearSuccess, logError, updateReportingRange } from '../redux/actions';
import "./styles/Overview.scss";

const Overview = (props) => {

    const [startDate, setStartDate] = useState(props.landlord.reportingRange ? props.landlord.reportingRange.startDate.slice(0, 10) : null);
    const [endDate, setEndDate] = useState(props.landlord.reportingRange ? props.landlord.reportingRange.endDate.slice(0, 10) : null);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [net, setNet] = useState(0);

    useEffect(() => {
        // When loaded, call the api to ensure that the income overview data
        // is loaded into our Redux Store
        if (!props.userLoggedIn)
            return;

        // Call the API to get the - hang on - maybe not, should be loaded initially with landlord?!?!?!
        axios({
            method: 'GET',
            url: `${process.env.REACT_APP_API}/income/overview`,
            headers: { "Authorization": `Bearer ${getCookie('sessionToken')}` }
          })
            .then(response => {
              console.log(response.data);
              setIncome(response.data.result.income);
              setExpenses(response.data.result.expenses);
              setNet(response.data.result.net);
              props.clearSuccess();
            })
            .catch((err) => {
              props.logError(err.response ? err.response.data.error : err.message);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDateChange = (e) => {
        if(e.target.name === "start")
            setStartDate(e.target.value);
        
        if(e.target.name === "end")
            setEndDate(e.target.value);
    }

    const refreshOverview = () => {
        // This should be called when the user hits the refresh button - such as after updating the date range.
        // The first thing to do would be to call the action to update the date range stored against the Landlord account.
        props.updateReportingRange( startDate, endDate);
    }

    return (
        (props.landlordLoaded &&
        <div className="card shadow bg-indigo text-white">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <h4 className="card-title mb-3 mx-2">Income Overview</h4>
                    <div className="col-1 d-flex "><i className="bi bi-arrow-clockwise text-white" onClick={refreshOverview}/></div>
                </div>
                <div className="row ps-2 header">
                    <p className="col-3">Period:</p>
                    {/* <p className="col-4">5th April 2020</p> */}
                    <input type="date" 
                           className="col-4 bg-indigo text-white me-2" 
                           name="start"
                           value={startDate}
                           onChange={handleDateChange}
                           style={{border: '1px solid white', 
                                   borderRadius: '5px', 
                                   color: 'white', 
                                   fontSize:'0.8rem'}}
                    />
                    <input type="date" 
                           className="col-4 bg-indigo text-white" 
                           name="end" 
                           value={endDate}
                           onChange={handleDateChange}
                           style={{border: '1px solid white', 
                                   borderRadius: '5px', 
                                   color: 'white', 
                                   fontSize:'0.8rem'}}/>
                </div>
                <div className="row px-2">
                    <div className="card-body overview-details">
                        <ul className="list-group">
                            <li className="list-group-item lead text-success d-flex justify-content-between">
                                <span className="col-7">Income:</span><span className="col-5">{income}</span>
                            </li>
                            <li className="list-group-item lead text-danger d-flex justify-content-between">
                                <span className="col-7">Expenses:</span><span className="col-5">{expenses}</span>
                            </li>
                            <li className="list-group-item lead text-primary d-flex justify-content-between">
                                <span className="col-7">Net Income:</span><span className="col-5">{net}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>)
    );
}

const mapStateToProps = (state) => {
    return {
        landlord: state.landlord.landlord,
        landlordLoaded: state.landlord.landlordLoaded,
        userLoggedIn: state.user.userLoggedIn,
    };
}

export default connect(mapStateToProps, { updateReportingRange, logError, clearSuccess } )(Overview);