import { useRouter } from 'next/router'
import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Users, X, User, Calendar } from 'lucide-react'

import { Detail } from '~/components/ListDetail/Detail'
import { TitleBar } from '~/components/ListDetail/TitleBar'

interface Message {
  role: 'user' | 'agent'
  content: string
}

interface Contact {
  id: string
  firstName: string
  lastName: string
  email?: string
  agentName: string
  agentUrl?: string
}

interface CalendarEvent {
  id: string
  title: string
  startTime: string
  endTime: string
}

export default function Chatbot() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [isContactsOpen, setIsContactsOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newAgentName, setNewAgentName] = useState('')
  const [newAgentUrl, setNewAgentUrl] = useState('')
  const [isCreatingContact, setIsCreatingContact] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const contactsPanelRef = useRef<HTMLDivElement>(null)
  const calendarPanelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate a new session ID when component mounts
    setSessionId(Math.random().toString(36).substring(2, 15))
    // Load contacts from database
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contacts')
      if (response.ok) {
        const data = await response.json()
        setContacts(data.contacts || [])
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isContactsOpen &&
        contactsPanelRef.current &&
        !contactsPanelRef.current.contains(event.target as Node)
      ) {
        setIsContactsOpen(false)
      }
      if (
        isCalendarOpen &&
        calendarPanelRef.current &&
        !calendarPanelRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isContactsOpen, isCalendarOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFirstName.trim() || !newLastName.trim()) return

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: newFirstName.trim(),
          lastName: newLastName.trim(),
          email: newEmail.trim() || null,
          agentName: newAgentName.trim() || null,
          agentUrl: newAgentUrl.trim() || null,
        })
      })

      if (response.ok) {
        const data = await response.json()
        setContacts(prev => [data.contact, ...prev])
        setNewFirstName('')
        setNewLastName('')
        setNewEmail('')
        setNewAgentName('')
        setNewAgentUrl('')
        setIsCreatingContact(false)
      } else {
        console.error('Failed to create contact')
      }
    } catch (error) {
      console.error('Error creating contact:', error)
    }
  }

  const handleCancelCreate = () => {
    setNewFirstName('')
    setNewLastName('')
    setNewEmail('')
    setNewAgentName('')
    setNewAgentUrl('')
    setIsCreatingContact(false)
  }

  const handleRemoveContact = async (contactId: string) => {
    try {
      const response = await fetch(`/api/contacts?id=${contactId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setContacts(prev => prev.filter(contact => contact.id !== contactId))
      } else {
        console.error('Failed to delete contact')
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: userMessage,
            sessionId: sessionId
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response from server')
      }

      const data = await response.json()

      if (!data.agent_response) {
        throw new Error('Invalid response format from server')
      }

      const agentResponse = data.agent_response
      setMessages(prev => [...prev, { role: 'agent', content: agentResponse }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateChange = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    setSelectedDate(newDate)
    fetchEvents(newDate)
  }

  const fetchEvents = async (date: Date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0]
      const response = await fetch(`/api/calendar?date=${formattedDate}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events')
      }

      const data = await response.json()
      setEvents(data.events)
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      setEvents([])
    }
  }

  useEffect(() => {
    fetchEvents(selectedDate)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Detail.Container>
      <TitleBar
        backButton
        backButtonHref="/projects"
        title="✨ Secretary Agent"
        trailingAccessory={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
              title="View your events"
            >
              <Calendar size={20} />
            </button>
            <button
              onClick={() => setIsContactsOpen(!isContactsOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <Users size={20} />
            </button>
          </div>
        }
      />
      <Detail.ContentContainer>
        <Detail.Header>
          <Detail.Title>✨ Secretary Agent</Detail.Title>
          <p className="text-tertiary">
            🤖 Your personal AI secretary! Powered by advanced A2A protocol, this agent helps manage your calendar, contacts, and more. Stay organized and efficient with your digital assistant! 💼
          </p>
        </Detail.Header>

        <div className="flex flex-col h-[600px] bg-black rounded-lg shadow-lg relative">
          {/* Calendar Panel */}
          <div
            ref={calendarPanelRef}
            className={`fixed right-0 top-0 h-screen w-80 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
              isCalendarOpen ? 'translate-x-0' : 'translate-x-full'
            } border-l border-gray-800 z-50`}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Calendar</h3>
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => handleDateChange(-1)}
                    className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white"
                  >
                    ←
                  </button>
                  <span className="text-white">{formatDate(selectedDate)}</span>
                  <button
                    onClick={() => handleDateChange(1)}
                    className="p-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white"
                  >
                    →
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {events.length === 0 ? (
                  <div className="text-center text-gray-400">
                    No events scheduled for this day.
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="mb-4 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-500/30 hover:from-pink-500/30 hover:to-purple-500/30 transition-all duration-200"
                    >
                      <h4 className="text-white font-medium mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-300">
                        {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Contacts Panel */}
          <div
            ref={contactsPanelRef}
            className={`fixed right-0 top-0 h-screen w-80 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
              isContactsOpen ? 'translate-x-0' : 'translate-x-full'
            } border-l border-gray-800 z-50`}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Contacts</h3>
                  <button
                    onClick={() => setIsContactsOpen(false)}
                    className="p-1 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
                {isCreatingContact ? (
                  <form onSubmit={handleAddContact} className="space-y-2">
                    <input
                      type="text"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      placeholder="First name..."
                      className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-white"
                    />
                    <input
                      type="text"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      placeholder="Last name..."
                      className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-white"
                    />
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Email (optional)..."
                      className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-white"
                    />
                    <input
                      type="text"
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                      placeholder="Agent name (optional)..."
                      className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-white"
                    />
                    <input
                      type="url"
                      value={newAgentUrl}
                      onChange={(e) => setNewAgentUrl(e.target.value)}
                      placeholder="Agent URL (optional)..."
                      className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-white"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 px-3 py-2 bg-pink-300 text-gray-900 rounded-lg hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        Save Contact
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelCreate}
                        className="px-3 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsCreatingContact(true)}
                    className="w-full px-3 py-2 bg-pink-300 text-gray-900 rounded-lg hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    Create New Contact
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                {contacts.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    No contacts yet. Click "Create New Contact" to add one!
                  </div>
                ) : (
                  contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-800 border-b border-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-full">
                          <User size={16} className="text-pink-300" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{contact.firstName} {contact.lastName}</h4>
                          {contact.email && (
                            <p className="text-sm text-gray-400">{contact.email}</p>
                          )}
                          {contact.agentName && (
                            <p className="text-sm text-gray-400">Agent: {contact.agentName}</p>
                          )}
                          {contact.agentUrl && (
                            <p className="text-xs text-gray-500 truncate max-w-48" title={contact.agentUrl}>
                              URL: {contact.agentUrl}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveContact(contact.id)}
                        className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-pink-300 text-gray-900'
                      : 'bg-gray-600 text-gray-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-600 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-800 text-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-pink-300 text-gray-900 rounded-lg hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </Detail.ContentContainer>
    </Detail.Container>
  )
} 