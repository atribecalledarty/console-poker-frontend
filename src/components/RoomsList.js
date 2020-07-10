import React from 'react';
import RoomListItem from './RoomListItem';
import Cable from 'actioncable';
import { NavLink } from 'react-router-dom';
import { WS_URL } from '../utilities/BASE_URL'
// import coin from '../pictures/COIN.png';
import { hashStringToColor } from '../utilities/colorHash';

class RoomsList extends React.Component {
    state = {
        rooms: [],
        newForm: false
    }

    //websockets handlers
    handleData(data){
        if (data.type === 'current_rooms'){
            this.setState({
                rooms: data.rooms
            })
        } else if (data.type === 'new_room'){
            this.setState(prevState => ({
                rooms: [...prevState.rooms, data.room]
            }))
        }
        
    }

    // lifecycle hooks
    componentDidMount(){
        this.cable = Cable.createConsumer(`${WS_URL}/cable?token=${localStorage.getItem('token')}`);

        this.subscription = this.cable.subscriptions.create({
            channel: 'RoomsListChannel'
          }, {
            connected: () => {},
            disconnected: () => {},
            received: (data) => {
                console.log(data);
                this.handleData(data);
            }
        });
    }

    componentWillUnmount(){
        this.cable.subscriptions.remove(this.subscription);
        this.props.clearSuccess();
    }
    
    //component handlers
    changeHandler = event => {
        this.setState({
            name: event.target.value
        })
    }

    clickHandler = () => {
        this.props.logOut(this.props.history)
    }

    renderRooms = () => (this.state.rooms.map((room,index) => <RoomListItem key={index} index={index} room={room} wsSubscribeRoom={this.props.wsSubscribeRoom} history={this.props.history}/>))
    renderUser = () => {
        if (this.props.user) {
            return (
                <>
                {console.log(this.props.user)}
                    HELLO,&nbsp;
                    <span style={{color: `${hashStringToColor(this.props.user.username, this.props.hash)}`}}>{this.props.user.username}</span>&nbsp;
                    {/* <span className="chips">{this.props.chips}</span><img className="coin" src={coin} alt="coin_img" /> */}
                    <span className="chips">{this.props.chips}</span> <i className="nes-icon coin is-small"></i>
                </>
            )
        }
    }

    redirectToDeposits = () => {
        this.props.history.push(`/users/${this.props.user.id}/deposit`); // should i have route to something like /users/:id/deposit??
    }
    
    renderSuccess = () => {
        if (this.props.successMessage) {
            return (
                <span className="nes-text is-success">
                    {this.props.successMessage}<br/>
                </span>
            )
        }
    }

    render () {
        return (
            <div id="rooms_component">
                {this.renderSuccess()}
                {this.renderUser()}<br/>
                <button className="nes-btn smaller-btn is-error" id="test" onClick={this.clickHandler}>Log Out</button>&nbsp;
                <button className="nes-btn is-success smaller-btn" onClick={this.redirectToDeposits}>Deposit</button>&nbsp;
                <NavLink to="/rooms/new" className="nes-btn is-primary smaller-btn">New Room</NavLink><br/><br/><br/>
                {/* <div className="ne"></div> */}
                
                <h1>Join a Room!</h1>
                <p>Make sure you have enough chips!</p>
                
                <ul id="rooms_ul">
                    {this.renderRooms()}
                </ul>
                
            </div>
        )
    }
}

export default RoomsList;