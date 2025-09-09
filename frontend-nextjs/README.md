# DeepFake Detection System - Next.js Frontend

A modern, responsive frontend built with Next.js, TypeScript, and Tailwind CSS for the DeepFake Detection System.

## ✨ Features

- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Drag & Drop File Upload**: Intuitive file selection with progress tracking
- **Real-time Analysis**: Live updates during file processing
- **Detailed Results**: Comprehensive analysis results with confidence scores
- **Export Functionality**: Download results as CSV files
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **Dark Mode**: Coming soon

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- DeepFake Detection Backend running on port 5000

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Copy the example env file
   cp .env.local.example .env.local
   
   # Edit .env.local with your backend URL
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── FileUpload.tsx # File upload component
│   └── AnalysisResults.tsx # Results display
├── lib/               # Utilities and API
│   ├── api.ts         # Backend API integration
│   └── utils.ts       # Helper functions
└── types/             # TypeScript definitions
    └── index.ts       # Type definitions
```

## 🎨 UI Components

The frontend uses a custom component library built with:

- **Tailwind CSS**: For styling and responsive design
- **Framer Motion**: For smooth animations
- **Lucide React**: For consistent icons
- **React Hot Toast**: For notifications
- **React Dropzone**: For file upload functionality

### Key Components

- **FileUpload**: Drag & drop file selection with validation
- **AnalysisResults**: Detailed results display with export options
- **Button**: Consistent button component with variants
- **Card**: Reusable card layout component

## 🔌 Backend Integration

The frontend connects to the DeepFake Detection API with the following endpoints:

- `GET /api/health` - System health check
- `POST /api/upload` - File upload
- `POST /api/analyze` - Start analysis
- `GET /api/jobs/{id}` - Get job status
- `GET /api/jobs` - List all jobs
- `GET /api/statistics` - System statistics

### API Features

- **File Upload Progress**: Real-time upload progress tracking
- **Polling**: Automatic status polling for analysis jobs
- **Error Handling**: Comprehensive error handling with user feedback
- **Bulk Operations**: Support for multiple file analysis

## 🎯 Features

### File Upload
- Drag & drop or click to upload
- Multiple file selection
- File type validation (images, videos, audio)
- Size limit validation (100MB max)
- Progress tracking
- File preview

### Analysis
- Real-time progress updates
- Multiple file processing
- Automatic status polling
- Error recovery
- Cancel operations

### Results
- Confidence score visualization
- Evidence analysis breakdown
- Processing time and details
- Export individual or bulk results
- Share functionality
- Historical results

### User Experience
- Loading states and animations
- Toast notifications
- Responsive design
- Keyboard shortcuts
- Screen reader support

## 🔧 Configuration

### Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:5000  # Backend API URL

# Optional
NODE_ENV=development                       # Environment mode
```

### Customization

#### Colors and Themes
Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        500: '#3b82f6',
        600: '#2563eb',
        // ...
      }
    }
  }
}
```

#### API Configuration
Modify `src/lib/api.ts` to adjust:
- Request timeouts
- Retry logic
- Error handling
- Response interceptors

## 📱 Responsive Design

The interface is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

Key responsive features:
- Collapsible navigation
- Adaptive grid layouts
- Touch-friendly interactions
- Optimized text sizes

## ♿ Accessibility

Built with accessibility in mind:

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and live regions
- **High Contrast**: Support for high contrast mode
- **Focus Management**: Proper focus handling
- **Alt Text**: Descriptive alt text for images

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on git push**

### Docker

```bash
# Build the container
docker build -t deepfake-frontend .

# Run the container
docker run -p 3000:3000 deepfake-frontend
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Backend Connection Issues**
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Verify environment variables
echo $NEXT_PUBLIC_API_URL
```

**File Upload Failures**
- Check file size (max 100MB)
- Verify file type is supported
- Ensure backend has proper CORS configuration

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

For more help, check the [Issues](https://github.com/your-repo/issues) section.