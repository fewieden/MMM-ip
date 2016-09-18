# MMM-ip
IPv4/IPv6 Network Address Module for MagicMirror<sup>2</sup>

## Dependencies
  * An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)
  * Node.js > v0.6.0 for os.networkInterfaces()

## Installation
 1. Clone this repo into `~/MagicMirror/modules` directory.
 2. Configure your `~/MagicMirror/config/config.js`:

  * Basic Config:

    ```
    {
        module: 'MMM-ip',
        position: 'bottom_right'
    }
    ```
  * Full Config:

    ```
    {
        module: 'MMM-ip',
        position: 'bottom_right',
        config: {
            fontSize: 12,
            dimmed: false
            showFamily: 'IPv4',
            showType: 'eth0'
        }
    }
    ```

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `fontSize` | 9 | Font size in pixels |
| `dimmed` | true | Boolean for discrete visibility |
| `showFamily` | 'both' | Network Address family to display 'IPv4', 'IPv6' or 'both' |
| `showType` | 'both' | Network interface type to display 'eth0', 'wlan0' or 'both' |