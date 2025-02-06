import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

// Function to get all files in the directory (non-recursive)
const getFilesInDirectory = (dir: string): string[] => {
  const files = fs.readdirSync(dir);
  return files.filter((file) => {
    const fullPath = path.join(dir, file);
    return fs.statSync(fullPath).isFile();
  });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dirPath = path.join(process.cwd(), 'src', 'data', 'writing');
    const allFiles = getFilesInDirectory(dirPath);
    
    res.status(200).json({ files: allFiles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to read directory' });
  }
}