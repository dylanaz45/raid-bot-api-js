# Raid Bot API
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=dylanaz45_raid-bot-api-js&metric=security_rating)](https://sonarcloud.io/dashboard?id=dylanaz45_raid-bot-api-js)
[![Known Vulnerabilities](https://snyk.io/test/github/dylanaz45/raid-bot-api-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dylanaz45/raid-bot-api-js?targetFile=package.json)

A REST API that connects [Raid Bot](https://github.com/dylanaz45/raid-bot) to a MongoDB database. BeautifulSoup was 
used to obtain majority of the data for the database. Postman is used for testing.

## Features 
* With the introduction of Max Raid Battles in Pokémon Sword and Shield, which is a featture that allows a person to 
host a battle against a Pokémon and invite up to three other people to battle and catch that Pokémon, many hosts will 
organize these events on Discord. This API features a system that allows hosts to register what Max Raid Battle den they
are hosting and allows users to view what raid battles are currently active. This system could aid in organizing these 
events and prevent confusion with regard to what raids are being hosted as multiple hosts could be hosting in a channel.
* Data for all dens that can be found in the base game and in the Isle of Armor DLC, which includes what ability can 
be found in a den and what dens can a Pokemon be found in.
* Shiny sprites of requested Pokémon including regional forms, mega evolutions, and other forms.
* Data on Pokemon characteristics, moves, items, and abilities
* Pokemon Showdown sets
* A database of quotes and dad jokes.

## Routes

### Raid Management System

#### ```/start```
| Method | Description                                          | Parameters                                                                                                                     |
|--------|------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| POST   | Register a user to signify that their raid is active | {token: \<API token\>, _id: \<Discord ID\>, name: \<name of the Discord user\>, den: \<Pokemon den that the user is hosting\>} |

#### ```/end```
| Method | Description                                   | Parameters                                  |
|--------|-----------------------------------------------|---------------------------------------------|
| DELETE | Delete a user's registered raid if one exists | {token: \<API token\>, _id: \<Discord ID\>} |

#### ```/active```
| Method | Description                | Parameters             |
|--------|----------------------------|------------------------|
| GET    | Get a list of active raids | {token: \<API token\>} |

### Pokemon Data

#### ```/den_info```
| Method | Description                                                      | Parameters                                          |
|--------|------------------------------------------------------------------|-----------------------------------------------------|
| GET    | Get what ability can be found in the Pokemon Max Raid Battle den | {token: \<API token\>, den: \<Pokemon den number\>} |

#### ```/den_poke```
| Method | Description                                                         | Parameters                                     |
|--------|---------------------------------------------------------------------|------------------------------------------------|
| GET    | Get a list of Max Raid Battle dens that the Pokemon can be found in | {token: \<API token\>, name: \<Pokemon name\>} |

#### ```/sprite```
| Method | Description                                                         | Parameters                                     |
|--------|---------------------------------------------------------------------|------------------------------------------------|
| GET    | Get the ID of a Pokemon, which corresponds to the sprite's filename | {token: \<API token\>, name: \<Pokemon name\>} |

#### ```/data```
| Method | Description                                                         | Parameters                                   |
|--------|---------------------------------------------------------------------|----------------------------------------------|
| GET    | Get a list of Max Raid Battle dens that the Pokemon can be found in | {token: \<API token\>, name: <Pokemon name>} |

#### ```/set```
| Method | Description                                                                                    | Parameters                                                                                                                                                                  | Body                            |
|--------|------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| GET    | Get a random Showdown/Smogon set (or all sets) for a Pokemon in a specific tier and generation | {token: \<API token\>, name: \<Pokemon name\>, tier: \<Smogon tier\>, gen: \<Pokemon generation number\>, size: \<either "one" or "all" to specify how many sets to send\>} | None                            |
| POST   | Insert Showdown sets into a MongoDB collection                                                 | {token: \<API token\>}                                                                                                                                                      | JSON formatted array of objects |

### Random Data

#### ```/quote```
| Method | Description        | Parameters             |
|--------|--------------------|------------------------|
| GET    | Get a random quote | {token: \<API token\>} |

#### ```/dadjoke```
| Method | Description           | Parameters             |
|--------|-----------------------|------------------------|
| GET    | Get a random dad joke | {token: \<API token\>} |

## Credits
* [Serebii](https://serebii.net/) for the data on the dens
* Pokemon Showdown
* The Pokemon Company, Nintendo, and Game Freak
