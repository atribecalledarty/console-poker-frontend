import React from 'react';
// import dealerChip from '../../pictures/dealer_chip.webp';
import { useSelector, useDispatch } from 'react-redux';
import { sitDown } from '../../redux/gameActions';
import './Player.css';
import PlayerCards from './PlayerCards';
import PlayerCardRank from './PlayerCardRank';

function Player({ position, user, images }) {
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.user);
    const round = useSelector(state => state.game.active_round);
    const game = useSelector(state => state.game);

    if (!loggedInUser.game_id && !user) {
        return <div onClick={() => dispatch(sitDown(game.id, position))} className={`player player--${position} ${!user ? 'player--empty' : ''}`}>
                <span className="player__sit">Sit</span>
        </div>
    } else if (user) {
        return <div className={`player ${(user.id === round?.turn_as_json?.id && round.is_playing) ? 'player--turn' : 'player' } player--${position} ${!user ? 'player--empty' : ''}`}>
            <div className="player__cards">
                <PlayerCards user={user} loggedInUser={loggedInUser} images={images} round={round}/>
                <PlayerCardRank user={user} loggedInUser={loggedInUser} round={round}/>
            </div>
            
            {user.dealer && 
                <img className="player__dealerChip" alt='dealerChip' src='https://console-poker.s3.us-east-2.amazonaws.com/DEALER.png'/>}
            {user.winnings > 0 && 
                <span className="player__roundWinnings">+{user.winnings}</span>}
            {(user.round_bet !== 0 || user.checked) && 
                <span className="player__roundBet">{user.checked && user.round_bet === 0 ? 'check' : user.round_bet}</span>}

            <div className="player__info">
                <div className="player__username">{user.username}</div>
                <div className="player__chips">{user.chips}</div>
            </div>

        </div>
    } else if (loggedInUser.game_id && !user){
        return ""
    }
}

export default Player;