import React, { Component } from 'react'
import TextareaAutosize from 'react-autosize-textarea'
import mods from './mods'
import ItemList from './ItemList'
import { getFilterQuery, getItemType, getItemName, getListAvgChaos, getListAvgExalt } from './utils'
import Loading from './Loading'

class App extends Component {
  constructor () {
    super()

    this.state = {
      itemDesc: '',
      league: 'Bestiary',
      resultList: null,
      loadingList: false,
      errorList: null,
      mods: mods.mods,
      currencyList: null,
      leagues: null
    }
  }

  componentWillMount = async () => {
    await fetch('https://cors-anywhere.herokuapp.com/http://www.pathofexile.com/api/leagues?type=main', {method: 'GET'})
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          this.setState({
            ...this.state,
            errorList: response.error.message,
          })
        } else
          this.setState({...this.state, leagues: response.filter(league => !/SSF.*/.test(league.id))})
      })
  }

  getCurrencyList () {
    const {league} = this.state

    fetch(`https://cors-anywhere.herokuapp.com/http://poe.ninja/api/Data/GetCurrencyOverview?league=${league}`, {method: 'GET'})
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          this.setState({
            ...this.state,
            errorList: response.error.message,
          })
        } else
          this.setState({...this.state, currencyList: response})
      })
  }

  getResultList = (eps) => {
    const {league, itemDesc} = this.state

    fetch(`https://cors-anywhere.herokuapp.com/http://www.pathofexile.com/api/trade/search/${league}?source=%7B"query":
      %7B"status":%7B"option":"online"%7D,"name":"${getItemName(itemDesc)}","type":"${getItemType(itemDesc)}","stats":
      %5B%7B"type":"and","filters":%5B${getFilterQuery(itemDesc, eps)}%5D%7D%5D%7D,"sort":%7B"price":"asc"%7D%7D`, {method: 'GET'})
      .then(response => response.json())
      .then(response => {
          if (response.error) {
            this.setState({
              ...this.state,
              errorList: response.error.message,
            })
          } else {
            if (response.total >= 20 && response.total <= 100)
              for (let i = 0; i < 10 && i < Math.ceil(response.total / 10); i++) {
                fetch(`https://www.pathofexile.com/api/trade/fetch/${response.result.slice(i * 10, (i + 1) * 10)
                  .join()}?query=${response.id}`, {method: 'GET'})
                  .then(response => response.json())
                  .then(response => {
                    if (response.error) {
                      this.setState({
                        ...this.state,
                        errorList: response.error.message,
                      })
                    } else if (!this.state.resultList)
                      this.setState({
                        ...this.state,
                        resultList: response.result,
                      })
                    else
                      this.setState({
                        ...this.state,
                        resultList: [...this.state.resultList, ...response.result],
                      })
                  })

                if (i === 9 || i === Math.ceil(response.total / 10) - 1)
                  this.setState({...this.state, loadingList: false})
              }
            else if (response.total < 20)
              this.getResultList(eps + 1)
            else if (response.total > 100)
              this.getResultList(eps - 1)
          }
        },
      )
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  onSubmit = (e) => {
    e.preventDefault()

    let {itemDesc} = this.state

    if (itemDesc !== '' && /Rarity: Unique(.|\n)*/.test(itemDesc)) {
      this.setState({...this.state, loadingList: true, resultList: null, errorList: null})

      this.getCurrencyList()
      this.getResultList(1)
    } else
      this.setState({...this.state, errorList: 'Wrong item description'})
  }

  clearItem = () => {
    const state = this.state
    state.itemDesc = ''
    state.resultList = null
    state.loadingList = false
    state.errorList = null
    this.setState(state)
  }

  render () {
    const {loadingList, resultList, errorList, itemDesc, currencyList, leagues} = this.state

    if (leagues)
      return (
        <div className='container-fluid'>
          <nav className='navbar navbar-expand-lg navbar-light bg-dark'>
            <a className='navbar-brand' style={{color: 'white'}}>Poe unique price</a>
            <button type='button' className='btn-sm btn-info' data-toggle='modal' data-target='#help'>
              Help
            </button>
            <div className='modal fade' id='help' role='dialog'
                 aria-labelledby='helpLabel' aria-hidden='true'>
              <div className='modal-dialog' role='document'>
                <div className='modal-content'>
                  <div className='modal-header'>
                    <h5 className='modal-title' id='helpLabel'>Example description</h5>
                    <button type='button' className='close' data-dismiss='modal' aria-label='Close'
                            disabled={this.state.loadingList}>
                      <span aria-hidden='true'>&times;</span>
                    </button>
                  </div>
                  <div className='modal-body'>
                    Rarity: Unique<br/>
                    Chin Sol<br/>
                    Assassin Bow<br/>
                    --------<br/>
                    Bow<br/>
                    Quality: +20% (augmented)<br/>
                    Physical Damage: 86-255 (augmented)<br/>
                    Elemental Damage: 25-50 (augmented)<br/>
                    Critical Strike Chance: 6.50%<br/>
                    Attacks per Second: 1.39 (augmented)<br/>
                    --------<br/>
                    Requirements:<br/>
                    Level: 62<br/>
                    Dex: 212<br/>
                    --------<br/>
                    Sockets: G-G-R-G<br/>
                    --------<br/>
                    Item Level: 72<br/>
                    --------<br/>
                    167% increased Physical Damage<br/>
                    +20 to Dexterity<br/>
                    Adds 25 to 50 Fire Damage<br/>
                    11% increased Attack Speed<br/>
                    100% More Damage with Arrow Hits at Close Range<br/>
                    Bow Knockback at Close Range<br/>
                    --------<br/>
                    As a soldier you want to get close to enemy archers.<br/>
                    That is not the case when fighting the Maraketh.<br/>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          <br/><br/><br/>
          <div className='row text-center'>
            <div className='col-lg-6'>
              <form onSubmit={this.onSubmit}>
                <div className='form-group'>
                  <select className='custom-select mb-2 mr-sm-2 mb-sm-0' name='league' defaultValue='Bestiary'
                          onChange={this.onChange}>
                    {this.state.leagues.map(league => <option key={league.id}
                                                              value={league.id.replace(' ', '%20')}>{league.id}</option>)}
                  </select>
                  <br/>
                  <label>Paste the unique item below you want to price check</label>
                  <TextareaAutosize className='form-control' style={{minHeight: 100, fontSize: 12}} name='itemDesc'
                                    placeholder='Item description' value={itemDesc} onChange={this.onChange}/>
                </div>
                <button disabled={loadingList || itemDesc === ''} type='submit' className='btn btn-outline-success'>
                  Check price
                </button>
              </form>
              <br/>
              <button className='btn-sm btn-outline-danger' onClick={this.clearItem}>
                Clear
              </button>
            </div>
            <div className='col-lg-6'>
              {resultList &&
              <h2 className='alert-success'>
                Estimated price: {getListAvgChaos(currencyList, resultList)}
                <img alt='Chaos Orb'
                     src='http://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png?scale=1&w=1&h=1'/>
                {'\t\t\t' + getListAvgExalt(currencyList, resultList)}
                <img alt='Exalted Orb'
                     src='http://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?scale=1&w=1&h=1'/>
              </h2>}
              <br/>
              {<ItemList list={resultList} loading={loadingList} error={errorList} currencyList={currencyList}/>}
            </div>
          </div>
        </div>
      )
    else
      return <Loading/>
  }
}

export default App
