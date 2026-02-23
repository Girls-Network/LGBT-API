import express, { Request, Response } from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';

const app = express();
const PORT = 3000;

// Middleare to parse JSON
app.use(express.json());

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'why you here lul' });
});

// Main endpoint to get content from docs
app.get('/api/:keyword', async (req: Request, res: Response) => {
  try {
    const keyword = req.params.keyword;
    let content: string;
    let type: 'gender' | 'sexuality';
    
    // Try to find the file in gender folder
    try {
      const genderPath = join(__dirname, '..', 'docs', 'gender', `${keyword}.txt`);
      content = await readFile(genderPath, 'utf-8');
      type = 'gender';
    } catch (genderError) {
      // Try to find the file in sexuality folder
      try {
        const sexualityPath = join(__dirname, '..', 'docs', 'sexuality', `${keyword}.txt`);
        content = await readFile(sexualityPath, 'utf-8');
        type = 'sexuality';
      } catch (sexualityError) {
        // File not found in either folder
        throw new Error('ENOENT');
      }
    }
    
    // Return in the specified format
    res.json({
      content: content.trim(),
      type: type
    });
  } catch (error) {
    if (error instanceof Error && (error.message === 'ENOENT' || ('code' in error && error.code === 'ENOENT'))) {
      res.status(404).json({
        error: 'File not found',
        message: `No content found for keyword: ${req.params.keyword}`
      });
    } else {
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Lol, yeah sure I'll add this Ari
app.get('/coffee', (req: Request, res: Response) =>
    res.status(418).json({
        error: "I'm a teapot",
        message: "This server is a teapot, not a coffee maker. I cannot brew coffee"
    })
)

// Okay this I have to do
app.get('/coke', (req: Request, res: Response) =>
    res.status(420).json({
        error: "Enhance Your Calm",
        message: "Damn... error 420 is srsly called this?"
    })
)

app.get('/*path', (req: Request, res: Response) =>
  res.status(404).json({
    error: "Page Not Found",
    message: "Yeah this is just a simple api mate, nothing major"
  })
)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at: http://localhost:${PORT}/api/<keyword>`);
});
