#!/bin/bash

echo "🔧 Installing Attribution Guard Scanner Dependencies..."

# Install Python package
echo "📦 Installing Playwright..."
pip3 install playwright

# Install browser binaries
echo "🌐 Installing browser binaries..."
playwright install

# Test installation
echo "🧪 Testing installation..."
python3 -c "import playwright; print('✅ Playwright installed successfully!')"

echo "🎉 Installation complete! Real-time scanning is now available."
echo "💡 Restart your development server to use the real scanner."
