import React, {Component} from 'react'

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
      activeItemId: '',
    }
  }

  mapResultList = (list) => {
    if (list.length <= 0)
      return (
        <h4>No results</h4>
      )
    else {
      return (
        <div>
          <h3>Best results:</h3>
          <ul className='list-group'>
            {list.map(item => {
              //console.log(item)
              return (
                <div key={item.id}>
                  <li className='list-group-item' onClick={() => {
                    if (this.state.activeItemId === item.id)
                      this.setState({
                        ...this.state,
                        activeItemId: '',
                      })
                    else
                      this.setState({
                        ...this.state,
                        activeItemId: item.id,
                      })
                  }}>{item.info.price.amount} - {item.info.price.currency}</li>
                  {this.state.activeItemId === item.id && item.item.explicitMods.map(mod => {
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

      fetch('http://www.pathofexile.com/api/trade/search/Bestiary?source=%7B"query":%7B"status":%7B"option":"online"%7D,"name":"Windripper","type":"Imperial Bow","stats":%5B%7B"type":"and","filters":%5B%5D%7D%5D%7D,"sort":%7B"price":"asc"%7D%7D', {method: 'GET'})
        .then(response => response.json())
        .then(response => {
            for (let i = 0; i < 10; i++) {
              fetch(`http://www.pathofexile.com/api/trade/fetch/${response.result.slice(i * 10, (i + 1) * 10).join()}?query=${responseFromPost.id}`, {method: 'GET'})
                .then(response => response.json())
                //.then(response => console.log(response.result))
                .then(response => this.setState({
                  ...this.state,
                  resultList: [...this.state.resultList, ...response.result],
                }))
            }
          },
        )

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
    state.activeItemId = ''
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
