import React, { Component } from 'react'
import Card from './Card'
import './styles/Deck.css'
import Axios from 'axios';

const SHUFFLE_URL = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
const DRAWCARD_URL = `https://deckofcardsapi.com/api/deck/`
const DRAW_URL = `/draw/?count=1`

export default class Deck extends Component {

    constructor(props) {
        super(props)

        this.state = {
            deck: null,
            drawnCard: []
        }

        this.getCard = this.getCard.bind(this)
    }

    async componentDidMount() {
        await Axios.get(SHUFFLE_URL)
        .then((responses) => {
            this.setState({ deck: responses.data })
        })
        .catch((err) => alert(err))
    }

    async getCard() {
        const {deck} = this.state
        try {
            let cardRes = await Axios.get(DRAWCARD_URL+deck.deck_id+DRAW_URL)
            if(!cardRes.data.success) {
                throw new Error('No card remaining!')
            }
            let card = cardRes.data.cards[0]
            this.setState((st) => ({
                drawnCard: [
                    ...st.drawnCard,
                    {
                        id: card.code,
                        image: card.image,
                        name: `${card.value} of ${card.suit}`
                    }
                ]
            }))
        } catch(err) {
            alert(err)
        }
    }

    render() {
        const cards = this.state.drawnCard.map(c => (
            <Card image={c.image} name={c.name} key={c.id} />
        ))
        return (
            <div className='Deck'>
                <h1 className='Deck-title'>🔹 Welcome To Card Dealer ! 🔹</h1>
                <h2 className='Deck-title subtitle'>🔹 A little demo made with React 🔹</h2>
                <button className='Deck-btn' onClick={this.getCard}>Get Card!</button>
                <div className='Deck-cardarea'>
                    {cards}
                </div>
            </div>
        )
    }
}
