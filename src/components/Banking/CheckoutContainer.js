import React from 'react';
import CheckoutForm from './CheckoutForm'
import CurrencyInput from 'react-currency-input';
import { connect } from 'react-redux';
import { addChips, fetchChips, unsetChips  } from '../../redux/dispatchActions';

class CheckoutContainer extends React.Component{
    state = {
        amount: "",
        amountError: "",
        name: "",
        error: "",
        success: ""
    }

    componentDidMount() {
        this.props.fetchChips();
    }

    changeHandler = event => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleAmountChange = event => {
        this.setState({
            amount: event.target.value
        })
        this.validateAmount();
    }

    validateAmount = () => {
        const cents = parseFloat(this.state.amount.replace(/,/g, ''))*100
        if (cents < 50 ) {
            this.setState({
                amountError: 'Amount must be at least .50'
            })
        } else if (cents > 99999999) {
            this.setState({
                amountError: 'Amount must be no more than 999,999.99'
            })
        } else {
            this.setState({
                amountError: null
            })
        }
    }

    renderUser = () => {
        if (this.props.user) {
            return (
                <>
                    {this.props.user.username} <span className="chips">{this.props.chips}</span> <i className="nes-icon coin is-small"></i>
                </>
            )
        }
    }

    handleErrors = error => {
        this.setState({
            error: error
        })

    }

    renderErrors = () => {
        if (this.state.error) {
            return (
                <span className="nes-text is-error">
                    {this.state.error}<br/>
                </span>
            )
        }
    }

    clearMessages = () => {
        this.setState({
            success: "",
            error: ""
        })
    }


    
    goToWithdraw = () => {
        this.props.history.replace(`/users/${this.props.user.id}/bank/withdraw`)
    }

    render(){
        return(
            <div className="checkout_form">
                {/* {console.log(this.props)} */}
                <button onClick={this.goToWithdraw} className='nes-btn is-primary smaller-btn'>Withdraw</button>&nbsp;
                <button className='nes-btn is-primary smaller-btn'>Deposit</button><br/><br/>
                <h1 className="nes-text is-success">Buy More Chips!</h1> 
                {this.renderUser()}<br/><br/>
                {/* {this.props.user.username} ({this.props.chips})<br/><br/> */}

                {this.renderErrors()}
                {/* {this.renderSuccess()} */}

                1 USD = 10000 Chips*<br/>
                <label> 
                    {/* input must be at least .50 */}
                    {/* amount must be no more than 999,999.99 */}
                    <CurrencyInput 
                    className={`nes-input ${this.state.amountError ? 'is-error' : ''}`} 
                    name="amount" 
                    value={this.state.amount} 
                    onChangeEvent={this.handleAmountChange}
                    onBlur={this.validateAmount}
                    />
                </label><br/>
                <div className="nes-text is-error">{this.state.amountError}</div>
                <br/>

                <div>
                    <label>
                        {/* name must not be blank. */}
                        {/* <span className="label">Full Name *</span><br/> */}
                        <span>Full Name*</span><br/>
                        <input 
                        className="nes-input" 
                        placeholder="Pacman"
                        type="text" 
                        name="name" 
                        value={this.state.name} 
                        onChange={this.changeHandler}/>
                    </label><br/>
                    <label>
                        {/* <span className="label">Card Details</span><br/> */}
                        <span>Card Details*</span><br/>
                    <CheckoutForm 
                        history={this.props.history}
                        // setSuccess={this.props.setSuccess}
                        clearMessages={this.clearMessages}
                        handleErrors={this.handleErrors} 
                        handleSuccess={this.handleSuccess}
                        amount={this.state.amount} 
                        name={this.state.name} 
                        user={this.props.user} 
                        addChips={this.props.addChips}/>
                    </label>
                    <p className="nes-text is-disabled checkout_agreement">By clicking the "Exchange Chips!" button above, you are agreeing to our Terms of Service.</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        chips: state.chips
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchChips: userId => dispatch(fetchChips(userId)),
        addChips: (amount, userId, history) => dispatch(addChips(amount, userId, history)),
        unsetChips: () => dispatch(unsetChips())
        // setSuccess: () => dispatch(setSuccess())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);