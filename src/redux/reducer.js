export default function resourceReducer (state = {
    // colorHash: '',
    user: undefined,
    errors: [],
    successMessage: "", //for displaying success message when deposit is successful.
    room: undefined,
    rooms: {},
    messages: [],
    game: undefined,
    logInPage: false,
    registerPage: false,
    processingMove: false,
    // gamePlayers: [],
    // gameErrors: undefined, //this will be used by gameboard
    // status: [] //this will be used by gameconsole, I need them separate becaue I don't want the console to
    // chips: undefined
}, action
) {
switch (action.type) {

// TOGGLING PAGES =====
//=====================

    case 'TOGGLE_LOGIN_PAGE':
        return {
            ...state,
            logInPage: !state.logInPage
        }
    case 'TOGGLE_REGISTER_PAGE':
        return {
            ...state,
            registerPage: !state.registerPage
        }

// AUTHENTICATION==========
// ========================

    case 'AUTH_FAIL':
        return {
            ...state,
            user: undefined
        }
    case 'AUTH_SUCCESS':
        return {
            ...state,
            user: action.user
        }
    case 'LOGOUT':
        return {
            ...state,
            user: undefined
        }

// USER CASES======
//=================

    case 'SET_USER':
        return {
            ...state,
            user: action.user
        }
    case 'SET_USER_CONNECTED':
        return {
            ...state,
            user: {
                ...state.user,
                connected: true
            }
        }
    case 'SET_USER_GAME':
        return {
            ...state,
            user: {
                ...state.user,
                game_id: action.game_id
            }
        }
    case 'SET_USER_GAME_NULL':
        return {
            ...state,
            user: {
                ...state.user,
                game_id: null
            }
        }
    case 'SET_CHIPS': // only for use on deposit page.
        return {
            ...state,
            user: {
                ...state.user,
                chips: action.chips
            }
        }

// ERRORS AND SUCCESSES =========
// ==============================

    case 'ADD_ERRORS':
        return {
            ...state,
            errors: action.errors
        }
    case 'CLEAR_ERRORS':
        return {
            ...state,
            errors: []
        }
    case 'SET_SUCCESS':
        return {
            ...state,
            successMessage: action.success
        }
    case 'CLEAR_SUCCESS':
        return {
            ...state,
            successMessage: ""
        }

// LOBBY CASES ==========
// ======================

    case 'SET_ROOMS':
        const roomsHash = {};
        action.rooms.forEach(r => {
            roomsHash[r.id] = r
        })
        return {
            ...state,
            rooms: roomsHash
        }
    case 'INCREMENT_NO_USERS':
        // console.log('in reducer', action.roomId);
        const roomsHash2 = { ...state.rooms };
        roomsHash2[action.roomId].no_users = roomsHash2[action.roomId].no_users + 1;
        return {
            ...state,
            rooms: roomsHash2
        }
    case 'DECREMENT_NO_USERS':
        const roomsHash3 = { ...state.rooms };
        roomsHash3[action.roomId].no_users = roomsHash3[action.roomId].no_users - 1;
        return {
            ...state,
            rooms: roomsHash3
        }
    case 'ADD_ROOM':
        return {
            ...state,
            rooms: [...state.rooms, action.room]
        }

// ROOM CASES ================
// ===========================

    case 'SET_ROOM':
        return {
            ...state,
            room: action.room
        }
    case 'DELETE_ROOM':
        return {
            ...state,
            room: undefined
        }
    case 'NEW_MESSAGE':
        return {
            ...state,
            messages: [...state.messages, action.message]
        }
    case 'CLEAR_MESSAGES':
        return {
            ...state,
            messages: []
        }
    case 'ROOM_USER_LEAVE':
        return {
            ...state,
            room: {
                ...state.room,
                no_users: state.room.no_users - 1
            }
        }
    case 'ROOM_USER_JOIN':
        return {
            ...state,
            room: {
                ...state.room,
                no_users: state.room?.no_users + 1
            }
        }

// GAME CASES ============
// =======================

    case 'SET_GAME':
        return {
            ...state,
            processingMove: false,
            game: action.game
        }
    case 'DELETE_GAME':
        return {
            ...state,
            user: {
                ...state.user,
                game_id: null
            },
            game: undefined
        }    
    case 'RESET_USER_GAME':
        return {
            ...state,
            user: {
                ...state.user,
                game_id: null
            }
        }
    case 'USER_JOIN':
        const s = state.game.seats_as_users
        s[action.seat_index] = action.user
        return {
            ...state,
            game: {
                ...state.game,
                seats_as_users: s,
                startable: action.startable
            }
        }
    case 'USER_LEAVE':
        const x = state.game.seats_as_users
        x[action.seat_index] = null
        return {
            ...state,
            game: {
                ...state.game,
                seats_as_users: x,
                startable: action.startable,
                active_round: {
                    ...state.game.active_round
                    // turn_as_json: null
                }
            }
        }
    case 'ROUND_OVER':
        return {
            ...state,
            game: {
                ...state.game,
                startable: action.startable,
                active_round: {
                    ...state.game.active_round,
                    is_playing: false,
                    turn_as_json: null
                }
            }
        }
    case 'UPDATE_WINNER':
        const u = state.game.seats_as_users
        u[action.winner_index].data.attributes.chips += action.winnings
        u[action.winner_index].data.attributes.winnings = action.winnings
        return {
            ...state,
            game: {
                ...state.game,
                seats_as_users: u
            }
        }
    case 'UPDATE_WINNERS_AND_ROUND':
        action.winner_indices.forEach(i => {
            state.game.seats_as_users[i].data.attributes.chips += action.winnings
            state.game.seats_as_users[i].data.attributes.winnings += action.winnings
        })
        state.game.seats_as_users.forEach((user, i) => {
            if (user !== null) {
                user.data.attributes.current_hand = action.seats_current_hand[i]
            }
        })
        return {
            ...state,
            game: {
                ...state.game,
                seats_as_users: state.game.seats_as_users,
                active_round: {
                    ...state.game.active_round,
                    phase: 3,
                    access_community_cards: action.access_community_cards
                }
            }
        }
    case 'PROCESS_MOVE':
        return {
            ...state,
            processingMove: true
        }
    case 'SET_MOVE':
        const seats_as_users = state.game.seats_as_users
        seats_as_users[action.turn_index] = action.turn_user
        return {
            ...state,
            game: {
                ...state.game,
                seats_as_users: seats_as_users
            }
        }
    case 'UPDATE_TURN':
        return {
            ...state,
            processingMove: false,
            game: {
                ...state.game,
                active_round: {
                    ...state.game.active_round,
                    turn_as_json: action.turn_as_json
                }
            }
        }
    case 'NEW_BETTING_PHASE':
        // need to reset all the round_bets
        // const nbp = state.game.seats_as_users;
        // nbp.forEach(user => {
        //     if (user !== null) {
        //         user.data.attributes.round_bet = 0;
        //         user.data.attributes.checked = false;
        //     }
        // })
        state.game.seats_as_users.forEach((user, i) => {
            if (user !== null) {
                user.data.attributes.round_bet = 0;
                user.data.attributes.checked = false;
                user.data.attributes.current_hand = action.seats_current_hand[i]
            }
        })

        return {
            ...state,
            processingMove: false,
            game: {
                ...state.game,
                active_round: {
                    ...state.game.active_round,
                    access_community_cards: action.access_community_cards,
                    pot: action.pot,
                    phase: action.phase,
                    turn_as_json: action.turn_as_json
                }
            }
        }
    // case 'UPDATE_ROUND':
    //     return {
    //         ...state,
    //         game: {
    //             ...state.game,
    //             active_round: action.round
    //         }
    //     }
    default:
        return state;
}
}