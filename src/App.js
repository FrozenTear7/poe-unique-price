import React, {Component} from 'react'
import axios from 'axios'

class App extends Component {
  constructor() {
    super()

    this.state = {
      itemDesc: '',
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
    if (/Rarity: .*\n.*\n*/.test(state.itemDesc))
      state.itemDesc = state.itemDesc.match(/Rarity: .*\n.*\n/)[0]
    else
      alert('Wrong item description')

    if (!state.itemDesc.includes('Unique'))
      alert('The item is not unique')

    state.itemDesc = state.itemDesc.match(/\n.*/)[0].substr(1, state.itemDesc.match(/\n.*/)[0].length - 1)

    console.log(state.itemDesc)
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
