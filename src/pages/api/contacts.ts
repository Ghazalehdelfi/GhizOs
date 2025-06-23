import { createClient } from '@supabase/supabase-js'
import type { NextApiRequest, NextApiResponse } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Contact {
  id: string
  firstName: string
  lastName: string
  email?: string
  agentName?: string
  agentUrl?: string
  createdAt: string
  updatedAt: string
}

// Helper functions for Supabase operations
async function getAllContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contacts:', error)
    return []
  }

  return (
    data?.map((row) => ({
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      agentName: row.agent_name,
      agentUrl: row.agent_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) || []
  )
}

async function createContact(
  contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      id: Math.random().toString(36).substring(2, 15),
      first_name: contact.firstName,
      last_name: contact.lastName,
      email: contact.email || null,
      agent_name: contact.agentName || null,
      agent_url: contact.agentUrl || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating contact:', error)
    return null
  }

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    agentName: data.agent_name,
    agentUrl: data.agent_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

async function deleteContact(id: string): Promise<boolean> {
  const { error } = await supabase.from('contacts').delete().eq('id', id)

  if (error) {
    console.error('Error deleting contact:', error)
    return false
  }

  return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const contacts = await getAllContacts()
        res.status(200).json({ contacts })
      } catch (error) {
        console.error('Error fetching contacts:', error)
        res.status(500).json({ error: 'Failed to fetch contacts' })
      }
      break

    case 'POST':
      try {
        const { firstName, lastName, email, agentName, agentUrl } = req.body

        if (!firstName || !lastName) {
          return res
            .status(400)
            .json({ error: 'First name and last name are required' })
        }

        const newContact = await createContact({
          firstName,
          lastName,
          email,
          agentName,
          agentUrl,
        })

        if (newContact) {
          res.status(201).json({ contact: newContact })
        } else {
          res.status(500).json({ error: 'Failed to create contact' })
        }
      } catch (error) {
        console.error('Error creating contact:', error)
        res.status(500).json({ error: 'Failed to create contact' })
      }
      break

    case 'DELETE':
      try {
        const { id } = req.query

        if (!id || typeof id !== 'string') {
          return res.status(400).json({ error: 'Contact ID is required' })
        }

        const success = await deleteContact(id)
        if (success) {
          res.status(200).json({ message: 'Contact deleted successfully' })
        } else {
          res.status(500).json({ error: 'Failed to delete contact' })
        }
      } catch (error) {
        console.error('Error deleting contact:', error)
        res.status(500).json({ error: 'Failed to delete contact' })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE'])
      res.status(405).json({ error: 'Method not allowed' })
  }
}
