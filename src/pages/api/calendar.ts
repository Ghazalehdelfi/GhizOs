import fs from 'fs'
import { JWT } from 'google-auth-library'
import { google } from 'googleapis'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

// Initialize JWT client with service account credentials
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON)

const jwtClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/calendar'],
})

const calendar = google.calendar({ version: 'v3', auth: jwtClient })

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { date } = req.query
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Date parameter is required' })
    }

    // Parse the date and create start/end times in the user's timezone
    const [year, month, day] = date.split('-').map(Number)

    // Create dates in the user's local timezone (America/New_York)
    const startDate = new Date(year, month - 1, day, 0, 0, 0, 0)
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999)

    const response = await calendar.events.list({
      calendarId: 'alex.farner93@gmail.com', // Your calendar ID
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      timeZone: 'America/New_York', // Specify the timezone
    })

    const events =
      response.data.items?.map((event) => ({
        id: event.id,
        title: event.summary || 'Untitled Event',
        startTime: event.start?.dateTime || event.start?.date,
        endTime: event.end?.dateTime || event.end?.date,
      })) || []

    res.status(200).json({ events })
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    res.status(500).json({ error: 'Failed to fetch calendar events' })
  }
}
