export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  }
  if (err.name === 'ZodError') {
    return res.status(400).json({ error: err.errors?.[0]?.message || 'Invalid input' });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 10 MB.' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}
