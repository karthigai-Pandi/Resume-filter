export default function handler(req, res) {
  return res.status(200).json({ status: 'ok', version: '1.0.0' });
}
