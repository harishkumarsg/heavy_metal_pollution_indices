# Heavy Metal Pollution Monitoring Dashboard

A comprehensive real-time pollution monitoring system built with Next.js 14, React 18, and TypeScript.

## 🌟 Features

### Core Functionality
- **Real-time Pollution Monitoring**: Live data updates with WebSocket simulation
- **Interactive Pollution Map**: Click on monitoring sites to view detailed analysis
- **Heavy Metal Pollution Index (HMPI)**: Comprehensive pollution assessment
- **Multi-site Monitoring**: Track pollution across multiple geographic locations

### Enhanced User Experience
- **Light/Dark Mode Toggle**: Seamless theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Intuitive Navigation**: Fixed sidebar navigation with proper routing
- **Real-time Notifications**: Instant alerts for critical pollution levels

### Advanced Analytics
- **Site Details Modal**: Comprehensive analysis for each monitoring location
  - Historical trend charts (30-day HMPI data)
  - Metal concentration analysis with safety limits
  - Environmental impact assessment
  - Real-time pH, temperature, and conductivity monitoring
- **Interactive Map Controls**: 
  - Display settings (layer controls, opacity adjustments)
  - Advanced filtering (status, HMPI range, metal types)
  - Real-time settings (auto-refresh intervals, connection status)
- **Enhanced Map Legend**: 
  - Live statistics dashboard
  - Metal concentration tracking
  - Data freshness indicators

### Technical Features
- **WebSocket Simulation**: Real-time data streaming
- **Performance Optimization**: React.memo for component efficiency
- **TypeScript Integration**: Full type safety and developer experience
- **Modern UI Components**: Built with Radix UI and Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/harishkumarsg/heavy_metal_pollution_indices.git
   cd heavy_metal_pollution_indices
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Dashboard Features

### Main Dashboard (`/dashboard`)
- **Pollution Map**: Interactive map with real-time monitoring sites
- **Map Controls**: Comprehensive filtering and display options
- **Map Legend**: Live statistics and pollution level indicators
- **Site Details**: Click any marker to view detailed analysis

### Navigation
- **Home**: Landing page with project overview
- **Dashboard**: Main monitoring interface
- **Reports**: Pollution analysis and reporting (placeholder)
- **Settings**: Configuration options (placeholder)

## 🛠 Technology Stack

- **Framework**: Next.js 14.2.16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Theme Management**: next-themes

## 📱 Components

### Core Components
- `PollutionMap`: Main interactive map component
- `MapControls`: Advanced filtering and display controls
- `MapLegend`: Real-time statistics and legend
- `SiteDetails`: Comprehensive site analysis modal

### UI Components
- `ThemeToggle`: Light/dark mode switcher
- `DashboardSidebar`: Navigation sidebar
- `DashboardHeader`: Top navigation bar

## 🔧 Configuration

The application uses modern React patterns including:
- Server-side rendering with Next.js App Router
- Client-side state management with React hooks
- Real-time data simulation for demonstration
- Responsive design with Tailwind CSS
- Accessible UI components with Radix UI

## 📈 Data Visualization

### HMPI Classification
- **Excellent (0-1)**: Very low pollution - Green indicators
- **Good (1-2)**: Low pollution - Blue indicators  
- **Moderate (2-3)**: Moderate pollution - Orange indicators
- **Poor (3+)**: High pollution - Red indicators

### Monitoring Parameters
- Heavy Metal Pollution Index (HMPI)
- Individual metal concentrations (Pb, Cd, Hg, As, Cr)
- Water quality parameters (pH, temperature, conductivity)
- Environmental conditions (wind, humidity, pressure)

## 🌍 Environmental Impact

This dashboard helps monitor and analyze:
- Groundwater contamination levels
- Heavy metal pollution trends
- Environmental health assessments
- Water safety compliance
- Real-time pollution alerts

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions, please open an issue on the GitHub repository.

---

Built with ❤️ for environmental monitoring and public health protection.