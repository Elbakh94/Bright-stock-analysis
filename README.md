# Bright Stock Analysis - iOS App

A professional iOS application for real-time stock market analysis and tracking.

## Features

- 📈 Real-time stock price updates
- 📊 Interactive stock charts and analysis
- 💾 Save and track favorite stocks
- 🔔 Price alerts and notifications
- 📱 Responsive iOS interface
- 🌙 Dark mode support

## Requirements

- iOS 13.0+
- Xcode 12.0+
- CocoaPods

## Installation

### Clone the repository
```bash
git clone https://github.com/Elbakh94/Bright-stock-analysis.git
cd Bright-stock-analysis
```

### Install dependencies
```bash
pod install
```

### Open the project
```bash
open BrightStockAnalysis.xcworkspace
```

## Build & Run

1. Open `BrightStockAnalysis.xcworkspace` in Xcode
2. Select your target device or simulator
3. Press `Cmd + R` to build and run

## Project Structure

```
BrightStockAnalysis/
├── AppDelegate.swift           # Application entry point
├── ViewController.swift         # Main view controller
├── Models/
│   └── Stock.swift            # Stock data model
├── Services/
│   └── StockService.swift      # API service
├── Views/
│   └── (UI components)
└── Info.plist                  # App configuration

Podfile                         # Dependency management
```

## Dependencies

- **Alamofire**: Networking
- **SwiftyJSON**: JSON parsing
- **Charts**: Data visualization
- **SnapKit**: Auto Layout DSL

## API Integration

Update the `baseURL` in `StockService.swift` with your API endpoint.

```swift
private let baseURL = "https://your-api.com"
```

## Configuration

### App Settings

Edit `Info.plist` to configure:
- App name and version
- Supported orientations
- Network security settings

## Testing

Run unit tests:
```bash
Cmd + U
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

**Elbakh94**
- GitHub: [@Elbakh94](https://github.com/Elbakh94)

## Support

For support, open an issue on the [GitHub repository](https://github.com/Elbakh94/Bright-stock-analysis/issues).

## Changelog

### Version 1.0 (2026-05-04)
- Initial iOS app setup
- Core features implementation
- Stock data model
- API service integration
