# MMM-ip [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/fewieden/MMM-ip/master/LICENSE) [![Build Status](https://travis-ci.org/fewieden/MMM-ip.svg?branch=master)](https://travis-ci.org/fewieden/MMM-ip) [![Code Climate](https://codeclimate.com/github/fewieden/MMM-ip/badges/gpa.svg?style=flat)](https://codeclimate.com/github/fewieden/MMM-ip) [![Known Vulnerabilities](https://snyk.io/test/github/fewieden/mmm-ip/badge.svg)](https://snyk.io/test/github/fewieden/mmm-ip)

IPv4/IPv6 Network Address Module for MagicMirror<sup>2</sup>

## Example

![](.github/example.jpg) ![](.github/example2.jpg)

## Dependencies

* An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
* OPTIONAL: [Voice Control](https://github.com/fewieden/MMM-voice)
* Node.js > v0.6.0 for os.networkInterfaces()

## Installation

1. Clone this repo into `~/MagicMirror/modules` directory.
1. Configure your `~/MagicMirror/config/config.js`:

```
{
    module: 'MMM-ip',
    position: 'bottom_right',
    config: {
        ...
    }
}
```

## Config Options

| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `fontSize` | `9` | Font size in pixels. Only if `voice` is set to `false` |
| `dimmed` | `true` | Boolean for discrete visibility |
| `showFamily` | `'both'` | Network Address family to display `'IPv4'`, `'IPv6'` or `'both'` |
| `showType` | `'both'` | Network interface type to display `'eth0'`, `'wlan0'` or `'both'` |
| `voice` | `false` | Boolean for optional voice commands |

## OPTIONAL: Voice Control

This module supports voice control by [MMM-voice](https://github.com/fewieden/MMM-voice). In order to use this feature, it's required to install the voice module and set voice in config options to true.

### Mode

The voice control mode for this module is `NETWORK`

### List of all Voice Commands

* OPEN HELP -> Shows the information from the readme here with mode and all commands.
* CLOSE HELP -> Hides the help information.
* SHOW INTERFACES -> Shows network interfaces based on config options with mac addresses.
* HIDE INTERFACES -> Hide network interfaces.
