import React, {Component} from 'react'
import axios from 'axios'

class App extends Component {
  constructor() {
    super()

    this.state = {
      itemDesc: '',
      itemName: '',
      itemMods: [],
      data: '',
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
      if (/Rarity: .*\n.*\n*/.test(state.itemDesc))
        state.itemName = state.itemDesc.match(/Rarity: .*\n.*\n/)[0]
      else {
        this.clearItem()
        return
      }

      if (!state.itemName.includes('Unique')) {
        this.clearItem()
        return
      }

      state.itemName = state.itemName.match(/\n.*/)[0].substr(1, state.itemName.match(/\n.*/)[0].length - 1)

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

      console.log(state.itemName)
      console.log(state.itemMods)

      this.setState(state)
    }
  }

  clearItem = () => {
    const state = this.state
    state.itemDesc = ''
    state.itemName = ''
    state.itemMods = []
    this.setState(state)
  }

  render() {
    const {itemDesc} = this.state

    return (
      <div className='container'>
        <h1 className='text-center'>
          Poe unique price
        </h1>
        <br/><br/><br/>
        <div className='row text-center'>
          <div className='col-lg-6'>
            <form onSubmit={this.onSubmit}>
              <div className='form-group'>
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
            Item list
          </div>
        </div>
      </div>
    )
  }
}

export default App
