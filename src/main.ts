import express, { Request, Response } from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';

const app = express();
const PORT = 3000;

// Middleare to parse JSON
app.use(express.json());

// Main endpoint to get content from docs
app.get('/api/:keyword', async (req: Request, res: Response) => {
  try {
    const keyword = req.params.keyword;
    // Path goes up from dist/ to project root, then into docs/
    const filePath = join(__dirname, '..', 'docs', `${keyword}.txt`);
    
    // Read the file content
    const content = await readFile(filePath, 'utf-8');
    
    // Return in the specified format
    res.json({
      content: content
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at: http://localhost:${PORT}/api/<keyword>`);
});