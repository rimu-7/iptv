# IPTV Channel Collection

A comprehensive IPTV channel collection in JSON format containing more than 1,200 live TV channels across multiple countries, languages, and content categories.

This project provides a structured dataset that can be easily integrated into web applications, mobile apps, media players, dashboards, and IPTV platforms.

**Web Player:** [https://iptv.viniball.workers.dev/](https://iptv.viniball.workers.dev/)

The channel data is aggregated from publicly available IPTV sources and open-source repositories.

---

## Overview

### Features

- 1,200+ Live TV Channels
- JSON-Based Dataset
- Multiple Languages and Regions
- Category-Based Organization
- Direct Stream URLs
- Channel Logo Support
- Easy API Consumption
- Lightweight Integration
- Suitable for Web, Mobile, Desktop, and Smart TV Applications
- Open Source and Self-Host Friendly

---

## Data Structure

Each channel is represented as a JSON object:

```json
{
  "name": "Ananda TV",
  "logo": "https://example.com/logo.png",
  "group": "Bangla",
  "url": "https://example.com/stream.m3u8"
}
```

### Field Reference

| Field   | Type   | Description                           |
| ------- | ------ | ------------------------------------- |
| `name`  | String | Channel name                          |
| `logo`  | String | Channel logo URL                      |
| `group` | String | Channel category, language, or region |
| `url`   | String | Live stream URL                       |

---

## Data Sources

### Raw JSON

```
https://raw.githubusercontent.com/rimu-7/iptv/refs/heads/main/channels.json
```

### GitHub Repository

```
https://github.com/rimu-7/iptv
```

### Web Player

```
https://iptv.viniball.workers.dev/
```

---

## Collection Statistics

| Metric               | Value    |
| -------------------- | -------- |
| Total Channels       | 1,200+   |
| Format               | JSON     |
| Categories           | Multiple |
| Countries            | Multiple |
| Languages            | Multiple |
| Logos Included       | Yes      |
| Stream URLs Included | Yes      |
| Open Source          | Yes      |

---

## Available Categories

The collection includes channels from a wide range of categories, including but not limited to:

- Bangla
- Sports
- News
- Movies
- Entertainment
- Music
- Kids
- Documentary
- Religious
- International

Additional categories may be added as the dataset grows.

---

## Getting Started

### Fetch the Dataset

#### JavaScript

```javascript
fetch(
  "https://raw.githubusercontent.com/rimu-7/iptv/refs/heads/main/channels.json",
)
  .then((response) => response.json())
  .then((channels) => {
    console.log(channels);
  })
  .catch((error) => {
    console.error(error);
  });
```

#### Python

```python
import requests

channels = requests.get(
    "https://raw.githubusercontent.com/rimu-7/iptv/refs/heads/main/channels.json"
).json()

print(channels[0])
```

---

## Integration Examples

### Filter by Category

```javascript
const sportsChannels = channels.filter((channel) => channel.group === "Sports");
```

### Search by Channel Name

```javascript
const results = channels.filter((channel) =>
  channel.name.toLowerCase().includes(searchTerm.toLowerCase()),
);
```

### Generate Category List

```javascript
const categories = [...new Set(channels.map((channel) => channel.group))];
```

---

## Use Cases

This dataset can be used for:

- IPTV Web Applications
- IPTV Mobile Applications
- Smart TV Applications
- OTT Platforms
- Media Dashboards
- Channel Discovery Services
- Educational and Research Projects
- Personal IPTV Collections

---

## Project Structure

```text
iptv/
├── channels.json
├── README.md
└── LICENSE
```

---

## Data Quality and Availability

Channel streams are maintained by their respective providers and public sources.

As a result:

- Stream URLs may become unavailable without notice.
- Channel logos may change or become inaccessible.
- Some streams may be geo-restricted.
- Availability and reliability depend on the original source.

Applications consuming this dataset should implement proper error handling and fallback mechanisms.

---

## Legal Disclaimer

This repository does not host, store, retransmit, distribute, or control any television channels, media streams, or copyrighted content.

The repository only provides references to publicly accessible stream URLs collected from publicly available sources and open-source IPTV projects.

All trademarks, logos, channel names, and media content belong to their respective owners.

If you are a copyright owner and believe a stream reference should be removed, please open an issue with the relevant details.

---

## Contributing

Contributions are welcome.

You can help by:

- Adding new channels
- Fixing broken stream URLs
- Updating channel logos
- Improving metadata quality
- Enhancing documentation
- Reporting issues

### Contribution Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your updates
5. Open a pull request

---

## License

This project is licensed under the **GNU General Public License v3.0 (GPL-3.0)**.

For full license details:

[https://www.gnu.org/licenses/gpl-3.0.en.html](https://www.gnu.org/licenses/gpl-3.0.en.html)

---

## Credits

This project would not be possible without the maintainers and contributors of various open-source IPTV repositories and publicly available streaming resources.

Special thanks to the open-source community for making IPTV-related data more accessible and easier to integrate into modern applications.

---

## Support the Project

If this project is useful to you:

- Star the repository
- Fork the repository
- Share it with others
- Contribute improvements
- Report issues and broken channels

---

## Links

**Repository**
[https://github.com/rimu-7/iptv](https://github.com/rimu-7/iptv)

**Raw JSON**
[https://raw.githubusercontent.com/rimu-7/iptv/refs/heads/main/channels.json](https://raw.githubusercontent.com/rimu-7/iptv/refs/heads/main/channels.json)

**Web Player**
[https://iptv.viniball.workers.dev/](https://iptv.viniball.workers.dev/)

---
