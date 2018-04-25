import React, { Component } from 'react'
import { priceChaos, priceExalt } from './utils'

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
        <div>
          <img className='img-circle rotating' alt='Billy'
               src='data:image/jpeg;base64,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'/>
        </div>
      )
    else if (error)
      return (
        <h2 className='alert-danger'>
          {error}
        </h2>
      )
    else if (!list)
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
            {list.filter(item => item.info && item.info.price
              && priceChaos(currencyList, item.info.price.amount, item.info.price.currency) > 0).map(item => {
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
                  }}><h2> {priceChaos(currencyList, item.info.price.amount, item.info.price.currency)}
                    <img alt='Chaos Orb'
                         src='http://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?scale=1&w=1&h=1'/>
                    {'\t\t\t' + priceExalt(currencyList, item.info.price.amount, item.info.price.currency)}
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