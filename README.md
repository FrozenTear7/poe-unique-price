# Poe unique price

[Link to the page](https://frozentear7.github.io/poe-unique-price/)

This app allows you to quickly price check unique items accordingly to their mods rolls.
For the moment being it's not the most precise tool and we're looking for a new way to find
the best items on the market for price checking.

## How it works

First of all we use the information about currency prices from [poe.ninja](https://poe.ninja).
We convert everything into chaos orbs and then into exalted orbs.
We use the [Official trading site](https://www.pathofexile.com/trade) endpoints to send queries to find the best matching items.
Their api isn't officially public, we believe there is not problem with what we are doing,
but there is a limit for the number of requests, so if enough people would use our app
many of them would have to wait to make a price check.
We haven't found a way to avoid this for now.

## How does the price checking work

The official PoE trading site returns max 100 items, so we use filters to narrow down the
number of results to more than 20 and less than 100.
Then we throw away the above-average priced items and take an average from the rest of the items.
We only look at the offers of people that are online at the moment of price checking.

## Authors

* **Paweł Mendroch** - [FrozenTear7](https://github.com/FrozenTear7)
* **Wojciech Klemens**

## License

This project is licensed under the MIT License
