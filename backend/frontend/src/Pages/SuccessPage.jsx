import React from 'react';
import "../styles/SuccessPage.css";

const SuccessPage = () => {
  return (
    <div className='success-page-container'>
        <div className="card success-page-card">
            <div className="card-body success-page-card-body">
                <p className="success-page-content">
                    A Verification Email has been successfully sent to Email ID provided by you. Link will  expires in next 2 Hours, so please verify your account.
                </p>
            </div>
        </div>
    </div>
  )
}

export default SuccessPage;