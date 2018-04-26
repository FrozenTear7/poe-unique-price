import React, { Component } from 'react'
import { priceChaos, priceExalt } from './utils'
import Loading from './Loading'

class ItemList extends Component {
  constructor () {
    super()

    this.state = {
      activeId: ''
    }
  }

  render () {
    const {list, loading, error, currencyList} = this.props
    const {activeId} = this.state

    if (loading)
      return (
        <Loading/>
      )
    else if (error)
      return (
        <h2 className='alert-danger'>
          {error}
        </h2>
      )
    else if (!list || !currencyList)
      return (
        <span/>
      )
    else if (list.length <= 0)
      return (
        <h4>No results</h4>
      )
    else {
      return (
        <div>
          <h3>Best results:</h3>
          <ul className='list-group scroll'>
            {list.filter(item => item.listing && item.listing.price
              && priceChaos(currencyList, item.listing.price.amount, item.listing.price.currency) > 0)
              .sort((a, b) => {
                return priceChaos(currencyList, a.listing.price.amount, a.listing.price.currency) -
                  priceChaos(currencyList, b.listing.price.amount, b.listing.price.currency)
              })
              .map(item => {
                return (
                  <div key={item.id}>
                    <li className='list-group-item' onClick={() => {
                      if (activeId === item.id)
                        this.setState({
                          ...this.props,
                          activeId: '',
                        })
                      else
                        this.setState({
                          ...this.props,
                          activeId: item.id,
                        })
                    }}><h2> {priceChaos(currencyList, item.listing.price.amount, item.listing.price.currency)}
                      <img alt='Chaos Orb'
                           src='http://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?scale=1&w=1&h=1'/>
                      {'\t\t\t' + priceExalt(currencyList, item.listing.price.amount, item.listing.price.currency)}
                      <img alt='Exalted Orb'
                           src='http://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?scale=1&w=1&h=1'/>
                    </h2>
                    </li>
                    {activeId === item.id && item.item.explicitMods.map(mod => {
                      return (
                        <li key={mod}>{mod}</li>
                      )
                    })}
                  </div>
                )
              })}
          </ul>
        </div>
      )
    }
  }
}

export default ItemList
