import jsonMods from './mods'

const getModValue = (mod) => {
  if (mod.match(/\d+/g)) {
    if (mod.match(/\d+/g)[1])
      return Math.floor((+(mod.match(/\d+/g)[0]) + +(mod.match(/\d+/g)[1])) / 2)
    else
      return +mod.match(/\d+/g)[0]
  }
  else
    return null
}

export const getFilterQueue = (itemDesc) => {
  const mods = jsonMods.mods
  let itemMods

  itemMods = itemDesc.split('\n')
  let startIndex, endIndex

  for (let i = itemMods.length - 1, countLines = 0; i >= 0; i--) {
    if (/--------/.test(itemMods[i])) {
      countLines++
    }

    if (countLines === 2) {
      startIndex = i + 1
      break
    }
  }

  for (let i = itemMods.length - 1, countLines = 0; i >= 0; i--) {
    if (/--------/.test(itemMods[i])) {
      countLines++
    }

    if (countLines === 1) {
      endIndex = i
      break
    }
  }

  itemMods = itemMods.slice(startIndex, endIndex)

  const tmpMods = itemMods.map(mod => mod.replace(/[\d*#+%]/g, '').replace(/ {2}/g, ' ').replace(/^ /g, ''))
  const tmpItemMods = itemMods

  let itemBase = itemDesc.match(/^.*\n.*\n.*\n--------\n.*\n/)[0].match(/--------\n.*/)[0].split('\n')[1]

  let filterQuery = []

  for (let i = 0; i < mods.length; i++) {
    for (let j = 0; j < tmpMods.length; j++) {
      if ((['increased Physical Damage (Local)', 'increased Attack Speed (Local)',
            'Adds to Physical Damage (Local)', 'Adds to Lightning Damage (Local)',
            'Adds to Cold Damage (Local)', 'Adds to Fire Damage (Local)', 'to Accuracy Rating (Local)',
            'chance to Poison on Hit (Local)', 'increased Accuracy Rating (Local)', 'Adds to Chaos Damage (Local)']
            .includes(mods[i].text.replace(/[#+%]/g, '').replace(/ {2}/g, ' ').replace(/^ /g, ''))
          && mods[i].text.replace(/[#+%]/g, '').replace(/ {2}/g, ' ').replace(/^ /g, '') === tmpMods[j] + ' (Local)'
          && ['Bow', 'One Hand Axe', 'Two Hand Axe', 'Claw', 'Dagger', 'One Hand Mace', 'Two Hand Mace', 'Staff',
            'One Hand Sword', 'Two Hand Sword', 'Wand'].includes(itemBase))
        || (['# to maximum Energy Shield (Local)', '#% increased Evasion Rating (Local)', '#% increased Armour (Local)',
            '# to Armour (Local)', '# to Evasion Rating (Local)']
            .includes(mods[i].text.replace(/[#+%]/g, '').replace(/ {2}/g, ' ').replace(/^ /g, ''))
          && mods[i].text.replace(/[#+%]/g, '').replace(/ {2}/g, ' ').replace(/^ /g, '') === tmpMods[j] + ' (Local)'
          && ['Body Armour', 'Boots', 'Gloves', 'Helmet', 'Shield'].includes(itemBase))
        || mods[i].text.replace(/[#+%]/g, '').replace(/ {2}/g, ' ').replace(/^ /g, '') === tmpMods[j]) {
        filterQuery = [...filterQuery, {id: mods[i].id, value: getModValue(tmpItemMods[j])}]
        tmpMods.splice(tmpMods.indexOf(tmpMods[j]), 1)
        tmpItemMods.splice(tmpMods.indexOf(tmpMods[j]), 1)
        break
      }
    }
  }

  let filterMods = ``

  for (let i = 0; i < filterQuery.length; i++) {
    filterMods += `%7B"id":"${filterQuery[i].id}"`
    if (filterQuery[i].value) {
      filterMods += `,"value":%7B"min":10%7D`
    }
    filterMods += '%7D'
    if (i !== filterQuery.length - 1)
      filterMods += ','
  }

  return filterMods
}

export const getItemName = (itemDesc) => {
  if (/Rarity: .*\n.*\n*/.test(itemDesc))
    return itemDesc.match(/Rarity: .*\n.*\n/)[0].split('\n')[1]
}

export const getItemType = (itemDesc) => {
  if (/Rarity: .*\n.*\n*/.test(itemDesc))
    return itemDesc.match(/Rarity: .*\n.*\n.*\n/)[0].split('\n')[2]
}

export const priceChaos = (currencyList, amount, name) => {
  const reg = new RegExp('.*' + name[0].toUpperCase() + name.substring(1, name.length) + '.*')
  if (name === 'chaos')
    return amount
  else
    return amount * currencyList.lines.filter(currency => {
      if (reg.test(currency.currencyTypeName))
        return currency
    })[0].chaosEquivalent.toFixed(1)
}

export const priceExalt = (currencyList, amount, name) => {
  const reg = new RegExp('.*' + name[0].toUpperCase() + name.substring(1, name.length) + '.*')
  if (name === 'exalted')
    return amount
  else if (name === 'chaos')
    return (amount / currencyList.lines[3].chaosEquivalent).toFixed(2)
  else
    return (amount * currencyList.lines.filter(currency => {
      if (reg.test(currency.currencyTypeName))
        return currency
    })[0].chaosEquivalent / currencyList.lines[3].chaosEquivalent).toFixed(3)
}