import React, {Component} from 'react'
import axios from 'axios'

const responseFromPost = {
  'result': ['9a69d65b6e5aa19dbfb356d0a8704bb9adc74ce841267fb13bba6532cb094c9f', '323a03939464957a8509049c539ae4fe1c679d31596cdfe13ce6434061407336'],
  'id': 'waokcy',
  'total': 2,
}

class App extends Component {
  constructor() {
    super()

    this.state = {
      itemDesc: '',
      itemName: '',
      itemType: '',
      itemMods: [],
      league: 'Bestiary',
      resultList: [],
    }
  }

  mapResultList = (list) => {
    if (list.length <= 0)
      return (
        <h4>No results</h4>
      )
    else {
      console.log(list)
      return (
        <div>
          <h3>Best results:</h3>
          <ul className='list-group'>
            {list.map(item => {
              return (
                <div className='dropdown'>
                  <li key={item.id}
                      className='list-group-item dropdown-toggle' type="button"
                      id={item.id} data-toggle="dropdown" aria-haspopup="true"
                      aria-expanded="false">{item.info.price.amount} - {item.info.price.currency}</li>
                  <div className="dropdown-menu" aria-labelledby={item.id}>
                    {item.item.explicitMods.map(mod => {
                      return (
                        <li className="dropdown-item" key={mod}>{mod}</li>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </ul>
        </div>
      )
    }
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value
    this.setState(state)
  }

  onSubmit = (e) => {
    e.preventDefault()
    const state = this.state

    if (state.itemDesc !== '') {
      //read item name
      if (/Rarity: .*\n.*\n*/.test(state.itemDesc)) {
        state.itemName = state.itemDesc.match(/Rarity: .*\n.*\n/)[0]
        state.itemType = state.itemDesc.match(/Rarity: .*\n.*\n.*\n/)[0]
      } else {
        this.clearItem()
        return
      }

      if (!state.itemName.includes('Unique')) {
        this.clearItem()
        return
      }

      state.itemName = state.itemName.split('\n')[1]
      state.itemType = state.itemType.split('\n')[2]

      //read item mods
      state.itemMods = state.itemDesc.split('\n')
      let startIndex, endIndex

      for (let i = state.itemMods.length - 1, countLines = 0; i >= 0; i--) {
        if (/--------/.test(state.itemMods[i])) {
          countLines++
        }

        if (countLines === 2) {
          startIndex = i + 1
          break
        }
      }

      for (let i = state.itemMods.length - 1, countLines = 0; i >= 0; i--) {
        if (/--------/.test(state.itemMods[i])) {
          countLines++
        }

        if (countLines === 1) {
          endIndex = i
          break
        }
      }

      state.itemMods = state.itemMods.slice(startIndex, endIndex)

      /*
            axios.post('http://www.pathofexile.com/api/trade/search/Bestiary', {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
              },
              data: {
                'query': {
                  'status': {'option': 'online'},
                  'name': state.itemName,
                  'type': state.itemType',
                  'stats': [{'type': 'and', 'filters': []}],
                }, 'sort': {'price': 'asc'},
              },
            })*/

      axios.get(`https://www.pathofexile.com/api/trade/fetch/${(responseFromPost.result.join()).replace(/'/gi, '')}?query=${responseFromPost.id}`)
        .then(response => this.setState({...this.state, resultList: response.data.result}))

      this.setState(state)
    }
  }

  clearItem = () => {
    const state = this.state
    state.itemDesc = ''
    state.itemName = ''
    state.itemType = ''
    state.itemMods = []
    state.resultList = []
    this.setState(state)
  }

  render() {
    const {itemDesc, resultList} = this.state

    return (
      <div className='container-fluid'>
        <nav className='navbar navbar-expand-lg navbar-light bg-dark'>
          <a className='navbar-brand' style={{color: 'white'}}>Poe unique price</a>
        </nav>
        <br/><br/><br/>
        <div className='row text-center'>
          <div className='col-lg-6'>
            <form onSubmit={this.onSubmit}>
              <div className='form-group'>
                <select className='custom-select mb-2 mr-sm-2 mb-sm-0' name='league' defaultValue='Bestiary'
                        onChange={this.onChange}>
                  <option value='Bestiary'>Bestiary</option>
                  <option value='Standard'>Standard</option>
                </select>
                <br/>
                <label>Paste the unique item below you want to price check</label>
                <textarea className='form-control' style={{height: 600, fontSize: 12}} name='itemDesc'
                          placeholder='Item description' value={itemDesc} onChange={this.onChange}/>
              </div>
              <button type='submit' className='btn btn-outline-success'>Check price</button>
            </form>
            <br/>
            <button className='btn-sm btn-outline-danger' onClick={this.clearItem}>Clear</button>
          </div>
          <div className='col-lg-6'>
            <h2>Estimated price: </h2>
            <br/>
            {this.mapResultList(resultList)}
          </div>
        </div>
      </div>
    )
  }
}

export default App
