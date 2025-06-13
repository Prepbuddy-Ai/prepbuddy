# PrepBuddy - AI-Powered Study Planner

A professional EdTech application that transforms your study materials into personalized learning plans using **real AI models** - completely free!

## 🤖 Real AI Integration

PrepBuddy uses **actual AI models** to analyze your content and generate truly personalized study plans:

### Free AI Providers Supported:

1. **🚀 Groq API** (Recommended)
   - **Model**: Llama 3 8B-8192 (Fast & Powerful)
   - **Free Tier**: 100 requests/day
   - **Setup**: [console.groq.com](https://console.groq.com/)

2. **⚡ Together AI**
   - **Model**: Mixtral-8x7B-Instruct
   - **Free Tier**: Available
   - **Setup**: [api.together.xyz](https://api.together.xyz/)

3. **🔄 OpenRouter**
   - **Models**: Multiple free options
   - **Free Tier**: Various models available
   - **Setup**: [openrouter.ai](https://openrouter.ai/)

## ✨ What Makes PrepBuddy Different

### Real AI Analysis:
- **Content Understanding**: AI actually reads and comprehends your material
- **Topic Extraction**: Identifies key concepts from your specific content
- **Complexity Analysis**: Adapts to your material's difficulty level
- **Personalized Tasks**: Creates specific activities based on your content

### Smart Fallbacks:
- **Enhanced Algorithms**: Intelligent content processing when AI isn't available
- **Always Works**: Never fails to generate a study plan
- **Progressive Enhancement**: Better with AI, still great without

### Unified Interface:
- **File Upload + Text Input**: Single form accepts both documents and additional notes
- **Multiple Formats**: PDF, DOCX, TXT, MD, RTF, LaTeX, BibTeX support
- **Large File Support**: Up to 25MB for comprehensive documents
- **Academic Focus**: Designed specifically for educational content

## 🚀 Quick Setup (2 minutes)

### Option 1: Use with Real AI (Recommended)

1. **Get a Free API Key** (choose one):
   ```bash
   # Groq (Recommended - fastest)
   Visit: https://console.groq.com/
   
   # Together AI
   Visit: https://api.together.xyz/
   
   # OpenRouter
   Visit: https://openrouter.ai/
   ```

2. **Add to Environment**:
   ```bash
   cp .env.example .env
   # Add your key to .env file
   ```

3. **Run PrepBuddy**:
   ```bash
   npm install
   npm run dev
   ```

### Option 2: Use Smart Fallbacks (No Setup)
Just run the app - it works immediately with intelligent algorithms!

## 🎯 Features

- **📄 Universal File Support**: PDF, DOCX, TXT, MD, RTF, LaTeX, BibTeX
- **✍️ Combined Input**: Upload files AND add additional notes
- **🤖 Real AI Analysis**: Actual content understanding and personalization
- **⚙️ Full Customization**: Duration, study time, difficulty levels
- **📊 Progress Tracking**: Interactive task completion system
- **🎨 Beautiful Design**: Production-ready, academic-focused interface
- **🔄 Smart Fallbacks**: Always works, even without AI setup

## 🧠 How PrepBuddy's AI Works

1. **Content Analysis**: AI reads your entire document and additional notes
2. **Topic Identification**: Extracts key concepts and learning objectives
3. **Complexity Assessment**: Determines appropriate difficulty and pacing
4. **Schedule Optimization**: Creates logical learning progression
5. **Task Generation**: Specific activities tailored to your content

## 📊 Example AI Output

Instead of generic tasks like "Read chapter 1", PrepBuddy creates:
- "Analyze the relationship between X and Y concepts from your uploaded material"
- "Practice the specific methodology described in section 2 of your document"
- "Create examples based on the case studies provided in your notes"

## 🔧 Technical Details

- **Frontend**: React + TypeScript + Tailwind CSS
- **AI Integration**: Multiple providers with automatic failover
- **File Processing**: PDF.js for PDFs, Mammoth.js for Word documents
- **Content Analysis**: Advanced NLP for fallback mode
- **Error Handling**: Graceful degradation with smart fallbacks
- **Performance**: Optimized for speed and reliability

## 🌟 Why PrepBuddy's Approach?

1. **Real Personalization**: AI understands YOUR specific content
2. **Cost-Effective**: Uses free AI services with smart fallbacks
3. **Reliable**: Multiple providers + intelligent algorithms
4. **Privacy-Focused**: Your content stays secure
5. **Production-Ready**: Professional quality for real academic use
6. **Academic-Focused**: Built specifically for educational content

## 🚀 Deployment

Ready for production deployment:

```bash
npm run build
# Deploy to Netlify, Vercel, or any static host
```

## 🤝 Contributing

Want to add more AI providers or improve the algorithms? Contributions welcome!

## 📄 License

MIT License - Build amazing EdTech tools with real AI!

---

**🎓 Transform your learning with PrepBuddy - Your AI study companion that actually understands your content!**