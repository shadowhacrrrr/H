export default function handler(req, res) {
  if (req.method === 'POST') {
    // Forward to backend
    const { uuid, type, data, device_info } = req.body

    // Log for debugging
    console.log('Notification received:', { uuid, type, device: device_info?.model })

    res.status(200).json({ success: true, message: 'Notification logged' })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
